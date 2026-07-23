import { ref, shallowReactive } from "vue"
import type {
  Core,
  CorePlugin,
  TranslationStore,
  TranscriptionEditorPluginApi,
  TurnLock,
} from "../../core/types"
import { wordsFromText, carryWordTimes } from "../../utils/turnWords"
import { computeTurnPlainText } from "../../utils/computeTurnPlainText"

export interface TranscriptionEditorSavePayload {
  /** Id of the edited language track — the child conversation on the backend. */
  translationId: string
  turnId: string
  text: string
}

export interface TranscriptionEditorLockPayload {
  translationId: string
  turnId: string
}

export interface TranscriptionEditorOptions {
  /**
   * Host-provided commit: push a saved turn to the backend. The edit is
   * applied locally BEFORE this resolves (optimistic — blur must feel
   * instant); a failure is logged, the server broadcasts reconcile later.
   */
  saveTurn?: (
    payload: TranscriptionEditorSavePayload,
  ) => Promise<{ ok: boolean; reason?: string }>
  /**
   * Acquire-or-refresh the edit lock. Called at beginEdit, then re-emitted
   * every ~15s while editing (this IS the heartbeat: the server re-checks
   * rights and extends the TTL on each beat).
   */
  lockTurn?: (payload: TranscriptionEditorLockPayload) => Promise<{
    ok: boolean
    reason?: string
    holder?: { userId: string; userName: string } | null
  }>
  unlockTurn?: (
    payload: TranscriptionEditorLockPayload,
  ) => Promise<{ ok: boolean }>
}

// Client beat cadence; the server TTL is 45s — three missed beats lose the lock.
const HEARTBEAT_INTERVAL_MS = 15000

