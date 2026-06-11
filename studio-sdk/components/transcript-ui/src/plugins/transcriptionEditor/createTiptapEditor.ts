import { Editor } from "@tiptap/vue-3"
import { Text } from "@tiptap/extension-text"
import { Collaboration } from "@tiptap/extension-collaboration"
import type { Doc } from "yjs"
import type { Awareness } from "y-protocols/awareness"
import type { AnyExtension } from "@tiptap/core"

import type { Core, TranslationStore } from "../../core/types"
import { TranscriptionDocument } from "./extensions/transcriptionDocument"
import { TurnNode } from "./extensions/turnNode"
import { StoreSync } from "./extensions/storeSync"
import { WordHighlight } from "./extensions/wordHighlight"
import { CollaborationCursor } from "./extensions/collaborationCursor"
import { ClickHandler } from "./extensions/clickHandler"
import { PauseOnEdit } from "./extensions/pauseOnEdit"

export interface TiptapEditorConfig {
  core: Core
  ydoc: Doc
  field: string
  /** The session's translation — fixed for the editor's lifetime. */
  translation: TranslationStore
  readOnly: boolean
  /** Remote cursors; null in local mode. */
  awareness: Awareness | null
  user: { name: string; color: string; [key: string]: unknown }
}

/** Assemble a Tiptap editor bound to a Y.Doc. Pure factory: the caller owns
 *  the returned editor and must destroy() it. */
export function createTiptapEditor(config: TiptapEditorConfig): Editor {
  return new Editor({
    extensions: buildExtensions(config),
    editable: !config.readOnly,
  })
}

function buildExtensions(config: TiptapEditorConfig): AnyExtension[] {
  const { core, ydoc, field, translation } = config

  const extensions: AnyExtension[] = [
    TranscriptionDocument,
    TurnNode,
    Text,
    Collaboration.configure({ document: ydoc, field }),
    StoreSync.configure({ store: core, getTranslation: () => translation }),
    WordHighlight.configure({ core }),
    ClickHandler.configure({ core }),
    PauseOnEdit.configure({ core }),
    ...core.pluginExtensions,
  ]

  if (config.awareness && !config.readOnly) {
    extensions.push(
      CollaborationCursor.configure({
        awareness: config.awareness,
        user: config.user,
      }),
    )
  }

  return extensions
}
