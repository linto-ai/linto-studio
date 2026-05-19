import type { WatermarkToken } from "../../../core/types"

export type WatermarkPart =
  | { type: "text"; value: string }
  | { type: "token"; src: string; alt: string }

const TOKEN_RE = /\$(\w+)/g

export function parseWatermark(
  content: string,
  tokens: Record<string, WatermarkToken>,
): WatermarkPart[] {
  const parts: WatermarkPart[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  TOKEN_RE.lastIndex = 0
  while ((match = TOKEN_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) })
    }

    const name = match[1] ?? ""
    const token = name ? tokens[name] : undefined
    if (token) {
      parts.push({ type: "token", src: token.src, alt: token.alt ?? name })
    } else {
      parts.push({ type: "text", value: match[0] })
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) })
  }

  return parts
}
