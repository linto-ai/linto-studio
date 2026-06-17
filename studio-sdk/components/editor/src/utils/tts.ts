// Reads finalized live transcription turns aloud using the browser's default
// speech synthesis (Web Speech API, window.speechSynthesis). Voice quality and
// language coverage depend on the voices installed in the user's browser/OS.

const TTS_SUPPORTED =
  typeof window !== "undefined" && "speechSynthesis" in window

export function isTTSSupported(): boolean {
  return TTS_SUPPORTED
}

// Queues an utterance. Repeated calls play sequentially, so each finalized
// turn is read in order.
export function speakText(text: string, lang?: string | null): void {
  if (!isTTSSupported()) return
  const clean = text.trim()
  if (!clean) return
  const utterance = new SpeechSynthesisUtterance(clean)
  // Skip the "*" multilingual wildcard — it is not a valid BCP-47 language tag.
  if (lang && lang !== "*") utterance.lang = lang
  window.speechSynthesis.speak(utterance)
}

// Speaks a silent utterance from within a user gesture (e.g. the toggle click)
// so the browser allows later, event-driven utterances to play.
export function unlockTTS(): void {
  if (!isTTSSupported()) return
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "))
}

export function stopTTS(): void {
  if (isTTSSupported()) window.speechSynthesis.cancel()
}
