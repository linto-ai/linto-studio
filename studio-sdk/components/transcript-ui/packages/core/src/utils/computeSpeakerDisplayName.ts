import type { Speaker } from "../types/editor"

type PlaceholderLabelKey =
  | "speaker.placeholderLabel"
  | "speaker.placeholderLabelNumbered"

/** Name to show for a speaker: its stored name, or — for a generated
 *  placeholder ("spk2", "Unknown speaker 2") — a label in the interface
 *  language keeping the placeholder's trailing number ("Intervenant 2").
 *  Only an explicit `defined: false` is a placeholder: a missing flag may
 *  hide a real name. */
export function computeSpeakerDisplayName(
  speaker: Pick<Speaker, "name" | "defined">,
  t: (
    key: PlaceholderLabelKey,
    params?: Record<string, string | number>,
  ) => string,
): string {
  if (speaker.defined !== false) return speaker.name
  const digits = /(\d+)\s*$/.exec(speaker.name ?? "")?.[1]
  if (digits === undefined) return t("speaker.placeholderLabel")
  return t("speaker.placeholderLabelNumbered", {
    number: parseInt(digits, 10),
  })
}
