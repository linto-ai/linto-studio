// Browser speech synthesis (Web Speech API) helpers for reading turns aloud.

const TTS_SUPPORTED =
  typeof window !== "undefined" && "speechSynthesis" in window

export function isTTSSupported(): boolean {
  return TTS_SUPPORTED
}

// At least one voice installed (the list loads async — also watch "voiceschanged").
export function hasVoices(): boolean {
  return TTS_SUPPORTED && window.speechSynthesis.getVoices().length > 0
}

// Voice for the language (exact tag, else base code); null → use the default.
function findVoice(lang: string): SpeechSynthesisVoice | null {
  if (!TTS_SUPPORTED || !lang || lang === "*") return null
  const norm = lang.toLowerCase()
  const base = norm.split("-")[0]
  const voices = window.speechSynthesis.getVoices()
  const exact = voices.find((v) => v.lang.toLowerCase() === norm)
  if (exact) return exact
  return voices.find((v) => v.lang.toLowerCase().split("-")[0] === base) ?? null
}

// Speaks text in its language; calls queue and play in order. Falls back to the
// browser's default voice when no voice matches the language.
export function speakText(text: string, lang?: string | null): void {
  if (!isTTSSupported()) return
  const clean = text.trim()
  if (!clean) return
  const utterance = new SpeechSynthesisUtterance(clean)
  const voice = lang ? findVoice(lang) : null
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  }
  window.speechSynthesis.speak(utterance)
}

// Silent utterance within a user gesture, to unlock later event-driven playback.
export function unlockTTS(): void {
  if (!isTTSSupported()) return
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "))
}

export function stopTTS(): void {
  if (isTTSSupported()) window.speechSynthesis.cancel()
}
