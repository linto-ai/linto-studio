import uuidv4 from "uuid/v4.js"

// Rebuild a screen's words from its text lines, spreading word timings
// linearly over the screen time window (same approach as the API's
// ensureWordTimings). Edited text can no longer be aligned with the
// original audio timestamps, so an even distribution is the best guess.
export function computeScreenWords(textLines, stime, etime) {
  const words = textLines
    .join(" ")
    .split(/\s+/)
    .filter((word) => word.length > 0)

  const span = etime - stime
  return words.map((word, index) => ({
    wid: uuidv4(),
    word,
    stime: stime + (span * index) / words.length,
    etime: stime + (span * (index + 1)) / words.length,
    confidence: 1,
  }))
}
