// Label of a generated speaker name ("spk2", "Unknown speaker 2"): its
// trailing number, in the interface language.
export function computeSpeakerLabel(generatedName, t) {
  const number = /(\d+)\s*$/.exec(generatedName ?? "")?.[1]
  if (number === undefined) {
    return t("conversation.speaker_toolbox.placeholder_name_unnumbered")
  }
  return t("conversation.speaker_toolbox.placeholder_name", {
    number: parseInt(number, 10),
  })
}
