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
import { CursorTurn } from "./extensions/cursorTurn"
import { CollaborationCursor } from "./extensions/collaborationCursor"
import { ClickHandler } from "./extensions/clickHandler"
import { PauseOnEdit } from "./extensions/pauseOnEdit"
import { SafeTextInput } from "./extensions/safeTextInput"
import { ViewCrashRecovery } from "./extensions/viewCrashRecovery"
import {
  SyncDebug,
  type DebugFlags,
  type FlightRecorder,
} from "./debug/syncFlightRecorder"

export interface TiptapEditorConfig {
  core: Core
  ydoc: Doc
  field: string
  /** The session's translation — fixed for the editor's lifetime. */
  translation: TranslationStore
  readOnly: boolean
  /** Mint turn ids client-side (local mode); in collab the server mints. */
  mintTurnIds: boolean
  /** Remote cursors; null in local mode. */
  awareness: Awareness | null
  user: { name: string; color: string; [key: string]: unknown }
  /** Sync-crash instrumentation; both null unless the debug flag is on. */
  debugFlags?: DebugFlags
  recorder?: FlightRecorder | null
  /** Called when the view crashes while rendering (renderDescs family). The
   *  owner must rebuild the editor on the same Y.Doc. */
  onViewCrash?: () => void
}

/** Assemble a Tiptap editor bound to a Y.Doc. Pure factory: the caller owns
 *  the returned editor and must destroy() it. */
export function createTiptapEditor(config: TiptapEditorConfig): Editor {
  return new Editor({
    extensions: buildExtensions(config),
    editable: !config.readOnly,
    editorProps: {
      attributes: {
        // Native spellcheck over a whole multi-hour transcript freezes
        // Firefox (it checks the entire contenteditable, ~400KB of text on
        // a 7h document) — and flagging STT output as misspelled is noise
        // anyway. Same reasoning for autocorrect/autocapitalize on mobile.
        spellcheck: "false",
        autocorrect: "off",
        autocapitalize: "off",
      },
    },
  })
}

function buildExtensions(config: TiptapEditorConfig): AnyExtension[] {
  const { core, ydoc, field, translation, debugFlags, recorder } = config

  const extensions: AnyExtension[] = [
    TranscriptionDocument,
    TurnNode,
    Text,
    Collaboration.configure({ document: ydoc, field }),
    StoreSync.configure({
      store: core,
      getTranslation: () => translation,
      mintTurnIds: config.mintTurnIds,
    }),
    SafeTextInput,
    WordHighlight.configure({ core }),
    // Debug kill-switch: CursorTurn is the only in-house PM decoration (node
    // decoration on the turn wrapper) — dropping it isolates its role in the
    // readDOMChange crash family.
    ...(debugFlags?.disableCursorTurn ? [] : [CursorTurn]),
    ClickHandler.configure({ core }),
    PauseOnEdit.configure({ core }),
    ...core.pluginExtensions,
  ]

  // Remote cursors render as an overlay outside the contenteditable (see
  // collaborationCursor.ts). Kill-switch kept for A/B repro sessions.
  if (config.awareness && !config.readOnly && !debugFlags?.disableRemoteCursors) {
    extensions.push(
      CollaborationCursor.configure({
        awareness: config.awareness,
        user: config.user,
      }),
    )
  }

  if (recorder) {
    recorder.record("editor-created", {
      readOnly: config.readOnly,
      collab: config.awareness !== null,
      disableRemoteCursors: debugFlags?.disableRemoteCursors ?? false,
      disableCursorTurn: debugFlags?.disableCursorTurn ?? false,
    })
    extensions.push(SyncDebug.configure({ recorder }))
  }

  // MUST stay last: its updateState wrapper has to be outermost so it also
  // catches what SyncDebug's inner wrapper records and rethrows.
  if (config.onViewCrash) {
    extensions.push(ViewCrashRecovery.configure({ onCrash: config.onViewCrash }))
  }

  return extensions
}
