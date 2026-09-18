import type { ChatSession } from "@linto-ai/transcript-ui-core"

export interface SessionOption {
  value: string
  label: string
}

// Options of the phone discussion picker (a native select). A select always
// shows one of its options, so a discussion that isn't listed yet — none
// started, or just created — gets its own entry under the "new" label.
export function computeSessionOptions(
  sessions: ChatSession[],
  activeSessionId: string | null,
  newSessionLabel: string,
): SessionOption[] {
  const options = sessions.map((session) => ({
    value: session.id,
    label: session.title || newSessionLabel,
  }))
  const isActiveListed = sessions.some((s) => s.id === activeSessionId)
  if (isActiveListed) return options
  return [{ value: activeSessionId ?? "", label: newSessionLabel }, ...options]
}
