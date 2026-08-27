# @linto-ai/transcript-ui-plugin-live

Ingests a real-time transcription feed: partial and final segments as they arrive, text-to-speech playback of live turns, and the state the subtitle plugin and transcript panel read to follow along live.

## Usage

```ts
import { createLivePlugin } from "@linto-ai/transcript-ui-plugin-live"

core.use(createLivePlugin({ tts: true })) // tts: offer voice playback of live turns
```

Feed it from your transcription stream (e.g. a websocket):

```ts
socket.on("partial", (event) => core.live?.onPartial(event, channelId))
socket.on("final", (event) => core.live?.onFinal(event, channelId))
socket.on("translation", (event) => core.live?.onTranslation(event))
```

Loading older history (pagination) uses `prependFinal`/`prependFinalBatch` instead — the transcript panel emits `scroll:top` when the user scrolls near the top of an already-loaded track:

```ts
core.on("scroll:top", async ({ translationId }) => {
  const olderTurns = await api.fetchHistory(translationId)
  core.live?.prependFinalBatch(olderTurns, channelId)
})
```

## Event shapes

```ts
interface LivePartialEvent {
  turnId?: string // segment this partial belongs to (matches the opposite-
                   // language partial in cross/translation mode)
  text?: string
  language: string
}

interface LiveFinalEvent {
  turnId: string
  speakerId: string | null
  text?: string
  words: Array<{
    id: string
    text: string
    startTime?: number
    endTime?: number
    confidence?: number
  }>
  startTime: number
  endTime: number
  startDate?: number // Unix seconds — wall-clock fallback when startTime is absent
  endDate?: number
  language: string
  translations?: Array<{ translationId: string; text: string; language: string }>
}

interface LiveTranslationEvent {
  turnId: string
  language: string
  sourceLanguage: string // the original (source) side being translated from
  text: string
  final: boolean
  startTime: number
  endTime: number
  speakerId: string | null
}
```

A partial has no fixed shape requirement beyond `language` — send whatever text you have as it's transcribed, the plugin just tracks the latest one per channel. A final is the committed turn: `words` carries word-level timing when you have it (ASR), otherwise leave it empty and set `text` instead — same "one or the other" contract as a regular `Turn`. `onTranslation` is for a live translation track arriving as its own stream rather than riding along in `translations` on the final.

## In production

[`SessionLiveNG.vue`](https://github.com/linto-ai/linto-studio/blob/next/studio-frontend/src/components/SessionLiveNG.vue) (LinTO Studio) wires `onPartial`/`onFinal`/`onTranslation` to a WebSocket subscription.
