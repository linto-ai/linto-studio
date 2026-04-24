/**
 * Check if two speaker arrays differ on {speaker_id, speaker_name}.
 * Order-insensitive (speakers are identified by speaker_id).
 *
 * @param {Array<{speaker_id: string, speaker_name: string}>} oldSpeakers
 * @param {Array<{speaker_id: string, speaker_name: string}>} newSpeakers
 */
function speakersChanged(oldSpeakers, newSpeakers) {
  if (oldSpeakers.length !== newSpeakers.length) return true
  const oldById = new Map(oldSpeakers.map((s) => [s.speaker_id, s.speaker_name]))
  for (const s of newSpeakers) {
    if (oldById.get(s.speaker_id) !== s.speaker_name) return true
  }
  return false
}

module.exports = { speakersChanged }
