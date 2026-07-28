import { ref, shallowReactive } from "vue"
import type {
  Core,
  CorePlugin,
  TranscriptionEditorPluginApi,
  SpeakerRenamed,
  SpeakerReplaced,
  TurnDeleted,
  TurnLock,
  TurnSpeakerUpdated,
  TurnSplit,
  TurnsMerged,
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
import { mergeTurns as mergeTurnsHandler } from "./handlers/mergeTurns"
import { applyTurnsMerged as applyTurnsMergedHandler } from "./handlers/applyTurnsMerged"
import { applyTurnDeleted as applyTurnDeletedHandler } from "./handlers/applyTurnDeleted"
import { updateTurnSpeaker as updateTurnSpeakerHandler } from "./handlers/updateTurnSpeaker"
import { renameSpeaker as renameSpeakerHandler } from "./handlers/renameSpeaker"
import { replaceSpeaker as replaceSpeakerHandler } from "./handlers/replaceSpeaker"
import { applyTurnSpeakerUpdated as applyTurnSpeakerUpdatedHandler } from "./handlers/applyTurnSpeakerUpdated"
import { applySpeakerRenamed as applySpeakerRenamedHandler } from "./handlers/applySpeakerRenamed"
import { applySpeakerReplaced as applySpeakerReplacedHandler } from "./handlers/applySpeakerReplaced"
import {
  getTurnLock as getTurnLockHandler,
  setLocks as setLocksHandler,
  setTurnLock as setTurnLockHandler,
  clearTurnLock as clearTurnLockHandler,
} from "./handlers/locksState"
import {
  setTranslationVersion as setTranslationVersionHandler,
  reconcileVersions as reconcileVersionsHandler,
} from "./handlers/versionsState"

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
 * stateless how (mirrors the server-side EditorHandler structure).
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
  versions = new Map<string, number>()
  pendingRefetches = new Set<string>()

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

  mergeTurns(firstTurnId: string, secondTurnId: string): void {
    mergeTurnsHandler(this, firstTurnId, secondTurnId)
  }

  applyTurnsMerged(merge: TurnsMerged): void {
    applyTurnsMergedHandler(this, merge)
  }

  applyTurnDeleted(deleted: TurnDeleted): void {
    applyTurnDeletedHandler(this, deleted)
  }

  setTranslationVersion(translationId: string, version: number): void {
    setTranslationVersionHandler(this, translationId, version)
  }

  reconcileVersions(versions: Record<string, number>): void {
    reconcileVersionsHandler(this, versions)
  }

  updateTurnSpeaker(
    turnId: string,
    target: { speakerId?: string; speakerName?: string },
  ): void {
    updateTurnSpeakerHandler(this, turnId, target)
  }

  renameSpeaker(speakerId: string, name: string): void {
    renameSpeakerHandler(this, speakerId, name)
  }

  replaceSpeaker(fromSpeakerId: string, toSpeakerId: string): void {
    replaceSpeakerHandler(this, fromSpeakerId, toSpeakerId)
  }

  applyTurnSpeakerUpdated(update: TurnSpeakerUpdated): void {
    applyTurnSpeakerUpdatedHandler(this, update)
  }

  applySpeakerRenamed(renamed: SpeakerRenamed): void {
    applySpeakerRenamedHandler(this, renamed)
  }

  applySpeakerReplaced(replaced: SpeakerReplaced): void {
    applySpeakerReplacedHandler(this, replaced)
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
    this.versions.clear()
    this.pendingRefetches.clear()
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
