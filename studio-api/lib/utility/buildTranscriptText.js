/**
 * Build plain text transcript from conversation turns
 */
function buildTranscriptText(conversation, separator = ": ") {
  if (!conversation.text) return ""
  const speakerMap = {}
  if (conversation.speakers) {
    conversation.speakers.forEach((s) => {
      speakerMap[s.speaker_id] = s.speaker_name
    })
  }
  return conversation.text
    .map((turn) => {
      const name = speakerMap[turn.speaker_id] || "Unknown"
      return `${name}${separator}${turn.segment}`
    })
    .join("\n")
}

module.exports = { buildTranscriptText }
