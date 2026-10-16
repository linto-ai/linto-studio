// Server broadcasts of the editor room flow one way into the editing
// plugin. The join ack, sent again on every reconnection, reseeds the locks
// and refetches the loaded tracks the server says are ahead.
export function buildEditorRoomHandlers(core, speakerLabels) {
  const editor = () => core.transcriptionEditor
  return {
    onJoined: (ack) => {
      if (!ack?.ok) return
      editor()?.setLocks(ack.locks ?? [])
      editor()?.reconcileVersions(ack.versions ?? {})
    },
    onTurnLocked: (lock) => editor()?.setTurnLock(lock),
    onTurnUnlocked: (ref) => editor()?.clearTurnLock(ref),
    onTurnUpdated: (update) => editor()?.applyTurnUpdate(update),
    onTurnSplit: (split) => editor()?.applyTurnSplit(split),
    onTurnsMerged: (merge) => editor()?.applyTurnsMerged(merge),
    onTurnDeleted: (deleted) => editor()?.applyTurnDeleted(deleted),
    onTurnSpeakerUpdated: (update) =>
      editor()?.applyTurnSpeakerUpdated(
        speakerLabels.labelTurnSpeakerUpdated(update),
      ),
    onSpeakerRenamed: (renamed) =>
      editor()?.applySpeakerRenamed(speakerLabels.labelSpeakerRenamed(renamed)),
    onSpeakerReplaced: (replaced) => editor()?.applySpeakerReplaced(replaced),
    onSpeakerRestored: (restored) =>
      editor()?.applySpeakerRestored(
        speakerLabels.labelSpeakerRestored(restored),
      ),
  }
}
