import { computed, ref, watch, shallowRef } from "vue"
import { Doc } from "yjs"
import { Editor, getSchema } from "@tiptap/vue-3"
import { Text } from "@tiptap/extension-text"
import { Collaboration } from "@tiptap/extension-collaboration"
import { prosemirrorJSONToYXmlFragment } from "@tiptap/y-tiptap"
import { HocuspocusProvider } from "@hocuspocus/provider"
import { TranscriptionDocument } from "./extensions/transcriptionDocument"
import { TurnNode } from "./extensions/turnNode"
import { StoreSync } from "./extensions/storeSync"
import { WordHighlight } from "./extensions/wordHighlight"
import { CollaborationCursor } from "./extensions/collaborationCursor"
import { turnsToDoc } from "./utils/turnsToDoc"
import {
  setupSpeakersSync,
  SPEAKERS_MAP_KEY,
  type SpeakerData,
} from "./utils/speakersSync"
import type {
  Core,
  CorePlugin,
  TranscriptionEditorPluginApi,
  YjsUser,
  TranslationStore,
} from "../../core/types"
import "./cursor.css"

export type { TranscriptionEditorPluginApi }

export interface CollabOptions {
  /** Hocuspocus WebSocket URL (e.g. "ws://localhost/ws/editor") */
  url: string
  /** JWT token for authentication */
  token: string
}

export interface TranscriptionEditorOptions {
  /** Collaborative mode configuration. If absent, local-only mode. */
  collab?: CollabOptions
  /** Name of the XmlFragment in the Y.Doc. @default "default" */
  field?: string
  /** Local user info for cursor display. */
  user?: { name: string; color: string; [key: string]: unknown }
}

export function createTranscriptionEditorPlugin(
  options: TranscriptionEditorOptions = {},
): CorePlugin {
  const {
    collab,
    field = "default",
    user = { name: "Anonymous", color: "#999999" },
  } = options

  return {
    name: "transcriptionEditor",

    install(core: Core) {
      const tiptapEditor = shallowRef<Editor | undefined>(undefined)
      const users = ref<YjsUser[]>([])
      const isConnected = ref(false)
      const cleanups: Array<() => void> = []
      const sessionCleanups: Array<() => void> = []

      // Current provider/doc state (managed internally in collab mode)
      let currentProvider: HocuspocusProvider | null = null
      let currentDoc: Doc | null = null

      const api: TranscriptionEditorPluginApi = {
        tiptapEditor,
        get doc() {
          return currentDoc!
        },
        get fragment() {
          return currentDoc!.getXmlFragment(field)
        },
        get speakersMap() {
          return currentDoc?.getMap<SpeakerData>(SPEAKERS_MAP_KEY) ?? null
        },
        users,
        isConnected,
        updateUser(attrs: Record<string, unknown>) {
          if (currentProvider?.awareness) {
            Object.assign(user, attrs)
            currentProvider.awareness.setLocalStateField("user", user)
          }
        },
      }
      core.transcriptionEditor = api

      function destroyCurrentSession() {
        tiptapEditor.value?.destroy()
        tiptapEditor.value = undefined
        sessionCleanups.forEach((fn) => fn())
        sessionCleanups.length = 0
        if (currentProvider) {
          currentProvider.destroy()
          currentProvider = null
        }
        if (currentDoc) {
          currentDoc.destroy()
          currentDoc = null
        }
        isConnected.value = false
        users.value = []
      }

      function startSession(translationId: string, translation: TranslationStore) {
        destroyCurrentSession()

        const ydoc = new Doc()
        currentDoc = ydoc

        if (collab) {
          // Collaborative mode: provider connects to server, server seeds the Y.Doc
          const provider = new HocuspocusProvider({
            url: collab.url,
            name: translationId,
            token: collab.token,
            document: ydoc,
            onSynced() {
              isConnected.value = true
            },
            onDisconnect() {
              isConnected.value = false
            },
            onAwarenessUpdate({ states }) {
              users.value = states.map((s: Record<string, unknown>) => ({
                clientId: s.clientId as number,
                ...(s.user as Record<string, unknown> | undefined),
              }))
            },
          })
          currentProvider = provider

          // Wait for initial sync before creating editor
          const stopSync = watch(isConnected, (synced) => {
            if (!synced) return
            stopSync()
            sessionCleanups.push(
              setupSpeakersSync({ core, ydoc, translation, seedFromCore: false }),
            )
            createTiptapEditor(core, options, ydoc, field, tiptapEditor, provider.awareness, cleanups)
          }, { immediate: true })
          cleanups.push(stopSync)
        } else {
          // Local mode: seed from store turns, no provider
          const fragment = ydoc.getXmlFragment(field)
          const initialContent = turnsToDoc(translation.turns.value)
          const schema = getSchema([TranscriptionDocument, TurnNode, Text])
          prosemirrorJSONToYXmlFragment(schema, initialContent, fragment)
          isConnected.value = true

          sessionCleanups.push(
            setupSpeakersSync({ core, ydoc, translation, seedFromCore: true }),
          )

          createTiptapEditor(core, options, ydoc, field, tiptapEditor, null, cleanups)
        }
      }

      // Start session when activeChannel + activeTranslation are ready
      const stopWaiting = watch(
        () => core.activeChannel.value,
        (channel) => {
          if (!channel) return
          stopWaiting()

          const activeTranslation = computed<TranslationStore>(
            () => core.activeChannel.value!.activeTranslation.value,
          )

          // Start initial session
          startSession(activeTranslation.value.id, activeTranslation.value)

          // Watch for translation changes → restart session
          const stopTranslation = watch(
            () => activeTranslation.value.id,
            (newId) => {
              startSession(newId, activeTranslation.value)
            },
          )
          cleanups.push(stopTranslation)
        },
        { immediate: true },
      )

      return () => {
        stopWaiting()
        cleanups.forEach((fn) => fn())
        destroyCurrentSession()
        core.transcriptionEditor = undefined
      }
    },
  }
}

function createTiptapEditor(
  core: Core,
  options: TranscriptionEditorOptions,
  ydoc: Doc,
  field: string,
  tiptapEditor: ReturnType<typeof shallowRef<Editor | undefined>>,
  awareness: import("y-protocols/awareness").Awareness | null,
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

  if (awareness) {
    extensions.push(
      CollaborationCursor.configure({
        awareness,
        user: options.user ?? { name: "Anonymous", color: "#999999" },
      }),
    )
  }

  tiptapEditor.value = new Editor({
    extensions,
  })

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

  cleanups.push(unsubSync, unsubChannelSync)
}

// Re-export internals for advanced usage
export { TranscriptionDocument } from "./extensions/transcriptionDocument"
export { TurnNode } from "./extensions/turnNode"
export type { TurnNodeAttributes } from "./extensions/turnNode"
export { StoreSync, withSuppressedSync } from "./extensions/storeSync"
export { CollaborationCursor } from "./extensions/collaborationCursor"
export { turnsToDoc } from "./utils/turnsToDoc"
export { docToTurns } from "./utils/docToTurns"
