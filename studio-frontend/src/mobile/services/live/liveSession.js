import {
  apiGetTranscriberProfilesByOrganization,
  apiCreateQuickSession,
  apiDeleteQuickSession,
} from "@/api/session.js"
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"

// Live sessions from the phone: profiles that allow a quick meeting, start
// and stop (the running one lives in the quickSession store). None throws.

export async function loadLiveProfiles(organizationId) {
  try {
    const profiles =
      await apiGetTranscriberProfilesByOrganization(organizationId)
    return profiles.filter((profile) => profile.quickMeeting)
  } catch (error) {
    console.error("cannot load live profiles", error)
    return []
  }
}

export async function startLiveSession(organizationId, channel) {
  try {
    const result = await apiCreateQuickSession(organizationId, {
      channels: [channel],
      meta: { securityLevel: DEFAULT_SECURITY_LEVEL },
    })
    return { ok: result?.status === "success" }
  } catch (error) {
    console.error("cannot start live session", error)
    return { ok: false }
  }
}

export async function stopLiveSession(organizationId, sessionId, name) {
  try {
    const result = await apiDeleteQuickSession(organizationId, sessionId, {
      name,
      force: true,
    })
    return { ok: result?.status === "success" }
  } catch (error) {
    console.error("cannot stop live session", error)
    return { ok: false }
  }
}
