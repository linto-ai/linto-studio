import { computeSpeakerLabel } from "@/tools/transcription/computeSpeakerLabel.js"

// Speakers with defined: false show a label instead of their generated name.
// Broadcasts carry the stored name: it is swapped while it is unchanged.
export function createSpeakerLabels(t) {
  // Speaker id → its generated name
  const generatedNames = new Map()

  function addSpeaker(speaker) {
    if (speaker.defined !== false) return speaker.speaker_name
    generatedNames.set(speaker.speaker_id, speaker.speaker_name)
    return computeSpeakerLabel(speaker.speaker_name, t)
  }

  function relabel(speaker, idKey, nameKey) {
    const name = speaker[nameKey]
    if (generatedNames.get(speaker[idKey]) !== name) return speaker
    return { ...speaker, [nameKey]: computeSpeakerLabel(name, t) }
  }

  function labelTurnSpeakerUpdated(update) {
    return { ...update, speaker: relabel(update.speaker, "id", "name") }
  }

  function labelSpeakerRenamed(renamed) {
    return relabel(renamed, "speakerId", "name")
  }

  function labelSpeakerRestored(restored) {
    const fromSpeaker = relabel(
      restored.fromSpeaker,
      "speaker_id",
      "speaker_name",
    )
    return { ...restored, fromSpeaker }
  }

  return {
    addSpeaker,
    labelTurnSpeakerUpdated,
    labelSpeakerRenamed,
    labelSpeakerRestored,
  }
}
