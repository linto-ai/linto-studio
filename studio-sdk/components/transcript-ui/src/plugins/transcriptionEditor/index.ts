import { computed, watch, shallowRef } from "vue"
import { Editor } from "@tiptap/core"
import { Text } from "@tiptap/extension-text"
import { History } from "@tiptap/extension-history"
import { TranscriptionDocument } from "./extensions/transcriptionDocument"
import { TurnNode } from "./extensions/turnNode"
import { StoreSync, withSuppressedSync } from "./extensions/storeSync"
import { turnsToDoc } from "./utils/turnsToDoc"
import type { Core, CorePlugin, TranscriptionEditorPluginApi, TranslationStore } from "../../core/types"
import type { Turn } from "../../types/editor"

export type { TranscriptionEditorPluginApi }

export function createTranscriptionEditorPlugin(): CorePlugin {
  return {
    name: "transcriptionEditor",

    install(core: Core) {
      const activeTranslation = computed<TranslationStore>(
        () => core.activeChannel.value.activeTranslation.value,
      )

      const initialContent = turnsToDoc(activeTranslation.value.turns.value)

      // Check if any plugin contributes a History-replacing extension (e.g. Collaboration)
      const pluginHasHistory = core.pluginExtensions.some(
        (ext) => ext.name === "collaboration" || ext.name === "history",
      )

      const coreExtensions = [
        TranscriptionDocument,
        TurnNode,
        Text,
        ...(!pluginHasHistory ? [History] : []),
        StoreSync.configure({
          store: core,
          getTranslation: () => activeTranslation.value,
        }),
      ]

      const tiptapEditor = shallowRef<Editor | undefined>(
        new Editor({
          content: initialContent,
          extensions: [...coreExtensions, ...core.pluginExtensions],
        }),
      )

      // Watch active translation changes to reload content
      let currentTranslationId = activeTranslation.value.id

      const unsubTranslation = watch(
        () => activeTranslation.value.id,
        (newId) => {
          if (newId === currentTranslationId) return
          currentTranslationId = newId
          reloadContent(tiptapEditor.value, activeTranslation.value.turns.value)
        },
      )

      // TODO: translation:sync and channel:sync are not handled by the transcriptionEditor plugin.
      // TipTap is the source of truth for text content. External bulk updates (setTurns,
      // setChannel) should not overwrite the ProseMirror document — this would destroy
      // collaborative editing state (Yjs). These events need a different strategy.
      const unsubSync = core.on("translation:sync", () => {
        console.warn("[transcriptionEditor plugin] translation:sync is not supported while the transcriptionEditor plugin is active")
      })

      const unsubChannelSync = core.on("channel:sync", () => {
        console.warn("[transcriptionEditor plugin] channel:sync is not supported while the transcriptionEditor plugin is active")
      })

      const api: TranscriptionEditorPluginApi = { editor: tiptapEditor }
      core.transcriptionEditor = api

      return () => {
        unsubTranslation()
        unsubSync()
        unsubChannelSync()
        tiptapEditor.value?.destroy()
        core.transcriptionEditor = undefined
      }
    },
  }
}

function reloadContent(editor: Editor | undefined, turns: Turn[]): void {
  if (!editor) return
  const content = turnsToDoc(turns)
  withSuppressedSync(() => {
    editor.commands.setContent(content)
  })
}

// Re-export internals for advanced usage
export { TranscriptionDocument } from "./extensions/transcriptionDocument"
export { TurnNode } from "./extensions/turnNode"
export type { TurnNodeAttributes } from "./extensions/turnNode"
export { StoreSync, withSuppressedSync } from "./extensions/storeSync"
export { turnsToDoc } from "./utils/turnsToDoc"
export { docToTurns } from "./utils/docToTurns"
