# @linto-ai/transcript-ui-plugin-subtitle

Fullscreen or banner subtitle display driven by the transcript (live or not), with an optional cycling watermark (text and/or image tokens).

## Usage

```ts
import { createSubtitlePlugin } from "@linto-ai/transcript-ui-plugin-subtitle"

core.use(
  createSubtitlePlugin({
    fontSize: 40,
    isVisible: true,
    watermark: {
      content: "{logo} Recorded with LinTO",
      tokens: { logo: { src: "/logo.svg", alt: "LinTO" } },
      frequency: 30, // show every 30s
      duration: 5, // for 5s
    },
  }),
)
```

Toggle it from your own UI (a settings panel, a button, …) through the reactive state it exposes:

```ts
core.subtitle!.isVisible.value = true
core.subtitle!.enterFullscreen()
```
