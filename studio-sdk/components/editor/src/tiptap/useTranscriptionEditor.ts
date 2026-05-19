import { computed, watch, onBeforeUnmount, type Ref } from "vue"
import { useEditor } from "@tiptap/vue-3"
import { Text } from "@tiptap/extension-text"
import { History } from "@tiptap/extension-history"
import { TranscriptionDocument } from "./extensions/transcriptionDocument"
import { TurnNode } from "./extensions/turnNode"
import { StoreSync, withSuppressedSync } from "./plugins/storeSync"
import { turnsToDoc } from "./helpers/turnsToDoc"
import type { EditorStore, TranslationStore } from "../core/types"
import type { Turn } from "../types/editor"
import type { Editor } from "@tiptap/core"

export interface UseTranscriptionEditorOptions {
  store: EditorStore
  editable?: Ref<boolean> | boolean
}

export function useTranscriptionEditor(options: UseTranscriptionEditorOptions) {
  const { store } = options

  const activeTranslation = computed<TranslationStore>(
    () => store.activeChannel.value.activeTranslation.value,
  )

  const initialTurns = activeTranslation.value.turns.value
  const initialContent = turnsToDoc(initialTurns)

  // Check if any plugin contributes a History-replacing extension (e.g. Collaboration)
  const pluginHasHistory = store.pluginExtensions.some(
    (ext) => ext.name === "collaboration" || ext.name === "history",
  )

  const coreExtensions = [
    TranscriptionDocument,
    TurnNode,
    Text,
    ...(!pluginHasHistory ? [History] : []),
    StoreSync.configure({
      store,
      getTranslation: () => activeTranslation.value,
    }),
  ]

  const editor = useEditor({
    content: initialContent,
    extensions: [...coreExtensions, ...store.pluginExtensions],
    editable:
      typeof options.editable === "object"
        ? options.editable.value
        : (options.editable ?? true),
  })

  // Watch editable changes
  if (typeof options.editable === "object") {
    watch(options.editable, (value) => {
      editor.value?.setEditable(value)
    })
  }

  // Watch active translation changes to reload content
  let currentTranslationId = activeTranslation.value.id

  watch(
    () => activeTranslation.value.id,
    (newId) => {
      if (newId === currentTranslationId) return
      currentTranslationId = newId
      reloadContent(editor.value, activeTranslation.value.turns.value)
    },
  )

  // Listen for external bulk updates (setTurns, setChannel)
  const unsubSync = store.on("translation:sync", ({ translationId }) => {
    if (translationId !== activeTranslation.value.id) return
    reloadContent(editor.value, activeTranslation.value.turns.value)
  })

  const unsubChannelSync = store.on("channel:sync", ({ channelId }) => {
    if (channelId !== store.activeChannelId.value) return
    reloadContent(editor.value, activeTranslation.value.turns.value)
  })

  // Cleanup
  onBeforeUnmount(() => {
    unsubSync()
    unsubChannelSync()
    editor.value?.destroy()
  })

  return { editor }
}

function reloadContent(editor: Editor | undefined, turns: Turn[]): void {
  if (!editor) return
  const content = turnsToDoc(turns)
  withSuppressedSync(() => {
    editor.commands.setContent(content)
  })
}
