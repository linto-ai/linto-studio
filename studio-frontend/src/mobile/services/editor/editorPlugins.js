import {
  apiGetAudioFileFromConversation,
  apiGetAudioWaveFormFromConversation,
} from "@/api/conversation"

// Plugin factories of the conversation editor, fed by the shared API and
// the shared socket.io connection (lock + save editing protocol).

export function buildAudioPlugin(createAudioPlugin) {
  return createAudioPlugin({
    resolveSrc: async (source) => {
      const res = await apiGetAudioFileFromConversation(source.src, false)
      if (res?.status !== "success" || !res.data || res.data.size === 0) {
        throw new Error("Audio unavailable")
      }
      return URL.createObjectURL(res.data)
    },
    resolveWaveform: async (source) => {
      const res = await apiGetAudioWaveFormFromConversation(source.src, false)
      if (res?.status !== "success" || !Array.isArray(res.data?.data)) {
        return null
      }
      return res.data.data
    },
  })
}

export function buildTranscriptionEditorPlugin(
  createTranscriptionEditorPlugin,
  socket,
  refetchTranslation,
) {
  return createTranscriptionEditorPlugin({
    saveTurn: (payload) => socket.saveEditorTurn(payload),
    lockTurn: (payload) => socket.lockEditorTurn(payload),
    unlockTurn: (payload) => socket.unlockEditorTurn(payload),
    splitTurn: (payload) => socket.splitEditorTurn(payload),
    mergeTurns: (payload) => socket.mergeEditorTurns(payload),
    deleteTurn: (payload) => socket.deleteEditorTurn(payload),
    updateTurnSpeaker: (payload) => socket.updateEditorTurnSpeaker(payload),
    renameSpeaker: (payload) => socket.renameEditorSpeaker(payload),
    replaceSpeaker: (payload) => socket.replaceEditorSpeaker(payload),
    undo: (payload) => socket.undoEditor(payload),
    redo: (payload) => socket.redoEditor(payload),
    refetchTranslation,
  })
}

// Server broadcasts flow one way into the editor plugin.
export function buildEditorRoomHandlers(core) {
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
    onTurnSpeakerUpdated: (update) => editor()?.applyTurnSpeakerUpdated(update),
    onSpeakerRenamed: (renamed) => editor()?.applySpeakerRenamed(renamed),
    onSpeakerReplaced: (replaced) => editor()?.applySpeakerReplaced(replaced),
    onSpeakerRestored: (restored) => editor()?.applySpeakerRestored(restored),
  }
}
