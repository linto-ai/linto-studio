import type { Core } from "../types"

export function renameSpeaker(
  core: Core,
  speakerId: string,
  newName: string,
): void {
  const trimmed = newName.trim()
  const existing = core.speakers.all.get(speakerId)
  // A placeholder renamed to its own stored name stays a placeholder.
  if (!existing || !trimmed || trimmed === existing.name) return
  core.speakers.update(speakerId, { name: trimmed, defined: true })
}
