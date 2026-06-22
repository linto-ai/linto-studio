import { ref, shallowRef } from "vue"
import type { Editor } from "@tiptap/vue-3"

import type {
  Core,
  CorePlugin,
  TranscriptionEditorPluginApi,
  TranslationStore,
  YjsUser,
} from "../../core/types"
import { SPEAKERS_MAP_KEY, type SpeakerData } from "./utils/speakersSync"
import {
  CollabSession,
  LocalSession,
  type CollabOptions,
  type EditorSession,
  type LocalUser,
  type SessionHost,
} from "./session"

import "./cursor.css"

export type { TranscriptionEditorPluginApi }
export type { CollabOptions }

export interface TranscriptionEditorOptions {
  /** Collaborative mode configuration. If absent, local-only mode. */
  collab?: CollabOptions
  /** Name of the XmlFragment in the Y.Doc. @default "default" */
  field?: string
  /** Local user info for cursor display. */
  user?: LocalUser
  /**
   * Read-only mode: the editor is not editable and broadcasts no cursor or
   * selection to other participants. Remote edits are still received, so the
   * user keeps seeing others work. @default false
   */
  readOnly?: boolean
}

export function createTranscriptionEditorPlugin({
  collab,
  field = "default",
  user = { name: "Anonymous", color: "#999999" },
  readOnly = false,
}: TranscriptionEditorOptions = {}): CorePlugin {
  return {
    name: "transcriptionEditor",

    install(core: Core) {
      const tiptapEditor = shallowRef<Editor | undefined>(undefined)
      const users = ref<YjsUser[]>([])
      const isConnected = ref(false)

      // The plugin's single mutable cell. Sessions publish their reactive
      // state through `host`, never by reaching into the plugin.
      let session: EditorSession | null = null

      const host: SessionHost = {
        setEditor: (editor) => {
          tiptapEditor.value = editor
        },
        setConnected: (connected) => {
          isConnected.value = connected
        },
        setUsers: (newUsers) => {
          users.value = newUsers
        },
        user,
      }

      core.transcriptionEditor = {
        tiptapEditor,
        get doc() {
          return session?.ydoc ?? null
        },
        get fragment() {
          return session?.ydoc.getXmlFragment(field) ?? null
        },
        get speakersMap() {
          return session?.ydoc.getMap<SpeakerData>(SPEAKERS_MAP_KEY) ?? null
        },
        users,
        isConnected,
        updateUser(attrs: Record<string, unknown>) {
          Object.assign(user, attrs)
          session?.updateUser()
        },
      }

      // (Re)create the session for the active translation. The state reset
      // belongs here — the plugin owns the state, so no session variant can
      // forget to clean up behind itself.
      const restart = (): void => {
        session?.destroy()
        session = null
        tiptapEditor.value = undefined
        users.value = []
        isConnected.value = false

        const translation = editableTranslation(core)
        if (!translation) return // virtual cross translation: read-only view
        const deps = { core, host, translation, field, readOnly }
        session = collab
          ? new CollabSession(deps, collab)
          : new LocalSession(deps)
      }

      const warnUnsupported = (event: string) => (): void => {
        if (session) {
          console.warn(
            `[transcriptionEditor] ${event} is not supported while the editor is active`,
          )
        }
      }

      const unsubscribes = [
        core.on("document:change", restart),
        core.on("channel:change", restart),
        core.on("translation:change", restart),
        core.on("translation:sync", warnUnsupported("translation:sync")),
        core.on("channel:sync", warnUnsupported("channel:sync")),
      ]

      // The document may already be loaded when the plugin installs.
      restart()

      return () => {
        unsubscribes.forEach((off) => off())
        session?.destroy()
        session = null
        core.transcriptionEditor = undefined
      }
    },
  }
}

/** The editable backing store of the active translation, or undefined when
 *  the active one is virtual (the cross translation) — no collab session,
 *  rendered read-only. */
function editableTranslation(core: Core): TranslationStore | undefined {
  const channel = core.activeChannel.value
  if (!channel) return undefined
  return channel.translations.get(channel.activeTranslation.value.id)
}

// Re-export internals for advanced usage
export { TranscriptionDocument } from "./extensions/transcriptionDocument"
export { TurnNode } from "./extensions/turnNode"
export type { TurnNodeAttributes } from "./extensions/turnNode"
export { StoreSync, withSuppressedSync } from "./extensions/storeSync"
export { CollaborationCursor } from "./extensions/collaborationCursor"
export { turnsToDoc } from "./utils/turnsToDoc"
export { docToTurns } from "./utils/docToTurns"
