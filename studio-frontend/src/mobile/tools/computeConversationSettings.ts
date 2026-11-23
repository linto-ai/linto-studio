import { pickRecommendedService } from "./pickRecommendedService.js"
import { buildTranscriptionSettings } from "./buildTranscriptionSettings.js"
import { isSpeakerIdentificationCapable } from "./isSpeakerIdentificationCapable.js"
import type {
  ConversationSettings,
  TranscriptionSettings,
} from "../types/localRecording.ts"
import type {
  TranscriptionChoices,
  TranscriptionService,
} from "../types/transcriptionChoices.ts"

// What buildTranscriptionSettings (JavaScript) answers.
interface TranscriptionFields {
  serviceName: string
  endpoint: string
  lang: string
  config: Record<string, unknown>
  speakerIdentificationCollections: string[]
}

/**
 * The request settings for the screen's choices. Voice collections are
 * sent only when the service can recognize enrolled voices. The folder is
 * taken as given: the caller checks it still exists. The transcription is
 * null when no service is offered.
 */
export function computeConversationSettings(
  services: TranscriptionService[],
  choices: TranscriptionChoices,
  speakerIdentificationEnabled: boolean,
): ConversationSettings {
  const service = pickRecommendedService(
    services,
    choices.serviceName,
  ) as TranscriptionService | null
  return {
    transcription: service
      ? computeTranscription(service, choices, speakerIdentificationEnabled)
      : null,
    sharing: { membersRight: choices.membersRight, folderId: choices.folderId },
  }
}

function computeTranscription(
  service: TranscriptionService,
  choices: TranscriptionChoices,
  speakerIdentificationEnabled: boolean,
): TranscriptionSettings {
  const voicesRecognized = isSpeakerIdentificationCapable(
    service,
    speakerIdentificationEnabled,
  )
  const transcription = buildTranscriptionSettings(service, {
    language: choices.language,
    diarization: choices.diarization,
    speakerIdentificationCollections: voicesRecognized
      ? choices.voiceCollections
      : [],
  }) as TranscriptionFields
  return {
    serviceName: transcription.serviceName,
    endpoint: transcription.endpoint,
    lang: transcription.lang,
    transcriptionConfig: transcription.config,
    speakerIdentificationCollections:
      transcription.speakerIdentificationCollections,
  }
}
