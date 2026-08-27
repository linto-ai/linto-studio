# @linto/transcript-ui-ui

Design-system components and CSS tokens for [@linto/transcript-ui](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui). Zero dependency on the transcript domain — every component here takes plain props (a string, a color, a list) and can be reused outside this project.

## What's in here

- **Atoms** — `Button`, `EditorIcon`, `Badge`, `CopyButton`, `EditableText`, `EditorCheckbox`, `MarkdownEditor`, `MarkdownView`, `CodeBlock`, `PopoverList`, `SelectableListItem`, `SpeakerIndicator`, `SwitchToggle`, `UserAvatar`.
- **Molecules** — `DocumentArticle`, `DownloadMenu`, `FormInput`, `SpeakerMenu`, `Tabs`, `TurnTextEditor`.
- **Styles** — the design tokens (`./styles/variables.css`, `./styles/base.css`, `./styles/popover-list.css`, `./styles/fonts.css`), importable individually via subpath (`@linto/transcript-ui-ui/styles/variables.css`). In practice you rarely need to import these yourself — `TranscriptUI` (from `@linto/transcript-ui-core`) already pulls them in.

## Usage

```ts
import { Button, EditorIcon } from "@linto/transcript-ui-ui"
```

See the [root README](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui#readme) for the full picture.
