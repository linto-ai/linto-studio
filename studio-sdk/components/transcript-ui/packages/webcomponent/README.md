# @linto-ai/transcript-ui-webcomponent

Part of [**@linto-ai/transcript-ui**](https://www.npmjs.com/package/@linto-ai/transcript-ui) — see there for the full package list and quick start.

[@linto-ai/transcript-ui](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui) packaged as a `<linto-editor>` [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), for hosts that aren't Vue. Self-contained: Vue itself, every official plugin, and styles are all bundled in — nothing else to install.

One exception: the font. `--font-family` names "Atkinson Hyperlegible Next" as the design's intended font, but a `@font-face` declared inside this component's shadow root isn't reliably applied by browsers, so it isn't bundled — without it, the token's own fallback chain (`system-ui, -apple-system, sans-serif`) applies. For the exact intended look, declare the `@font-face` yourself at document level (outside any shadow root) — see [`fonts.css`](../ui/src/styles/fonts.css) for the ready-made rules.

## Usage

```html
<script type="module">
  import { register, createAudioPlugin } from '@linto-ai/transcript-ui-webcomponent'
  import { mapApiDocument } from '@linto-ai/transcript-ui-core'

  register() // defines <linto-editor>

  const el = document.querySelector('linto-editor')
  el.core.use(createAudioPlugin())

  const raw = await fetch('/transcript.json').then((r) => r.json())
  el.core.setDocument(mapApiDocument(raw))
</script>

<linto-editor locale="en"></linto-editor>
```

`register(tagName?)` defines the custom element (`linto-editor` by default — pass a different name if that tag is already taken). The element exposes its `core` as a plain property (`el.core`), the same `Core` object documented in [`@linto-ai/transcript-ui-core`](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui/packages/core#readme) — activate plugins on it exactly as you would in a direct Vue integration.

Every plugin factory (`createAudioPlugin`, `createChatPlugin`, `createLLMServicesPlugin`, `createLivePlugin`, `createSubtitlePlugin`, `createTranscriptionEditorPlugin`) is re-exported from this same package — see each plugin's own README (linked from the [root README](https://github.com/linto-ai/linto-studio/tree/master/studio-sdk/components/transcript-ui#readme)) for its options.

Because everything is bundled ahead of time, this package doesn't benefit from picking plugins individually the way the direct-Vue integration does — installing it gets you all of them, at whatever `dist/` weighs. If bundle size matters more than not touching Vue, use `@linto-ai/transcript-ui` + individual plugin packages instead.

## Without a bundler, via a CDN

The package also ships as a single self-contained IIFE script (no ES modules, no `type="module"` needed) — everything hangs off a `LintoEditor` global instead of an `import`.

Once published to npm, jsDelivr/unpkg serve it by default (no path needed, via the `unpkg`/`jsdelivr` `package.json` fields):

```html
<script src="https://cdn.jsdelivr.net/npm/@linto-ai/transcript-ui-webcomponent"></script>
<script>
  LintoEditor.register()
  document.querySelector('linto-editor').core.use(LintoEditor.createAudioPlugin())
</script>

<linto-editor locale="en"></linto-editor>
```

Before that (or to pin an exact commit/branch), jsDelivr's GitHub mode serves straight from this repo, no npm publish required:

```html
<script src="https://cdn.jsdelivr.net/gh/linto-ai/linto-studio@master/studio-sdk/components/transcript-ui/packages/webcomponent/dist/linto-editor.iife.js"></script>
```
