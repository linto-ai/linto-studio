import { ref, shallowReactive } from "vue"
import type {
  Core,
  CorePlugin,
  TranscriptionEditorPluginApi,
  TurnLock,
  TurnSplit,
  TurnUpdate,
} from "../../core/types"
import type {
  EditorPluginState,
  TranscriptionEditorLockPayload,
  TranscriptionEditorOptions,
} from "./types"
import { LockHeartbeat } from "./tools/LockHeartbeat"
import { beginEdit as beginEditHandler } from "./handlers/beginEdit"
import { cancelEdit as cancelEditHandler } from "./handlers/cancelEdit"
import { saveTurn as saveTurnHandler } from "./handlers/saveTurn"
import { splitTurn as splitTurnHandler } from "./handlers/splitTurn"
import { applyTurnUpdate as applyTurnUpdateHandler } from "./handlers/applyTurnUpdate"
import { applyTurnSplit as applyTurnSplitHandler } from "./handlers/applyTurnSplit"
import {
  getTurnLock as getTurnLockHandler,
  setLocks as setLocksHandler,
  setTurnLock as setTurnLockHandler,
  clearTurnLock as clearTurnLockHandler,
} from "./handlers/locksState"

export type {
  TranscriptionEditorOptions,
  TranscriptionEditorSavePayload,
  TranscriptionEditorLockPayload,
} from "./types"

// Client beat cadence; the server TTL is 45s — three missed beats lose the lock.
const HEARTBEAT_INTERVAL_MS = 15000

/**
 * One editing session on a document: the plugin's state (EditorPluginState)
 * and its API in a single object. Methods delegate to handlers/ — each one a
 * file receiving `this` as its explicit first parameter, tools/ holding the
 * stateless how (mirrors the server-side EditorHandler2 structure).
 */
class EditorSession implements EditorPluginState, TranscriptionEditorPluginApi {
  core: Core
  options: TranscriptionEditorOptions
  editingTurnId = ref<string | null>(null)
  editingCaretOffset = ref(0)
  locks = shallowReactive(new Map<string, { userId: string; userName: string }>())
  editingRef: TranscriptionEditorLockPayload | null = null
  lockPending = false
  heartbeat = new LockHeartbeat(HEARTBEAT_INTERVAL_MS)

  constructor(core: Core, options: TranscriptionEditorOptions) {
    this.core = core
    this.options = options
  }

  beginEdit(turnId: string, caretOffset?: number): Promise<void> {
    return beginEditHandler(this, turnId, caretOffset)
  }

  cancelEdit(): void {
    cancelEditHandler(this)
  }

  saveTurn(text: string): void {
    saveTurnHandler(this, text)
  }

  splitTurn(text: string, offset: number): void {
    splitTurnHandler(this, text, offset)
  }

  applyTurnUpdate(update: TurnUpdate): void {
    applyTurnUpdateHandler(this, update)
  }

  applyTurnSplit(split: TurnSplit): void {
    applyTurnSplitHandler(this, split)
  }

  getTurnLock(turnId: string) {
    return getTurnLockHandler(this, turnId)
  }

  setLocks(locks: TurnLock[]): void {
    setLocksHandler(this, locks)
  }

  setTurnLock(lock: TurnLock): void {
    setTurnLockHandler(this, lock)
  }

  clearTurnLock(ref: TranscriptionEditorLockPayload): void {
    clearTurnLockHandler(this, ref)
  }

  /** Back to idle: document reload — the edit in progress and the known
   *  locks belong to the previous document (the join re-ack reseeds them). */
  reset(): void {
    this.editingTurnId.value = null
    this.editingRef = null
    this.heartbeat.stop()
    this.locks.clear()
  }

  destroy(): void {
    this.heartbeat.stop()
  }
}

/**
 * Per-turn plain-text editing (the lock+save model — see the "Editor v2"
 * design). One turn is edited at a time; entering edit mode acquires a
 * server-side lock, leaving it (save/cancel) releases it. Without host
 * handlers the plugin runs local-only (dev harness, viewer).
 */
export function createTranscriptionEditorPlugin(
  options: TranscriptionEditorOptions = {},
): CorePlugin {
  return {
    name: "transcriptionEditor",
    install(core: Core) {
      const session = new EditorSession(core, options)
      core.transcriptionEditor = session

      const offDocChange = core.on("document:change", () => session.reset())

      return () => {
        offDocChange()
        session.destroy()
      }
    },
  }
}
