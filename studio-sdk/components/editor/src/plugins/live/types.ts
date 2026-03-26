/** Live transcription event types — re-exported from core for convenience */

export type {
  LivePartialEventData as LivePartialEvent,
  LiveFinalEventData as LiveFinalEvent,
} from "../../core/types"

export interface LiveTranslationEvent {
  turnId: string
  language: string
  text: string
}
