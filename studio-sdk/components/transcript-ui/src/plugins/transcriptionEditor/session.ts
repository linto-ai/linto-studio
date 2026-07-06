import { Doc } from "yjs"
import { getSchema } from "@tiptap/vue-3"
import type { Editor } from "@tiptap/vue-3"
import { Text } from "@tiptap/extension-text"
import { prosemirrorJSONToYXmlFragment } from "@tiptap/y-tiptap"
import { HocuspocusProvider } from "@hocuspocus/provider"
import type { Transaction } from "@tiptap/pm/state"

import type { Core, TranslationStore, YjsUser } from "../../core/types"
import { createTiptapEditor } from "./createTiptapEditor"
import type { DebugFlags, FlightRecorder } from "./debug/syncFlightRecorder"
import { SpeakersSync, seedSpeakersMap } from "./utils/speakersSync"
import { applyStatelessPayload, REQUEST_WORDS_MESSAGE } from "./statelessWords"
import { turnsToDoc } from "./utils/turnsToDoc"
import { TranscriptionDocument } from "./extensions/transcriptionDocument"
import { TurnNode } from "./extensions/turnNode"

export interface CollabOptions {
  /** Hocuspocus WebSocket URL (e.g. "ws://localhost/ws/editor") */
  url: string
  /** JWT token for authentication */
  token: string
  /**
   * Editor epoch per translation id (= conversation id), as fetched from the
   * API. The epoch identifies the server-side CRDT history lineage and is
   * appended to the Hocuspocus document name; the server rejects connections
   * whose epoch is stale (history rebuilt after an external write).
   * Missing entry defaults to 0.
   */
  epochs?: Record<string, number>
  /**
   * Called when the server rejects the connection at authentication —
   * invalid/expired token, lost access, or stale epoch. For a stale epoch
   * the host should refetch the document (fresh epochs) and reload it.
   */
  onAuthenticationFailed?: (reason: string) => void
}

export interface LocalUser {
  name: string
  color: string
  [key: string]: unknown
}

/**
 * Plugin-side surface a session publishes its reactive state through.
 * The plugin owns the state (refs stay stable across session restarts);
 * sessions only push into it.
 */
export interface SessionHost {
  setEditor(editor: Editor | undefined): void
  setConnected(connected: boolean): void
  setUsers(users: YjsUser[]): void
  /** Local collaborator identity; plugin-owned so it survives restarts. */
  readonly user: LocalUser
}

export interface SessionDeps {
  core: Core
  host: SessionHost
  /** The editable translation this session is bound to — fixed for its lifetime. */
  translation: TranslationStore
  field: string
  readOnly: boolean
  /** Sync-crash instrumentation; both null unless the debug flag is on. */
  debugFlags: DebugFlags
  recorder: FlightRecorder | null
}

/** A session owns the resources bound to one translation: a Y.Doc, an
 *  optional provider, a Tiptap editor. destroy() releases all of them. */
export interface EditorSession {
  readonly ydoc: Doc
  /** Broadcast the (already updated) host.user to remote participants. */
  updateUser(): void
  destroy(): void
}

// View-crash recovery storm guard: a deterministic crash cause would
// otherwise rebuild (full teardown + initial render of the whole transcript)
// at transaction rate, forever. Past the cap, give up and surface an error.
const MAX_REBUILDS = 3
const REBUILD_WINDOW_MS = 30_000

/** True when one more rebuild is allowed inside the sliding window;
 *  `timestamps` is mutated in place. */
function allowRebuild(timestamps: number[]): boolean {
  const now = Date.now()
  while (timestamps.length > 0 && now - timestamps[0]! > REBUILD_WINDOW_MS) {
    timestamps.shift()
  }
  if (timestamps.length >= MAX_REBUILDS) return false
  timestamps.push(now)
  return true
}

export class CollabSession implements EditorSession {
  readonly ydoc: Doc
  private readonly deps: SessionDeps
  private readonly provider: HocuspocusProvider
  private editor: Editor | null = null
  private speakersSync: SpeakersSync | null = null
  private destroyed = false
  private readonly rebuilds: number[] = []

