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
import { FlightRecorder, resolveDebugFlags } from "./debug/syncFlightRecorder"

import "./cursor.css"
import "./karaoke.css"

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
  /**
   * Sync flight recorder: records the transaction/mutation timeline and
   * checks viewDesc↔DOM integrity to diagnose the readDOMChange crash
   * family. Also enabled by localStorage["transcript-ui:debug"] = "1"
   * (no host redeploy needed). Dump via core.transcriptionEditor.debugDump().
   */
  debug?: boolean
  /** Debug kill-switch: drop remote carets/selections (CollaborationCursor).
   *  localStorage["transcript-ui:debug:no-remote-cursors"] also works. */
  debugDisableRemoteCursors?: boolean
  /** Debug kill-switch: drop the CursorTurn decoration.
   *  localStorage["transcript-ui:debug:no-cursor-turn"] also works. */
  debugDisableCursorTurn?: boolean
}

export function createTranscriptionEditorPlugin({
  collab,
  field = "default",
  user = { name: "Anonymous", color: "#999999" },
  readOnly = false,
  debug = false,
  debugDisableRemoteCursors = false,
  debugDisableCursorTurn = false,
}: TranscriptionEditorOptions = {}): CorePlugin {
  return {
    name: "transcriptionEditor",

    install(core: Core) {
      const tiptapEditor = shallowRef<Editor | undefined>(undefined)
      const users = ref<YjsUser[]>([])
      const isConnected = ref(false)
      const error = ref<string | null>(null)

      const debugFlags = resolveDebugFlags({
        debug,
        debugDisableRemoteCursors,
        debugDisableCursorTurn,
      })
      const recorder = debugFlags.enabled ? new FlightRecorder() : null

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
        error,
        updateUser(attrs: Record<string, unknown>) {
          Object.assign(user, attrs)
          session?.updateUser()
        },
        setError(message: string | null) {
          error.value = message
        },
        debugDump: recorder ? () => recorder.dump() : undefined,
      }

      // (Re)create the session for the active translation. The state reset
      // belongs here — the plugin owns the state, so no session variant can
      // forget to clean up behind itself.
      const restart = (trigger: string): void => {
        recorder?.record("session-restart", { trigger })
        session?.destroy()
        session = null
        tiptapEditor.value = undefined
        users.value = []
        isConnected.value = false
        // A new load starts clean: drop any error from the previous attempt so
        // a successful reload (e.g. on a fresh epoch) hides the overlay.
        error.value = null

        const translation = editableTranslation(core)
        if (!translation) return // virtual cross translation: read-only view
        const deps = {
          core,
          host,
          translation,
          field,
          readOnly,
          debugFlags,
          recorder,
        }
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
        core.on("document:change", () => restart("document:change")),
        core.on("channel:change", () => restart("channel:change")),
        core.on("translation:change", () => restart("translation:change")),
        core.on("translation:sync", warnUnsupported("translation:sync")),
        core.on("channel:sync", warnUnsupported("channel:sync")),
      ]

      // The document may already be loaded when the plugin installs.
      restart("install")

      return () => {
        unsubscribes.forEach((off) => off())
        session?.destroy()
        session = null
        recorder?.destroy()
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
