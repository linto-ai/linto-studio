import { shallowReactive } from "vue"
import type { Speaker } from "../../types/editor"
import type { CoreEventMap, SpeakersStore } from "../types"
import { ensureSpeaker } from "../helpers/ensureSpeaker"
import { speakerEquals } from "../helpers/speakerEquals"

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
    const existing = all.get(speakerId)
    if (!existing) return
    const updated = { ...existing, ...patch }
    if (speakerEquals(existing, updated)) return
    all.set(speakerId, updated)
    emit("speaker:update", { speaker: updated })
  }

  function updateOrCreate(speaker: Speaker): void {
    const existing = all.get(speaker.id)
    if (existing) {
      if (speakerEquals(existing, speaker)) return
      all.set(speaker.id, speaker)
      emit("speaker:update", { speaker })
    } else {
      all.set(speaker.id, speaker)
      emit("speaker:add", { speaker })
    }
  }

  function remove(speakerId: string): void {
    if (!all.has(speakerId)) return
    all.delete(speakerId)
    emit("speaker:remove", { speakerId })
  }

  function clear(): void {
    all.clear()
  }

  return { all, ensure, update, updateOrCreate, delete: remove, clear }
}
