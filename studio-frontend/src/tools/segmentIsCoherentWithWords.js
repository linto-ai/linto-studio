export function segmentIsCoherentWithWords(segment, words) {
  return (
    words
      .filter((word) => word.word !== "")
      .map((word) => word.word)
      .join(" ")
      .trim() === segment.trim()
  )
}
