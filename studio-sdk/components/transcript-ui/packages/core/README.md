# @linto-ai/transcript-ui-core

Part of [**@linto-ai/transcript-ui**](https://www.npmjs.com/package/@linto-ai/transcript-ui) — see there for the full package list and quick start.

The main piece of @linto-ai/transcript-ui — a Vue component for displaying and interacting with a transcript. It bundles the document state (`createCore`), the editor layout (`Layout`), and adapters that convert LinTO Studio API or WhisperX transcripts into a format it understands.

## Usage

```vue
<script setup lang="ts">
import { TranscriptUI, mapApiDocument } from "@linto-ai/transcript-ui-core"
</script>

<template>
  <TranscriptUI ref="editor" locale="en" />
</template>
```

`TranscriptUI` handles everything on its own: it creates the document state, shows a loading spinner, then the transcript once a document is loaded.

## Building your own layout instead

If you don't want `TranscriptUI`'s default screen, `createCore`/`provideCore` and `Layout` are the two pieces it uses internally — use them directly to build your own.

## Driving the layout from the host

Rendering your own header (`<TranscriptUI no-header>`) removes the button that
opens the sidebar on phones — the sidebar's only entry point at that width.
Two things on `core` let your own header take that job over:

- `core.isMobile` — readonly ref, true at the width where the layout swaps its
  permanent sidebar for a drawer. Read it instead of repeating the media query,
  so your button shows up exactly when the drawer exists.
- `core.setSidebarOpen(open)` / `core.sidebarOpen` — open or close that drawer.

Opening is **refused** above the breakpoint, silently and without an event:
only the mobile, single-panel layout mounts a drawer, and an "open" stored
while none exists would spring it on the user at the next resize. Closing
always applies.

Two events keep a host in sync without watching a Vue ref — which matters when
the host isn't a Vue 3 app (a Vue 2 app, or plain JS around the web component,
can read `core.isMobile.value` but can't subscribe to it):

```js
core.on("viewport:change", ({ isMobile }) => {
  sidebarButton.hidden = !isMobile
})

// Your button is not the only thing that moves the drawer — its own close
// button, a channel change and leaving phone width also shut it.
core.on("sidebar:open", ({ open }) => {
  sidebarButton.setAttribute("aria-expanded", String(open))
})
```

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