  constructor(deps: SessionDeps, collab: CollabOptions) {
    this.deps = deps
    this.ydoc = new Doc()
    // The epoch is part of the document identity: it pins this session (and
    // its Y.Doc) to one server-side history lineage. Read at construction —
    // a bumped epoch always comes with a session restart.
    const epoch = collab.epochs?.[deps.translation.id] ?? 0
    const recorder = deps.recorder
    recorder?.record("collab-session-created", {
      document: `${deps.translation.id}.${epoch}`,
      readOnly: deps.readOnly,
    })
    // The server seeds the Y.Doc; the editor is created on first sync.
    this.provider = new HocuspocusProvider({
      url: collab.url,
      name: `${deps.translation.id}.${epoch}`,
      token: collab.token,
      document: this.ydoc,
      onSynced: () => this.handleSynced(),
      onDisconnect: () => {
        recorder?.record("provider-disconnected", {})
        deps.host.setConnected(false)
      },
      onAuthenticationFailed: ({ reason }) => {
        // A stale epoch lands here: the server rebuilt the CRDT lineage and
        // every client reloads from scratch — worth correlating with crashes.
        recorder?.record("auth-failed", { reason })
        collab.onAuthenticationFailed?.(reason)
      },
      onAwarenessUpdate: ({ states }) => {
        recorder?.record("awareness-update", { users: states.length })
        deps.host.setUsers(mapAwarenessStates(states))
      },
      onStateless: ({ payload }) => {
        recorder?.record("stateless-received", { size: payload.length })
        applyStatelessPayload(payload, deps.translation)
      },
    })
  }

  updateUser(): void {
    this.provider.awareness?.setLocalStateField("user", this.deps.host.user)
  }

  destroy(): void {
    this.destroyed = true
    this.editor?.destroy() // also drops its "transaction" listeners
    this.editor = null
    this.speakersSync?.destroy()
    this.speakersSync = null
    this.provider.destroy() // before the doc: stops every Yjs callback
    this.ydoc.destroy()
  }

  /** Fires on every (re)sync of the provider, not just the first one. */
  private handleSynced(): void {
    this.deps.recorder?.record("provider-synced", {
      resync: this.editor !== null,
    })
    this.deps.host.setConnected(true)
    if (this.editor) {
      // Reconnect: the store is already hydrated — catch up on timestamps
      // recomputed while offline.
      this.requestWords()
      return
    }
    this.createEditor()
  }

  private createEditor(): void {
    const { core, host, translation, field, readOnly, debugFlags, recorder } =
      this.deps
    if (!this.speakersSync) this.speakersSync = new SpeakersSync(core, this.ydoc)
    this.editor = createTiptapEditor({
      core,
      ydoc: this.ydoc,
      field,
      translation,
      readOnly,
      // The server observes new turn elements and mints their ids.
      mintTurnIds: false,
      awareness: this.provider.awareness,
      user: host.user,
      debugFlags,
      recorder,
      onViewCrash: () => this.rebuildEditor(),
    })
    this.requestWordsWhenHydrated(this.editor)
    host.setEditor(this.editor)
  }

  /** View-crash recovery: the PM state and Y.Doc are still consistent, only
   *  the view's desc↔DOM tree is corrupted — rebuild the editor on the same
   *  Y.Doc (provider and speakersSync survive untouched). Capped: a
   *  deterministic crash gives up with an error instead of storming. */
  private rebuildEditor(): void {
    if (this.destroyed || !this.editor) return
    this.deps.recorder?.record("view-crash-rebuild", {})
    this.editor.destroy()
    this.editor = null
    this.deps.host.setEditor(undefined)
    if (!allowRebuild(this.rebuilds)) {
      console.error(
        "[transcriptionEditor] editor keeps crashing after rebuild — giving up",
      )
      this.deps.core.transcriptionEditor?.setError(
        "The editor crashed repeatedly. Reload the page to continue.",
      )
      return
    }
    this.createEditor()
  }

