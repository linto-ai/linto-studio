# @linto/transcript-ui

A Vue 3 component for displaying and interacting with a **transcript** — an ordered list of speech turns, each attributed to a speaker. On its own it's a read-only viewer; a plugin system adds everything else on top: a collaborative editing mode, a live transcription mode, and hooks for LLM services (summaries, chat).

It ships two built-in adapters, so a document can come from either:
- the LinTO Studio API format
- WhisperX output

It's used in production inside [LinTO Studio](https://github.com/linto-ai/linto-studio) — this package lives in that same repository.

## Packages

| Package | Purpose |
|---|---|
| `@linto/transcript-ui` | Batteries-included entry point — re-exports `core` + `ui` + `i18n`. What most consumers install. |
| `@linto/transcript-ui-core` | State layer (`createCore`, stores, format adapters) and the `TranscriptUI`/`Layout` shell. |
| `@linto/transcript-ui-ui` | Design-system components (buttons, icons, markdown rendering, …) and the CSS tokens. |
| `@linto/transcript-ui-i18n` | i18n engine and translation dictionary. |
| `@linto/transcript-ui-plugin-*` | One package per plugin — see below. |
| `@linto/transcript-ui-webcomponent` | `<linto-editor>` custom element, for hosts that aren't Vue. |

`core`/`ui`/`i18n`/plugin packages ship as source (no build step of their own) — your bundler compiles them as part of your own app, so there's nothing to pre-build to consume them from a Vue app. `webcomponent` ships a pre-built, self-contained bundle instead.

## Plugins

Each plugin is a separate package — install only what you need:

- [Audio](packages/plugin-audio/README.md) — playback synced with the transcript (waveform, active-word highlight, seek).
- [Transcription editor](packages/plugin-transcription-editor/README.md) — collaborative turn/speaker editing (rename, split, merge, locks).
- [Live](packages/plugin-live/README.md) — ingests a real-time transcription feed (partials/finals).
- [Subtitle](packages/plugin-subtitle/README.md) — fullscreen/banner subtitle display, with an optional watermark.
- [LLM services](packages/plugin-llm-services/README.md) — generated documents (summaries, reports) derived from the transcript.
- [Chat](packages/plugin-chat/README.md) — a chat panel for talking with an LLM assistant about the transcript.

A separate guide on writing your own plugin will follow.

## Installation

```bash
npm install @linto/transcript-ui
```

That's the core state layer, the UI kit, and i18n — enough to display a read-only transcript. Add plugins as needed:

```bash
npm install @linto/transcript-ui-plugin-audio @linto/transcript-ui-plugin-transcription-editor
```

For a non-Vue host, install the Web Component instead:

```bash
npm install @linto/transcript-ui-webcomponent
```

## Quick start

### Vue integration

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue"
import { TranscriptUI, mapApiDocument, type Core } from "@linto/transcript-ui-core"
import { createAudioPlugin } from "@linto/transcript-ui-plugin-audio"

// TranscriptUI creates and owns its own `core` — grab it once mounted to
// activate plugins and load a document.
const editorRef = useTemplateRef<InstanceType<typeof TranscriptUI>>("editor")

onMounted(async () => {
  const core: Core = editorRef.value!.core
  core.use(createAudioPlugin())

  const raw = await fetch("/transcript.json").then((r) => r.json())
  core.setDocument(mapApiDocument(raw))
})
</script>

<template>
  <TranscriptUI ref="editor" locale="en" />
</template>
```

### Web Component

```html
<script type="module">
  import { register, createAudioPlugin } from '@linto/transcript-ui-webcomponent'
  import { mapApiDocument } from '@linto/transcript-ui-core'

  register() // defines <linto-editor>

  const el = document.querySelector('linto-editor')
  el.core.use(createAudioPlugin())

  const raw = await fetch('/transcript.json').then((r) => r.json())
  el.core.setDocument(mapApiDocument(raw))
</script>

<linto-editor locale="en"></linto-editor>
```

## Development

```bash
bun install
bun dev            # playground — every plugin wired up, http://localhost:5173
bun test
bun run build      # build the root package
bun run build:wc   # build the Web Component
bash scripts/pack-all.sh  # pack every publishable package into .pack/ (real
                          # tarballs, "workspace:*" resolved) — test installs
                          # elsewhere before actually publishing
```

### Development fixtures

`packages/playground/public/projet-libre-openstreetmap.mp3` is extracted from the podcast *State of the Map 2026 à Paris*, published by [Projets Libres !](https://www.projets-libres.org/podcast/72-state-of-the-map-2026-a-paris/) under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) or later.

`projet-libre-openstreetmap.json` and `projet-libre-openstreetmap_whisperx.json` are transcriptions derived from that audio; per the license's ShareAlike clause, they're made available under the same CC BY-SA license — distinct from this repository's AGPL v3 code license.

These files are only used by the playground and aren't part of any published package (`public/` isn't copied into any `dist/`).

## License

AGPL-3.0
