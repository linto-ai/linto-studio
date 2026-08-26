# @linto/transcript-ui-plugin-transcription-editor

Collaborative editing of turns and speakers: rename, split, merge, and reassign, with per-turn locks and server-authoritative sync. This plugin never computes the retimed truth itself — every option below is optimistic-local-then-server-broadcast: the edit applies instantly in the UI, your callback pushes it to the backend, and the backend's broadcast (applied back through `core.transcriptionEditor.apply*`) is what actually sticks.

## Usage

```ts
import { createTranscriptionEditorPlugin } from "@linto/transcript-ui-plugin-transcription-editor"

core.use(
  createTranscriptionEditorPlugin({
    saveTurn: async ({ translationId, turnId, text }) => {
      const ok = await api.saveTurn(translationId, turnId, text)
      return { ok }
    },
    lockTurn: async ({ translationId, turnId }) => {
      const holder = await api.lockTurn(translationId, turnId)
      return { ok: !holder, holder }
    },
    unlockTurn: async ({ translationId, turnId }) => {
      await api.unlockTurn(translationId, turnId)
      return { ok: true }
    },
    // splitTurn, deleteTurn, mergeTurns, updateTurnSpeaker, renameSpeaker,
    // replaceSpeaker, refetchTranslation — same shape, all optional.
  }),
)
```

Apply what the backend broadcasts to other clients (e.g. over a websocket) the same way:

```ts
socket.on("editor:turn_updated", (update) => {
  core.transcriptionEditor?.applyTurnUpdate(update)
})
```

Locks broadcast by the server are pushed with `setLocks`/`setTurnLock`/`clearTurnLock`; a reconnect re-ack that reports a version gap is handled by calling your `refetchTranslation` and then `reconcileVersions`.

## In production

[`ConversationsTranscription.vue`](https://github.com/linto-ai/linto-studio/blob/next/studio-frontend/src/views/ConversationsTranscription.vue) (LinTO Studio) wires every callback above to its WebSocket API.
