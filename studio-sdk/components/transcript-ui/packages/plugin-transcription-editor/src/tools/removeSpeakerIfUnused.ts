import type { Core } from "@linto/transcript-ui-core"

/**
 * Drop a speaker from the GLOBAL store only when no LOADED track still
 * references it. The server GC is per-track (per child conversation); the
 * client store spans the whole document — a speaker id shared across tracks
 * must survive its removal from one of them.
 */
export function removeSpeakerIfUnused(core: Core, speakerId: string): void {
  for (const channel of core.channels.values()) {
    for (const translation of channel.translations.values()) {
      for (const turn of translation.turns.value) {
        if (turn.speakerId === speakerId) return
      }
    }
  }
  core.speakers.delete(speakerId)
}
