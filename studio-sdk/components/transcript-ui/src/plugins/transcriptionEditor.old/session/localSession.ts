import { Doc } from "yjs"
import { getSchema } from "@tiptap/vue-3"
import type { Editor } from "@tiptap/vue-3"
import { Text } from "@tiptap/extension-text"
import { prosemirrorJSONToYXmlFragment } from "@tiptap/y-tiptap"

import { createTiptapEditor } from "../createTiptapEditor"
import { SpeakersSync, seedSpeakersMap } from "../utils/speakersSync"
import { turnsToDoc } from "../utils/turnsToDoc"
import { TranscriptionDocument } from "../extensions/transcriptionDocument"
import { TurnNode } from "../extensions/turnNode"
import { allowRebuild } from "../utils/rebuildGuard"
import type { EditorSession, SessionDeps } from "./types"

export class LocalSession implements EditorSession {
  readonly ydoc: Doc
  private readonly deps: SessionDeps
  private editor: Editor
  private readonly speakersSync: SpeakersSync
  private destroyed = false
  private readonly rebuilds: number[] = []

  constructor(deps: SessionDeps) {
    const { core, host, turnStore, field, recorder } = deps
    this.deps = deps
    recorder?.record("local-session-created", { readOnly: deps.readOnly })
    this.ydoc = new Doc()

    // No provider: seed the Y.Doc from the store turns.
    const fragment = this.ydoc.getXmlFragment(field)
    const schema = getSchema([TranscriptionDocument, TurnNode, Text])
    prosemirrorJSONToYXmlFragment(
      schema,
      turnsToDoc(turnStore.turns.value),
      fragment,
    )

    seedSpeakersMap(this.ydoc, turnStore, core.speakers)
    this.speakersSync = new SpeakersSync(core, this.ydoc)

    this.editor = this.createEditor()
    host.setConnected(true)
  }

  private createEditor(): Editor {
    const { core, host, turnStore, field, readOnly, debugFlags, recorder } =
      this.deps
    const editor = createTiptapEditor({
      core,
      ydoc: this.ydoc,
      field,
      turnStore,
      readOnly,
      // No server in local mode: this client owns the ids.
      turnIdAuthority: "client",
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
