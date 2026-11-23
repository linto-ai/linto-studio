import { DEFAULT_SECURITY_LEVEL } from "../../const/securityLevels.js"
import type {
  LocalRecording,
  SharingSettings,
  TranscriptionSettings,
} from "../types/localRecording.ts"

/**
 * The fields apiCreateConversation sends for a local recording: its
 * settings completed with what depends on the sending (name, description,
 * security level, the audio file). No folder: the organization's inbox.
 */
export function buildRecordingRequest(
  recording: LocalRecording,
  {
    transcription,
    sharing,
  }: { transcription: TranscriptionSettings; sharing: SharingSettings },
  file: File,
) {
  return {
    name: recording.name,
    description: "",
    securityLevel: DEFAULT_SECURITY_LEVEL,
    serviceName: transcription.serviceName,
    endpoint: transcription.endpoint,
    lang: transcription.lang,
    transcriptionConfig: JSON.stringify(transcription.transcriptionConfig),
    speakerIdentificationCollections:
      transcription.speakerIdentificationCollections,
    membersRight: sharing.membersRight,
    folderId: sharing.folderId ?? undefined,
    tracks: [file],
  }
}
