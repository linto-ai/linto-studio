import { apiGetTranscriptionService } from "@/api/service"
import { apiGetTranscriberProfilesByOrganization } from "@/api/session.js"

/**
 * What a new transcription can be made with: the services and the profiles
 * usable in a quick session. An organization without any profile can't create
 * sessions either. A list that can't be read comes back empty.
 * @param {string} organizationId
 * @returns {Promise<{ services: object[], profiles: object[], hasAnyProfile: boolean }>}
 */
export async function loadCatalog(organizationId) {
  const [services, profiles] = await Promise.all([
    apiGetTranscriptionService("*"),
    apiGetTranscriberProfilesByOrganization(organizationId),
  ])
  return {
    services,
    profiles: profiles.filter((profile) => profile.quickMeeting),
    hasAnyProfile: profiles.length > 0,
  }
}
