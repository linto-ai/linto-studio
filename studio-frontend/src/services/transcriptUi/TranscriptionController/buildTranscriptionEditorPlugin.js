import { createTranscriptionEditorPlugin } from "@linto-ai/transcript-ui-webcomponent"

// Lock + save editing protocol: every mutation goes through the shared
// socket.io connection. refetchTrack reloads a track the server says is
// ahead.
export function buildTranscriptionEditorPlugin(socket, refetchTrack) {
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
    refetchTranslation: refetchTrack,
  })
}
