# @linto/transcript-ui-plugin-audio

Audio playback synced with the transcript: waveform display, active-word/active-turn highlighting as playback progresses, click-to-seek, and per-speaker region coloring on the waveform.

## Usage

```ts
import { createAudioPlugin } from "@linto/transcript-ui-plugin-audio"

core.use(
  createAudioPlugin({
    // Resolve a Channel/Translation's `audio.src` into a playable URL —
    // add auth, fetch as a blob, whatever your backend requires.
    // (generateUrl/fileId below are just this host's own routing — not
    // part of this library.)
    resolveSrc: async (source) => {
      const response = await fetch(generateUrl(`apps/linto/api/audio/${fileId}`))
      if (!response.ok) throw new Error("Audio unavailable")
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    },
  }),
)
```

Any `blob:` URL returned by `resolveSrc` is revoked automatically when the source changes or the plugin is destroyed.

`resolveWaveform` is the same idea for precomputed waveform peaks (e.g. fetched from your API) — return `null` to fall back to client-side decoding.
