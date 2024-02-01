export default function setSpeakerName() {
  const speaker = this.speakers.find(
    (speaker) => speaker.speaker_id === this.speakerId
  )
  if (speaker) {
    this.speakerName = speaker.speaker_name
    this.speakerColor = speaker.color
  }
}
