import i18n from "@/i18n"
import { loadTranscriptionServices } from "@/mobile/services/transcription/loadTranscriptionServices.js"
import { readTranscriptionPreferences } from "@/mobile/services/transcription/transcriptionPreferences.js"
import { computeTranscriptionChoices } from "@/mobile/tools/computeTranscriptionChoices.js"
import { pickRecommendedService } from "@/mobile/tools/pickRecommendedService.js"
import { buildTranscriptionSettings } from "@/mobile/tools/buildTranscriptionSettings.js"

// Transcription and sharing of a recording sent without them: recorded
// before the services were loaded (offline at startup) or left behind by
// a previous session. Built from the organization's remembered choices,
// like the Record page does. The folder is not trusted (it may have been
// deleted since): such a recording lands in the inbox.
// Never throws: transcription is null when no service can be reached.
export async function resolveUploadSettings(organizationId) {
  const saved = readTranscriptionPreferences(organizationId)
  const services = await loadTranscriptionServices()
  const choices = computeTranscriptionChoices(services, saved, i18n.locale)
  const service = pickRecommendedService(services, choices.serviceName)
  return {
    transcription: service
      ? buildTranscriptionSettings(service, {
          language: choices.language,
          diarization: choices.diarization,
        })
      : null,
    sharing: { membersRight: choices.membersRight, folderId: null },
  }
}
