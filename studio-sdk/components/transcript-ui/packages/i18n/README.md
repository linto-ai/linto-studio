# @linto-ai/transcript-ui-i18n

Part of [**@linto-ai/transcript-ui**](https://www.npmjs.com/package/@linto-ai/transcript-ui) — see there for the full package list and quick start.

i18n engine and translation dictionary for [@linto-ai/transcript-ui](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui).

## Usage

```ts
import { provideI18n } from "@linto-ai/transcript-ui-i18n"

const locale = ref<"fr" | "en">("en")
const { t } = provideI18n(locale)
```

`TranscriptUI` (from `@linto-ai/transcript-ui-core`) already calls `provideI18n` for you — you only need this directly if you're composing your own root component instead of using `TranscriptUI`.

`useI18n()` reads whatever was provided above it in the component tree; called with nothing provided, it falls back to French.

See the [root README](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui#readme) for the full picture.
