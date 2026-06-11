import { Doc } from "yjs"
import { getSchema } from "@tiptap/vue-3"
import type { Editor } from "@tiptap/vue-3"
import { Text } from "@tiptap/extension-text"
import { prosemirrorJSONToYXmlFragment } from "@tiptap/y-tiptap"
import { HocuspocusProvider } from "@hocuspocus/provider"
import type { Transaction } from "@tiptap/pm/state"

import type { Core, TranslationStore, YjsUser } from "../../core/types"
import { createTiptapEditor } from "./createTiptapEditor"
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
}

/** A session owns the resources bound to one translation: a Y.Doc, an
 *  optional provider, a Tiptap editor. destroy() releases all of them. */
export interface EditorSession {
  readonly ydoc: Doc
  /** Broadcast the (already updated) host.user to remote participants. */
  updateUser(): void
  destroy(): void
}

export class CollabSession implements EditorSession {
  readonly ydoc: Doc
  private readonly deps: SessionDeps
  private readonly provider: HocuspocusProvider
  private editor: Editor | null = null
  private speakersSync: SpeakersSync | null = null

  constructor(deps: SessionDeps, collab: CollabOptions) {
    this.deps = deps
    this.ydoc = new Doc()
    // The server seeds the Y.Doc; the editor is created on first sync.
    this.provider = new HocuspocusProvider({
      url: collab.url,
      name: deps.translation.id,
      token: collab.token,
      document: this.ydoc,
      onSynced: () => this.handleSynced(),
      onDisconnect: () => deps.host.setConnected(false),
      onAwarenessUpdate: ({ states }) =>
        deps.host.setUsers(mapAwarenessStates(states)),
      onStateless: ({ payload }) =>
        applyStatelessPayload(payload, deps.translation),
    })
  }

  updateUser(): void {
    this.provider.awareness?.setLocalStateField("user", this.deps.host.user)
  }

  destroy(): void {
    this.editor?.destroy() // also drops its "transaction" listeners
    this.editor = null
    this.speakersSync?.destroy()
    this.speakersSync = null
    this.provider.destroy() // before the doc: stops every Yjs callback
    this.ydoc.destroy()
  }

  /** Fires on every (re)sync of the provider, not just the first one. */
  private handleSynced(): void {
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
    const { core, host, translation, field, readOnly } = this.deps
    this.speakersSync = new SpeakersSync(core, this.ydoc)
    this.editor = createTiptapEditor({
      core,
      ydoc: this.ydoc,
      field,
      translation,
      readOnly,
      awareness: this.provider.awareness,
      user: host.user,
    })
    this.requestWordsWhenHydrated(this.editor)
    host.setEditor(this.editor)
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
  private readonly editor: Editor
  private readonly speakersSync: SpeakersSync

  constructor(deps: SessionDeps) {
    const { core, host, translation, field, readOnly } = deps
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

    this.editor = createTiptapEditor({
      core,
      ydoc: this.ydoc,
      field,
      translation,
      readOnly,
      awareness: null,
      user: host.user,
    })
    host.setEditor(this.editor)
    host.setConnected(true)
  }

  updateUser(): void {
    // No awareness in local mode — nothing to broadcast.
  }

  destroy(): void {
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
