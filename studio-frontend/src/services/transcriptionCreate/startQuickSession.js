import {
  apiCreateQuickSession,
  apiDeleteQuickSession,
  apiStartBot,
} from "@/api/session.js"

/**
 * Creates the quick session of a microphone recording.
 * @param {string} organizationId
 * @param {object} request - see buildQuickSessionRequest
 * @returns {Promise<{ success: boolean, errorData?: object }>}
 */
export async function startMicrophoneSession(organizationId, request) {
  const session = await apiCreateQuickSession(organizationId, request)
  if (session.status !== "success") return computeFailure(session)
  // Read by the quick session page, which starts recording right away.
  sessionStorage.setItem("startQuickSession", true)
  return { success: true }
}

/**
 * Creates the quick session of a videoconference and sends the bot in. A bot
 * that can't join leaves no session behind.
 * @param {string} organizationId
 * @param {object} request - see buildQuickSessionRequest
 * @param {(channelId: string) => object} buildBotRequest - see buildBotRequest
 * @returns {Promise<{ success: boolean, errorData?: object, botFailed?: boolean }>}
 */
export async function startVisioSession(
  organizationId,
  request,
  buildBotRequest,
) {
  const session = await apiCreateQuickSession(organizationId, request)
  if (session.status !== "success") return computeFailure(session)
  const bot = await apiStartBot(
    organizationId,
    buildBotRequest(session.data.channels[0].id),
  )
  if (bot.status === "success") return { success: true }
  await apiDeleteQuickSession(organizationId, session.data.id, {
    trash: true,
    force: true,
  })
  return { success: false, botFailed: true }
}

function computeFailure(response) {
  return { success: false, errorData: response.error?.response?.data }
}
