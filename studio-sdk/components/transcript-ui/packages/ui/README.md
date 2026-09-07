# @linto-ai/transcript-ui-ui

Part of [**@linto-ai/transcript-ui**](https://www.npmjs.com/package/@linto-ai/transcript-ui) — see there for the full package list and quick start.

Design-system components and CSS tokens for [@linto-ai/transcript-ui](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui). Zero dependency on the transcript domain — every component here takes plain props (a string, a color, a list) and can be reused outside this project.

## What's in here

- **Atoms** — `Button`, `EditorIcon`, `Badge`, `CopyButton`, `EditableText`, `EditorCheckbox`, `MarkdownEditor`, `MarkdownView`, `CodeBlock`, `PopoverList`, `SelectableListItem`, `SpeakerIndicator`, `SwitchToggle`, `UserAvatar`.
- **Molecules** — `DocumentArticle`, `DownloadMenu`, `FormInput`, `SpeakerMenu`, `Tabs`, `TurnTextEditor`.
- **Styles** — the design tokens (`./styles/variables.css`, `./styles/base.css`, `./styles/popover-list.css`), importable individually via subpath (`@linto-ai/transcript-ui-ui/styles/variables.css`). In practice you rarely need to import these yourself — `TranscriptUI` (from `@linto-ai/transcript-ui-core`) already pulls them in. `./styles/fonts.css` is the one exception: NOT auto-imported (a `@font-face` inside a shadow root — the webcomponent's case — isn't reliably applied by browsers), opt in yourself only for a direct, non-shadow-DOM Vue embed.

## Usage

```ts
import { Button, EditorIcon } from "@linto-ai/transcript-ui-ui"
```

See the [root README](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui#readme) for the full picture.
