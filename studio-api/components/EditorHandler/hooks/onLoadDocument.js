const debug = require("debug")("linto:components:EditorHandler:onLoadDocument")
const Y = require("yjs")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { seedYDoc } = require("../schema/seedYDoc")
const { seedSpeakers } = require("../schema/seedSpeakers")
const { SCHEMA_GEN } = require("../schema/generation")
const { WordsState } = require("../wordsState/wordsState")
const { attachTurnIdAuthority } = require("../turnIds")
const { parseDocumentName } = require("../utils/parseDocumentName")
const { migrateLegacyState } = require("./migrateLegacyState")

// The Y.XmlFragment field the editor binds to (client Collaboration.field).
const FRAGMENT_FIELD = "default"

// Mongo returns the persisted Yjs state as a BSON Binary; Yjs wants a Uint8Array.
function binaryToUint8(state) {
  if (state instanceof Uint8Array) return state
  if (state && state.buffer) return new Uint8Array(state.buffer)
  return null
}

async function onLoadDocument({ document, documentName, context }) {
  debug(`onLoadDocument: doc=${documentName} user=${context?.userId}`)
  const parsed = parseDocumentName(documentName)
  if (!parsed) {
    throw new Error("Invalid document name")
  }
  const { conversationId, epoch } = parsed

  const conversation = await model.conversations.getById(conversationId, [
    "text",
    "speakers",
    "editorEpoch",
  ])
  if (!conversation || conversation.length !== 1) {
    throw new Error(`Conversation ${conversationId} not found`)
  }

  // Epoch may have been bumped between authentication and load: refuse,
  // the client reconnects and gets the stale-epoch rejection at auth.
  const currentEpoch = conversation[0].editorEpoch ?? 0
  if (epoch !== currentEpoch) {
    throw new Error("Stale editor epoch")
  }

  const turns = conversation[0].text || []
  const speakers = conversation[0].speakers || []

  const stored = await model.editorStates.get(conversationId)
  const storedState =
    stored && stored.epoch === epoch ? binaryToUint8(stored.state) : null

  // A persisted state written with an older schema generation (word marks
  // in the doc) cannot be replayed into a plain-text lineage: migrate it —
  // flush its content to Mongo through the legacy read path, bump the
  // epoch, and abort this load. The client reconnects, gets the
  // stale-epoch rejection, refetches and rebuilds on a fresh plain-text
  // lineage seeded from the migrated turns.
  if (storedState && (stored.gen ?? 1) < SCHEMA_GEN) {
    await migrateLegacyState(
      conversationId,
      epoch,
      storedState,
      turns,
      documentName,
    )
    throw new Error("Editor schema migrated — stale epoch")
  }

  if (storedState) {
    // Replay the persisted CRDT state: the history lineage stays
    // continuous, so clients reconnecting with an older replica of the
    // same lineage merge cleanly (their state is a prefix of ours, or
    // they hold ops we lost and resend them).
    Y.applyUpdate(document, storedState)
    debug(`onLoadDocument: doc=${documentName} restored persisted state`)
  } else {
    // First load of this lineage: seed from Mongo turns. Never reseed an
    // existing lineage — the fixed seed clientID with different content
    // would collide with the ops clients already hold.
    seedYDoc(document, turns)
    seedSpeakers(document, speakers)
  }

  // Epoch this in-memory doc belongs to; flush writes are guarded with it.
  document.lintoEpoch = epoch

  // Per-replica companion state: words+timestamps derived from the doc.
  // Hydrated by alignment (the persisted state may be AHEAD of the last
  // Mongo flush — the invariant is state >= text), then kept up to date by
  // the hot path on every Yjs transaction. The observers live and die with
  // the document instance.
  const turnsFragment = document.getXmlFragment(FRAGMENT_FIELD)
  const wordsState = new WordsState(turnsFragment)
  wordsState.hydrate(turns)
  turnsFragment.observeDeep((events) => {
    try {
      wordsState.applyEvents(events)
    } catch (err) {
      // A half-applied batch can leave one turn's mirror corrupt, and later
      // batches only self-check the turns THEY touch — heal everything now
      // so the next flush persists doc-accurate text.
      console.error(`WordsState apply failed for doc=${documentName}:`, err)
      try {
        wordsState.realignAll()
      } catch (realignErr) {
        console.error(
          `WordsState realign failed for doc=${documentName}:`,
          realignErr,
        )
      }
    }
  })
  document.lintoWords = wordsState

  // The server is the turn-id authority in collab: a turn arriving with a
  // null id, or a pasted turn with a duplicated one — both repaired here.
  attachTurnIdAuthority(turnsFragment)

  return document
}

module.exports = { onLoadDocument }
