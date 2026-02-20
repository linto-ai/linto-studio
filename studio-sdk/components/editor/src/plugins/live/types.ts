/** Live transcription event types — placeholder, to adapt to backend format */

export interface LivePartialEvent {
  turnId: string
  speakerId: string
  text: string
}

export interface LiveFinalEvent {
  turnId: string
  speakerId: string
  text: string
  words: Array<{
    id: string
    text: string
    startTime: number
    endTime: number
    confidence: number
  }>
  startTime: number
  endTime: number
  language: string
}

export interface LiveTranslationEvent {
  turnId: string
  language: string
  text: string
}

export interface LivePluginApi {
  onPartial(event: LivePartialEvent): void
  onFinal(event: LiveFinalEvent): void
  onTranslation(event: LiveTranslationEvent): void
}
