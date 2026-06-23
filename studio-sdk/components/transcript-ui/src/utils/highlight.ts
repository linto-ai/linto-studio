// Lazy-loaded syntax highlighter. Imported dynamically by CodeBlock so Prism
// and its grammars land in a separate chunk, never the initial bundle.
// The classic Prism theme CSS is injected separately (see webcomponent.ts for
// the Shadow DOM, main.ts for dev) — this module only produces token markup.
import Prism from "prismjs"
import DOMPurify from "dompurify"

// Grammars, in dependency order (javascript needs clike, typescript needs
// javascript). Extend this list to support more languages.
import "prismjs/components/prism-markup"
import "prismjs/components/prism-css"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-python"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-diff"

// Markdown fence languages → Prism canonical names.
const ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  py: "python",
  yml: "yaml",
  html: "markup",
  xml: "markup",
}

// Returns sanitized token HTML, or null when the language is unknown (caller
// falls back to plain text).
export function highlightCode(code: string, lang: string): string | null {
  const name = ALIASES[lang] ?? lang
  const grammar = Prism.languages[name]
  if (!grammar) return null
  return DOMPurify.sanitize(Prism.highlight(code, grammar, name))
}
