import { apiListChatSessions } from "@/api/chat"
import { mapSession } from "../helpers"

// Single-flight: the drawer's open watcher and openCatchup request the list
// at the same instant; they must share one GET.
export function onLoadSessions(ctx) {
  if (!ctx.sessionsInFlight) {
    ctx.sessionsInFlight = fetchSessions(ctx).finally(() => {
      ctx.sessionsInFlight = null
    })
  }
  return ctx.sessionsInFlight
}

async function fetchSessions({ core, scope }) {
  try {
    const sessions = await apiListChatSessions(scope)
    const mapped = sessions.map(mapSession)
    core.chat.setSessions(mapped)
    return mapped
  } catch (e) {
    console.error("[chat] load sessions failed", e)
    return []
  }
}
