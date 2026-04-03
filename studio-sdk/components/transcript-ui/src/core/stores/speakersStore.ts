import { shallowReactive } from "vue"
import type { Speaker } from "../../types/editor"
import type { CoreEventMap, SpeakersStore } from "../types"
import { ensureSpeaker } from "../helpers/ensureSpeaker"
import { updateSpeaker as updateSpeakerHelper } from "../helpers/updateSpeaker"

type Emit = <K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]) => void

export function createSpeakersStore(
  emit: Emit,
): SpeakersStore & { clear(): void } {
  const all = shallowReactive(new Map<string, Speaker>())

  function ensure(speakerId: string | null, name?: string): void {
    const speaker = ensureSpeaker(all, speakerId, name)
    if (!speaker) return
    all.set(speaker.id, speaker)
    emit("speaker:add", { speaker })
  }

  function update(speakerId: string, patch: Partial<Omit<Speaker, "id">>): void {
    const updated = updateSpeakerHelper(all, speakerId, patch)
    if (!updated) return
    all.set(speakerId, updated)
    emit("speaker:update", { speaker: updated })
  }

  function clear(): void {
    all.clear()
  }

  return { all, ensure, update, clear }
}
