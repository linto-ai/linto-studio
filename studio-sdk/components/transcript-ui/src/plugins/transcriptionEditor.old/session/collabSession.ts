import { Doc } from "yjs"
import type { Editor } from "@tiptap/vue-3"
import { HocuspocusProvider } from "@hocuspocus/provider"
import type { Transaction } from "@tiptap/pm/state"

import type { YjsUser } from "../../../core/types"
import { createTiptapEditor } from "../createTiptapEditor"
import { SpeakersSync } from "../utils/speakersSync"
import { applyStatelessPayload, REQUEST_WORDS_MESSAGE } from "../statelessWords"
import { allowRebuild } from "../utils/rebuildGuard"
import type { CollabOptions, EditorSession, SessionDeps } from "./types"

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
    const epoch = collab.epochs?.[deps.turnStore.id] ?? 0
    const recorder = deps.recorder
    recorder?.record("collab-session-created", {
      document: `${deps.turnStore.id}.${epoch}`,
      readOnly: deps.readOnly,
    })
    // The server seeds the Y.Doc; the editor is created on first sync.
    this.provider = new HocuspocusProvider({
      url: collab.url,
      name: `${deps.turnStore.id}.${epoch}`,
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
        applyStatelessPayload(payload, deps.turnStore)
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
    const { core, host, turnStore, field, readOnly, debugFlags, recorder } =
      this.deps
    if (!this.speakersSync) this.speakersSync = new SpeakersSync(core, this.ydoc)
    this.editor = createTiptapEditor({
      core,
      ydoc: this.ydoc,
      field,
      turnStore,
      readOnly,
      turnIdAuthority: "server",
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