  /**
   * Words+timestamps live outside the Y.Doc and are served on demand
   * (stateless messages). Request them only once the store holds the turns —
   * requesting earlier would race the doc sync: applyStatelessPayload would
   * find no matching turn and silently drop the payload.
   *
   * The editor is created after the provider sync, so Tiptap builds its
   * initial state from the already-populated Y fragment during construction
   * — no docChanged transaction is dispatched for it (StoreSync fills the
   * store synchronously through the same path). Only an empty doc still
   * needs to wait for a first doc-changing transaction.
   */
  private requestWordsWhenHydrated(editor: Editor): void {
    if (isHydrated(editor)) {
      this.requestWords()
      return
    }
    const onFirstDocChange = (props: { transaction: Transaction }): void => {
      if (!props.transaction.docChanged) return
      editor.off("transaction", onFirstDocChange)
      this.requestWords()
    }
    editor.on("transaction", onFirstDocChange)
  }

  private requestWords(): void {
    this.provider.sendStateless(REQUEST_WORDS_MESSAGE)
  }
}

export class LocalSession implements EditorSession {
  readonly ydoc: Doc
  private readonly deps: SessionDeps
  private editor: Editor
  private readonly speakersSync: SpeakersSync
  private destroyed = false
  private readonly rebuilds: number[] = []

  constructor(deps: SessionDeps) {
    const { core, host, translation, field, recorder } = deps
    this.deps = deps
    recorder?.record("local-session-created", { readOnly: deps.readOnly })
    this.ydoc = new Doc()

    // No provider: seed the Y.Doc from the store turns.
    const fragment = this.ydoc.getXmlFragment(field)
    const schema = getSchema([TranscriptionDocument, TurnNode, Text])
    prosemirrorJSONToYXmlFragment(
      schema,
      turnsToDoc(translation.turns.value),
      fragment,
    )

    seedSpeakersMap(this.ydoc, translation, core.speakers)
    this.speakersSync = new SpeakersSync(core, this.ydoc)

    this.editor = this.createEditor()
    host.setConnected(true)
  }

  private createEditor(): Editor {
    const { core, host, translation, field, readOnly, debugFlags, recorder } =
      this.deps
    const editor = createTiptapEditor({
      core,
      ydoc: this.ydoc,
      field,
      translation,
      readOnly,
      // No server in local mode: the client mints turn ids itself.
      mintTurnIds: true,
      awareness: null,
      user: host.user,
      debugFlags,
      recorder,
      onViewCrash: () => this.rebuildEditor(),
    })
    host.setEditor(editor)
    return editor
  }

  /** View-crash recovery — see CollabSession.rebuildEditor. */
  private rebuildEditor(): void {
    if (this.destroyed) return
    this.deps.recorder?.record("view-crash-rebuild", {})
    this.editor.destroy()
    this.deps.host.setEditor(undefined)
    if (!allowRebuild(this.rebuilds)) {
      console.error(
        "[transcriptionEditor] editor keeps crashing after rebuild — giving up",
      )
      this.deps.core.transcriptionEditor?.setError(
        "The editor crashed repeatedly. Reload the page to continue.",
      )
      return
    }
    this.editor = this.createEditor()
  }

  updateUser(): void {
    // No awareness in local mode — nothing to broadcast.
  }

  destroy(): void {
    this.destroyed = true
    this.editor.destroy()
    this.speakersSync.destroy()
    this.ydoc.destroy()
  }
}

function mapAwarenessStates(
  states: Array<Record<string, unknown>>,
): YjsUser[] {
  return states.map((s) => ({
    clientId: s.clientId as number,
    ...(s.user as Record<string, unknown> | undefined),
  }))
}

/** An empty document is a single id-less turn (the schema enforces `turn+`);
 *  any real content gives the first turn an id. */
function isHydrated(editor: Editor): boolean {
  const firstTurn = editor.state.doc.firstChild
  return editor.state.doc.childCount > 1 || firstTurn?.attrs.id != null
}
