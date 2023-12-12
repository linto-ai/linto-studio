export async function audioDuration(audioFile) {
  const context = new window.AudioContext()
  var buffer = await context.decodeAudioData(audioFile)
  return buffer.duration
}
