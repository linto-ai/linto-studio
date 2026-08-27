import type { Ref } from "vue"
import type { Core } from "@linto-ai/transcript-ui-core"
import type { LockHeartbeat } from "./tools/LockHeartbeat"

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

export interface TranscriptionEditorSplitPayload {
  translationId: string
  turnId: string
  /** Character offset in the NORMALIZED saved text (single spaces, trimmed). */
  offset: number
}

export interface TranscriptionEditorTurnSpeakerPayload {
  translationId: string
  turnId: string
  /** Exactly one of the two: assign an existing speaker, or create by name. */
  speakerId?: string
  speakerName?: string
}

export interface TranscriptionEditorRenameSpeakerPayload {
  translationId: string
  speakerId: string
  name: string
}

export interface TranscriptionEditorReplaceSpeakerPayload {
  translationId: string
  fromSpeakerId: string
  toSpeakerId: string
}

export interface TranscriptionEditorMergePayload {
  translationId: string
  /** Document order — the server checks second follows first immediately. */
  firstTurnId: string
  secondTurnId: string
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
  /**
   * Split the turn at the offset, on the SAVED state (the plugin sequences
   * the save push first). The split is not applied locally: the server's
   * turn_split broadcast is the single application path.
   */
  splitTurn?: (
    payload: TranscriptionEditorSplitPayload,
  ) => Promise<{ ok: boolean; reason?: string }>
  /**
   * Remove a turn — triggered by committing an emptied text (there is no
   * delete button: the gesture IS the deletion). The server refuses the
   * track's last turn. Applied at the turn_deleted broadcast.
   */
  deleteTurn?: (
    payload: TranscriptionEditorLockPayload,
  ) => Promise<{ ok: boolean; reason?: string }>
  /**
   * Merge two adjacent turns. Requires BOTH turns lock-free server-side
   * (requester included) — the button only shows on free turns, the ack is
   * the authority. Applied at the turns_merged broadcast.
   */
  mergeTurns?: (
    payload: TranscriptionEditorMergePayload,
  ) => Promise<{ ok: boolean; reason?: string }>
  // ── Speakers (no lock — atomic, last-write-wins; applied at broadcast) ──
  updateTurnSpeaker?: (
    payload: TranscriptionEditorTurnSpeakerPayload,
  ) => Promise<{ ok: boolean; reason?: string }>
  renameSpeaker?: (
    payload: TranscriptionEditorRenameSpeakerPayload,
  ) => Promise<{ ok: boolean; reason?: string }>
  replaceSpeaker?: (
    payload: TranscriptionEditorReplaceSpeakerPayload,
  ) => Promise<{ ok: boolean; reason?: string }>
  /**
   * Reload a track's content from the backend — called when a version gap
   * is detected (missed broadcasts) or when the reconnection re-ack says
   * the track went stale. Must re-push the fetched content AND its version
   * (setTranslationVersion) into the plugin.
   */
  refetchTranslation?: (translationId: string) => Promise<void>
}

// ── Internal ────────────────────────────────────────────────────────────

/**
 * Shape of the plugin's mutable state — implemented by the EditorSession
 * class (index.ts), whose methods pass `this` explicitly to the handler
 * files. No handler closes over shared mutables.
 */
export interface EditorPluginState {
  core: Core
  options: TranscriptionEditorOptions
  /** Turn currently being edited (single-turn editing), null when none. */
  editingTurnId: Ref<string | null>
  /** Caret offset requested for the editor when it opens. */
  editingCaretOffset: Ref<number>
  /** Server-broadcast locks, keyed translationId/turnId. Own locks are in
   *  here too — the UI hides the badge on the turn being edited HERE, so a
   *  second tab of the same user still shows correctly as locked. */
  locks: Map<string, { userId: string; userName: string }>
  /** Captured at beginEdit: heartbeat and unlock target the edit's track
   *  even if the active translation changes mid-edit. */
  editingRef: TranscriptionEditorLockPayload | null
  /** One lock request in flight at most — a click elsewhere while the ack
   *  is pending must not start a second edit. */
  lockPending: boolean
  heartbeat: LockHeartbeat
  /** Per-track edit version of the LOADED content (host-pushed with each
   *  content fetch). Broadcasts are gap-checked against it. */
  versions: Map<string, number>
  /** Tracks with a refetch in flight — a burst of gapped broadcasts must
   *  trigger one reload, not one per broadcast. */
  pendingRefetches: Set<string>
}
