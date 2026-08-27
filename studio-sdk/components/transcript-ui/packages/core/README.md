# @linto/transcript-ui-core

The main piece of @linto/transcript-ui — a Vue component for displaying and interacting with a transcript. It bundles the document state (`createCore`), the editor layout (`Layout`), and adapters that convert LinTO Studio API or WhisperX transcripts into a format it understands.

## Usage

```vue
<script setup lang="ts">
import { TranscriptUI, mapApiDocument } from "@linto/transcript-ui-core"
</script>

<template>
  <TranscriptUI ref="editor" locale="en" />
</template>
```

`TranscriptUI` handles everything on its own: it creates the document state, shows a loading spinner, then the transcript once a document is loaded.

## Building your own layout instead

If you don't want `TranscriptUI`'s default screen, `createCore`/`provideCore` and `Layout` are the two pieces it uses internally — use them directly to build your own.

## Turning a transcript into something this package understands

- `mapApiDocument` — for a transcript from the LinTO Studio API.
- `mapWhisperXDocument` — for raw WhisperX output.

## Data model

A document (`EditorDocument`) has a flat list of speakers and one or more channels.

- **Channel** — one audio/recording track (e.g. one microphone, one room). Has one or more `Translation`s.
- **Translation** — one language track within a channel: the source language, or an auto-translated version. Exactly one per channel is the source (`isSource: true`). Holds an ordered list of `Turn`s and, for the source, the `AudioSource` to play.
- **Turn** — one speech segment: a `speakerId` (pointing into the document's shared `speakers` map, or `null` if unassigned), a language, and either `text` (a plain string, e.g. from a live text-only source) or `words` (per-word timing, e.g. from ASR) — never both.
- **Word** — one word inside a turn: its text, character offsets into the turn's plain text, and optional start/end time and confidence.
- **Speaker** — id, display name, color. Stored once per document, referenced by id from every `Turn` — renaming a speaker updates every turn that points at them for free.

```
EditorDocument
├── speakers: Map<id, Speaker>
└── channels: Channel[]
    └── translations: Translation[]   (one is the source; others are translations)
        └── turns: Turn[]
            ├── speakerId → looked up in EditorDocument.speakers
            └── text (string) OR words (Word[]) — never both
```
