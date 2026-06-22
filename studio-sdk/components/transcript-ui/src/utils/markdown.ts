import { marked } from "marked"
import DOMPurify from "dompurify"

// Shared markdown renderer for MarkdownView (v-html) and MarkdownEditor
// (innerHTML / execCommand "insertHTML"). The source — LLM output,
// collaboratively-edited content, pasted text — is untrusted, so marked's raw
// HTML output MUST be sanitized before it reaches the DOM. marked removed its
// built-in `sanitize` option in v8 and explicitly defers to a dedicated
// sanitizer (DOMPurify), so without this every `<img onerror>` / `javascript:`
// payload would execute in the host page (the editor ships as a Web Component).
marked.setOptions({ gfm: true, breaks: false })

export function renderMarkdown(md: string): string {
  if (!md) return ""
  const rawHtml = marked.parse(md, { async: false }) as string
  return DOMPurify.sanitize(rawHtml)
}
