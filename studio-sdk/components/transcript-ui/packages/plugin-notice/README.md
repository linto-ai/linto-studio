# @linto-ai/transcript-ui-plugin-notice

Part of [**@linto-ai/transcript-ui**](https://www.npmjs.com/package/@linto-ai/transcript-ui) — see there for the full package list and quick start.

A modal dialog showing a host-provided Markdown text (a disclaimer, a data protection notice, …). Headings, lists and links are rendered; links open in a new tab so the session behind the dialog is never navigated away from.

## Usage

```ts
import { createNoticePlugin } from "@linto-ai/transcript-ui-plugin-notice"

core.use(
  createNoticePlugin({
    content: "## Disclaimer\n\nThis transcript is generated automatically…",
  }),
)
```

The plugin brings no button of its own: open it from your own UI through the API it exposes:

```ts
core.notice!.open()
core.notice!.content.value = otherMarkdown // the text can be swapped at any time
```
