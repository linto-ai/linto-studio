const debug = require("debug")(
  "linto:components:EditorHandler:migrateLegacyState",
)
const Y = require("yjs")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { docToTurnsLegacy } = require("../schema/legacy/docToTurnsLegacy")
const { enrichDiff } = require("../flush/enrichDiff")

// One-shot generation migration: read the old (word-mark) state with the
// legacy schema, merge its text/wids with Mongo's timestamps through the
// legacy wid mapping (enrichDiff — kept alive for exactly this), persist,
// and bump the epoch so every lineage participant rebuilds on plain text.
async function migrateLegacyState(
  conversationId,
  epoch,
  storedState,
  mongoTurns,
  documentName,
) {
  debug(`migrating gen-1 editor state for doc=${documentName}`)
  try {
    const legacyDoc = new Y.Doc()
    Y.applyUpdate(legacyDoc, storedState)
    const legacyTurns = docToTurnsLegacy(legacyDoc)
    legacyDoc.destroy()

    const { finalTurns, hasChanges } = enrichDiff(mongoTurns, legacyTurns)
    if (hasChanges) {
      // Epoch-guarded: if another replica migrated concurrently (epoch
      // already bumped), this write is inert and the bump below is a
      // harmless second increment.
      await model.conversations.replaceTurns(conversationId, finalTurns, epoch)
    }
  } catch (err) {
    // Migration read failed: Mongo keeps the last flushed text (the state
    // may have been ahead by at most one debounce window). Proceed with the
    // bump — staying on a dead generation would brick the document.
    console.error(`Legacy state migration failed for doc=${documentName}:`, err)
  }
  // Epoch-guarded: if another replica migrated this conversation
  // concurrently, its bump already moved the epoch — bumping again would
  // kill the freshly migrated lineage (and up to a debounce window of
  // edits on it).
  await model.conversations.bumpEditorEpoch(conversationId, epoch)
}

module.exports = { migrateLegacyState }
