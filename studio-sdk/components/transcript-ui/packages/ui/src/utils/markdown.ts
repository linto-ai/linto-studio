import { marked } from "marked"
import type { Token, TokensList } from "marked"
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

// Code blocks are extracted as their own segments so the view can render them
// with a real Vue component (copy button, etc.) instead of inert v-html. Every
// other run of block tokens is parsed back to sanitized HTML as before.
export type MarkdownSegment =
  | { type: "html"; html: string }
  | { type: "code"; code: string; lang: string }

export function renderMarkdownSegments(md: string): MarkdownSegment[] {
  if (!md) return []

  const tokens = marked.lexer(md)
  const segments: MarkdownSegment[] = []
  let buffer: Token[] = []

  // Reference-link definitions ([x][ref] … [ref]: url) live on tokens.links,
  // not on individual tokens. Each sliced group must carry them over or
  // reference links break when re-parsed in isolation.
  const flush = () => {
    if (buffer.length === 0) return
    const group = buffer as TokensList
    group.links = tokens.links
    segments.push({ type: "html", html: DOMPurify.sanitize(marked.parser(group)) })
    buffer = []
  }

  for (const token of tokens) {
    if (token.type === "code") {
      flush()
      segments.push({ type: "code", code: token.text, lang: token.lang ?? "" })
    } else {
      buffer.push(token)
    }
  }
  flush()

  return segments
}