function computeLockKey(translationId: string, turnId: string): string {
  return `${translationId}/${turnId}`
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
      const editingTurnId = ref<string | null>(null)
      const editingCaretOffset = ref(0)
      /** Server-broadcast locks, keyed translationId/turnId. Own locks are in
       *  here too — the UI hides the badge on the turn being edited HERE, so
       *  a second tab of the same user still shows correctly as locked. */
      const locks = shallowReactive(
        new Map<string, { userId: string; userName: string }>(),
      )

      // Captured at beginEdit: heartbeat and unlock target the edit's track
      // even if the active translation changes mid-edit.
      let editingRef: TranscriptionEditorLockPayload | null = null
      // One lock request in flight at most — a blur-click elsewhere while the
      // ack is pending must not start a second edit.
      let lockPending = false
      let heartbeatTimer: ReturnType<typeof setInterval> | undefined

      // The edited text belongs to ONE language track: the active translation
      // (cross mode has no mutable store and is not editable).
      function getActiveTranslationStore(): TranslationStore | undefined {
        const channel = core.activeChannel.value
        if (!channel) return undefined
        return channel.translations.get(channel.activeTranslation.value.id)
      }

      // ── Locks state (host-pushed) ─────────────────────────────────────

      function getTurnLock(turnId: string) {
        const channel = core.activeChannel.value
        if (!channel) return undefined
        return locks.get(
          computeLockKey(channel.activeTranslation.value.id, turnId),
        )
      }

      function setLocks(all: TurnLock[]): void {
        locks.clear()
        for (const lock of all) setTurnLock(lock)
      }

      function setTurnLock(lock: TurnLock): void {
        locks.set(computeLockKey(lock.translationId, lock.turnId), {
          userId: lock.userId,
          userName: lock.userName,
        })
      }

      function clearTurnLock(ref: TranscriptionEditorLockPayload): void {
        locks.delete(computeLockKey(ref.translationId, ref.turnId))
      }

      // ── Heartbeat ─────────────────────────────────────────────────────

      function stopHeartbeat(): void {
        if (heartbeatTimer !== undefined) {
          clearInterval(heartbeatTimer)
          heartbeatTimer = undefined
        }
      }

      function startHeartbeat(target: TranscriptionEditorLockPayload): void {
        stopHeartbeat()
        if (!options.lockTurn) return
        heartbeatTimer = setInterval(() => {
          void refreshLock(target)
        }, HEARTBEAT_INTERVAL_MS)
      }

      async function refreshLock(
        target: TranscriptionEditorLockPayload,
      ): Promise<void> {
        try {
          const ack = await options.lockTurn!(target)
          if (!ack?.ok) exitEditAfterLockLoss(target, ack?.reason)
        } catch (err) {
          // Network hiccup: keep editing, the next beat retries — the server
          // TTL is the arbiter of a truly lost lock.
          console.error("[transcriptionEditor] heartbeat failed:", err)
        }
      }

      function exitEditAfterLockLoss(
        target: TranscriptionEditorLockPayload,
        reason: string | undefined,
      ): void {
        if (!editingRef || editingRef.turnId !== target.turnId) return
        // Dry exit (decided): the in-progress text is dropped, the turn shows
        // the last committed state again.
        console.error(
          `[transcriptionEditor] lock lost on turn ${target.turnId}: ${reason ?? "unknown"}`,
        )
        editingTurnId.value = null
        editingRef = null
        stopHeartbeat()
      }

      // ── Network pushes (fire-and-forget from the UI's perspective) ────

      async function pushUnlock(
        target: TranscriptionEditorLockPayload,
      ): Promise<void> {
        try {
          await options.unlockTurn?.(target)
        } catch (err) {
          console.error("[transcriptionEditor] unlock failed:", err)
        }
      }

      async function pushSaveThenUnlock(
        payload: TranscriptionEditorSavePayload,
      ): Promise<void> {
        // update_turn requires the lock server-side: the unlock MUST wait for
        // the save ack, or the save would be refused (not_lock_owner).
        try {
          const ack = await options.saveTurn?.(payload)
          if (ack && !ack.ok) {
            console.error(
              `[transcriptionEditor] save rejected for turn ${payload.turnId}: ${ack.reason ?? "unknown"}`,
            )
          }
        } catch (err) {
          console.error(
            `[transcriptionEditor] save failed for turn ${payload.turnId}:`,
            err,
          )
        }
        await pushUnlock({
          translationId: payload.translationId,
          turnId: payload.turnId,
        })
      }

      // ── Edit lifecycle ────────────────────────────────────────────────

      async function beginEdit(turnId: string, caretOffset = 0): Promise<void> {
        if (core.capabilities.value.text !== "edit") return
        if (lockPending) return
        if (editingTurnId.value === turnId) return
        const store = getActiveTranslationStore()
        if (!store?.hasTurn(turnId)) return
        // Local pre-check for instant feedback — the server ack below stays
        // the authority on races.
        if (locks.has(computeLockKey(store.id, turnId))) return
        // Switching turns: release the previous edit first.
        if (editingTurnId.value !== null) cancelEdit()

        const target = { translationId: store.id, turnId }
        if (options.lockTurn) {
          lockPending = true
          try {
            const ack = await options.lockTurn(target)
            if (!ack?.ok) {
              // Keep the badge honest even if the turn_locked broadcast was
              // missed: the refusal carries the holder.
              if (ack?.holder) setTurnLock({ ...target, ...ack.holder })
              return
            }
          } catch (err) {
            console.error("[transcriptionEditor] lock request failed:", err)
            return
          } finally {
            lockPending = false
          }
        }

        editingRef = target
        editingTurnId.value = turnId
        editingCaretOffset.value = caretOffset
        startHeartbeat(target)
      }

      function exitEditMode(): TranscriptionEditorLockPayload | null {
        const target = editingRef
        editingTurnId.value = null
        editingRef = null
        stopHeartbeat()
        // Drop the own-lock entry now instead of waiting for the
        // turn_unlocked broadcast — an immediate re-click must not hit the
        // local pre-check on a stale own lock.
        if (target) clearTurnLock(target)
        return target
      }

      function cancelEdit(): void {
        const target = exitEditMode()
        if (target) void pushUnlock(target)
      }

      function saveTurn(text: string): void {
        const turnId = editingTurnId.value
        if (turnId === null) return
        const target = exitEditMode()

        const store = getActiveTranslationStore()
        const turn = store?.getTurn(turnId)
        if (!store || !turn) {
          if (target) void pushUnlock(target)
          return
        }

        // Same whitespace contract as the server: single spaces, no
        // leading/trailing runs — client and server tokenize identically.
        const normalized = text.replace(/\s+/g, " ").trim()
        // An untouched turn produces no store update nor server save — but
        // the lock must still be released.
        if (normalized === computeTurnPlainText(turn)) {
          if (target) void pushUnlock(target)
          return
        }

        const words = carryWordTimes(wordsFromText(turnId, normalized), turn.words)
        store.updateTurn(turnId, {
          // Turn contract: text carries the content only when words is empty.
          text: words.length > 0 ? null : normalized,
          words,
        })
        void pushSaveThenUnlock({
          translationId: store.id,
          turnId,
          text: normalized,
        })
      }

      // Enter gesture: commit the text now; the actual split (word partition,
      // proportional cut of the straddled word) arrives with the server side.
      function splitTurn(text: string, _offset: number): void {
        saveTurn(text)
      }

      // A document reload rebuilds every store: the edit in progress and the
      // known locks belong to the previous state (the join re-ack reseeds).
      const offDocChange = core.on("document:change", () => {
        editingTurnId.value = null
        editingRef = null
        stopHeartbeat()
        locks.clear()
      })

      const api: TranscriptionEditorPluginApi = {
        editingTurnId,
        editingCaretOffset,
        beginEdit,
        cancelEdit,
        saveTurn,
        splitTurn,
        getTurnLock,
        setLocks,
        setTurnLock,
        clearTurnLock,
      }
      core.transcriptionEditor = api

      return () => {
        offDocChange()
        stopHeartbeat()
      }
    },
  }
}
