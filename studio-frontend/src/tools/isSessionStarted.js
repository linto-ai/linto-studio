export default function isSessionStarted(session) {
  if (!session) {
    return false
  }

  if (session.status === "active") {
    return true
  }

  if (session.status === "ready" || session.status === "on_schedule") {
    if (!session.scheduleOn) {
      return true
    }

    const startTime = new Date(session?.scheduleOn)
    const now = new Date()

    return startTime < now
  }

  return false
}
