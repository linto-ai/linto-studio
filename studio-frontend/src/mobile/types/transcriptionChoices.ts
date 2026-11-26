// What the Record page asks about the next recordings (RecordSettings),
// flat and in the words of the screen. Turned into the request format by
// computeConversationSettings.
export interface TranscriptionChoices {
  serviceName: string | null
  language: string
  diarization: boolean
  // Voice collection ids to recognize enrolled speakers with.
  voiceCollections: string[]
  membersRight: number
  // null: the organization's inbox.
  folderId: string | null
}

// What is remembered per organization on this phone (see
// api/localStorage/transcriptionPreferences.js). Voice collections are
// left out: a deleted one would be sent.
export type RememberedChoices = Omit<TranscriptionChoices, "voiceCollections">

// One entry of GET /services, as far as the mobile app reads it.
export interface TranscriptionService {
  serviceName: string
  language?: string
  model_type?: string
  order?: number
  desc?: Record<string, string>
  endpoints: { endpoint: string }[]
  sub_services?: {
    punctuation?: { service_name: string }[]
    diarization?: {
      service_name: string
      info?: { speaker_identification?: boolean }
    }[]
  }
}
