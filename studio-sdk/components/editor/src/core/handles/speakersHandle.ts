import { computed, type Ref } from "vue"
import type { EditorDocument, Speaker } from "../../types/editor"
import type { EditorEventMap, SpeakersHandle } from "../types"
import * as m from "../mutations"

export function createSpeakersHandle(
  document: Ref<EditorDocument>,
  emit: <K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) => void,
): SpeakersHandle {
  const all = computed(() => document.value.speakers)

  function ensure(speakerId: string | null, name?: string): void {
    const speaker = m.ensureSpeaker(document.value.speakers, speakerId, name)
    if (!speaker) return
    document.value.speakers.set(speaker.id, speaker)
    emit("speaker:add", { speaker })
  }

  function update(speakerId: string, patch: Partial<Omit<Speaker, "id">>): void {
    const updated = m.updateSpeaker(document.value.speakers, speakerId, patch)
    if (!updated) return
    document.value.speakers.set(speakerId, updated)
    emit("speaker:update", { speaker: updated })
  }

  return { all, ensure, update }
}
