import type { Speaker } from "../../types/editor"

export function speakerEquals(
  a: Pick<Speaker, "name" | "color">,
  b: Pick<Speaker, "name" | "color">,
): boolean {
  return a.name === b.name && a.color === b.color
}
