/** One turn's data, already resolved to display strings — this function only
 *  formats/joins, it doesn't know about speakers, i18n, or date formatting. */
export interface VerbatimTextTurn {
  speakerName: string
  time: string | null
  languageName: string | null
  text: string
}

/** Plain-text rendering of a verbatim document: the title, then each turn as
 *  a "Speaker · time · language" header line followed by its text. */
export function buildVerbatimText(
  title: string,
  turns: VerbatimTextTurn[],
): string {
  const lines: string[] = []
  if (title) lines.push(title, "")

  for (const turn of turns) {
    const meta = [turn.speakerName, turn.time, turn.languageName]
      .filter(Boolean)
      .join(" · ")
    if (meta) lines.push(meta)
    lines.push(turn.text, "")
  }

  return lines.join("\n").trimEnd() + "\n"
}
