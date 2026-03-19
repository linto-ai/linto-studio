/** Live transcription event types — placeholder, to adapt to backend format */

export interface LivePartialEvent {
  text?: string
  translations?: Array<{
    translationId: string
    text: string
  }>
}

export interface LiveFinalEvent {
  turnId: string
  speakerId: string | null
  text?: string
  words: Array<{
    id: string
    text: string
    startTime?: number
    endTime?: number
    confidence?: number
  }>
  startTime: number
  endTime: number
  language: string
  translations?: Array<{
    translationId: string
    text: string
    language: string
  }>
}

export interface LiveTranslationEvent {
  turnId: string
  language: string
  text: string
}
