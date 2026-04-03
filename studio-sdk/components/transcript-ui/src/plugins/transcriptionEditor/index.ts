import { computed, ref, watch, shallowRef, type Ref } from "vue"
import { Doc } from "yjs"
import { Editor, getSchema } from "@tiptap/vue-3"
import { Text } from "@tiptap/extension-text"
import { Collaboration } from "@tiptap/extension-collaboration"
import { prosemirrorJSONToYXmlFragment } from "@tiptap/y-tiptap"
import { TranscriptionDocument } from "./extensions/transcriptionDocument"
import { TurnNode } from "./extensions/turnNode"
import { StoreSync, withSuppressedSync } from "./extensions/storeSync"
import { WordHighlight } from "./extensions/wordHighlight"
import { CollaborationCursor } from "./extensions/collaborationCursor"
import { turnsToDoc } from "./utils/turnsToDoc"
import type { Awareness } from "y-protocols/awareness"
import type {
  Core,
  CorePlugin,
  TranscriptionEditorPluginApi,
  YjsUser,
  TranslationStore,
} from "../../core/types"
import type { Turn } from "../../types/editor"
import "./cursor.css"

export type { TranscriptionEditorPluginApi }

export interface TranscriptionEditorOptions {
  /** Existing Y.Doc (collaborative mode). If absent, a local Y.Doc is created. */
  document?: Doc
  /** Awareness instance for collaborative cursors (optional). */
  awareness?: Awareness
  /** Name of the XmlFragment in the Y.Doc. @default "default" */
  field?: string
  /** Local user info for cursor display. */
  user?: { name: string; color: string; [key: string]: unknown }
  /** Reactive boolean ref managed by the provider for connection status. */
  isConnected?: Ref<boolean>
}

export function createTranscriptionEditorPlugin(
  options: TranscriptionEditorOptions = {},
): CorePlugin {
  const {
    document: externalDoc,
    awareness,
    field = "default",
    user = { name: "Anonymous", color: "#999999" },
    isConnected: externalConnected,
  } = options

  const ydoc = externalDoc ?? new Doc()
  const fragment = ydoc.getXmlFragment(field)
  const users = ref<YjsUser[]>([])
  const isConnected = externalConnected ?? ref(false)

  return {
    name: "transcriptionEditor",

    install(core: Core) {
      const tiptapEditor = shallowRef<Editor | undefined>(undefined)
      const cleanups: Array<() => void> = []

      // Awareness tracking
      if (awareness) {
        const onAwarenessUpdate = () => {
          users.value = awarenessStatesToArray(awareness.states)
        }
        awareness.on("update", onAwarenessUpdate)
        onAwarenessUpdate()
        cleanups.push(() => awareness.off("update", onAwarenessUpdate))
      }

      const updateUser = (attrs: Record<string, unknown>) => {
        if (awareness) {
          Object.assign(user, attrs)
          awareness.setLocalStateField("user", user)
        }
      }

      const api: TranscriptionEditorPluginApi = {
        tiptapEditor,
        doc: ydoc,
        fragment,
        users,
        isConnected,
        updateUser,
      }
      core.transcriptionEditor = api

      // Wait for activeChannel to be available before creating the editor
      const stopWaiting = watch(
        () => core.activeChannel.value,
        (channel) => {
          if (!channel) return
          stopWaiting()
          initEditor(core, options, ydoc, field, tiptapEditor, cleanups)
        },
        { immediate: true },
      )

      return () => {
        stopWaiting()
        cleanups.forEach((fn) => fn())
        tiptapEditor.value?.destroy()
        if (!externalDoc) ydoc.destroy()
        core.transcriptionEditor = undefined
      }
    },
  }
}

function initEditor(
  core: Core,
  options: TranscriptionEditorOptions,
  ydoc: Doc,
  field: string,
  tiptapEditor: ReturnType<typeof shallowRef<Editor | undefined>>,
  cleanups: Array<() => void>,
): void {
  const activeTranslation = computed<TranslationStore>(
    () => core.activeChannel.value!.activeTranslation.value,
  )

  const extensions = [
    TranscriptionDocument,
    TurnNode,
    Text,
    Collaboration.configure({
      document: ydoc,
      field,
    }),
    StoreSync.configure({
      store: core,
      getTranslation: () => activeTranslation.value,
    }),
    WordHighlight.configure({ core }),
    ...core.pluginExtensions,
  ]

  if (options.awareness) {
    extensions.push(
      CollaborationCursor.configure({
        awareness: options.awareness,
        user: options.user ?? { name: "Anonymous", color: "#999999" },
      }),
    )
  }

  // Pre-populate the Y.XmlFragment if empty (local/new doc).
  // Must happen before Editor creation because ySyncPlugin initializes from the fragment.
  const fragment = ydoc.getXmlFragment(field)
  if (fragment.length === 0) {
    const initialContent = turnsToDoc(activeTranslation.value.turns.value)
    const schema = getSchema(extensions)
    prosemirrorJSONToYXmlFragment(schema, initialContent, fragment)
  }

  tiptapEditor.value = new Editor({
    extensions,
  })

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

  const unsubSync = core.on("translation:sync", () => {
    console.warn(
      "[transcriptionEditor] translation:sync is not supported while the editor is active",
    )
  })

  const unsubChannelSync = core.on("channel:sync", () => {
    console.warn(
      "[transcriptionEditor] channel:sync is not supported while the editor is active",
    )
  })

  cleanups.push(unsubTranslation, unsubSync, unsubChannelSync)
}

function reloadContent(editor: Editor | undefined, turns: Turn[]): void {
  if (!editor) return
  const content = turnsToDoc(turns)
  withSuppressedSync(() => {
    editor.commands.setContent(content)
  })
}

function awarenessStatesToArray(
  states: Map<number, Record<string, unknown>>,
): YjsUser[] {
  return Array.from(states.entries()).map(([clientId, state]) => ({
    clientId,
    ...(state.user as Record<string, unknown> | undefined),
  }))
}

// Re-export internals for advanced usage
export { TranscriptionDocument } from "./extensions/transcriptionDocument"
export { TurnNode } from "./extensions/turnNode"
export type { TurnNodeAttributes } from "./extensions/turnNode"
export { StoreSync, withSuppressedSync } from "./extensions/storeSync"
export { CollaborationCursor } from "./extensions/collaborationCursor"
export { turnsToDoc } from "./utils/turnsToDoc"
export { docToTurns } from "./utils/docToTurns"
