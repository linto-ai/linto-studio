export default function isSessionStarted(session) {
  if (!session) {
    return false
  }

  if (session.status === "active") {
    return true
  }

  if (session.status === "ready") {
    if (!session.startTime) {
      return true
    }

    const startTime = new Date(session?.startTime)
    const endTime = new Date(session?.endTime)
    const now = new Date()

    if (startTime < now && endTime > now) {
      return true
    }
  }

  return false
}
