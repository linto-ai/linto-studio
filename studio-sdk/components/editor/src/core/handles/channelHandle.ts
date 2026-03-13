import { ref, watch, type ComputedRef } from "vue"
import type { Channel } from "../../types/editor"
import type { EditorEventMap, ChannelHandle } from "../types"
import { createTranslationHandle } from "./translationHandle"
import * as m from "../mutations"

export function createChannelHandle(
  activeChannel: ComputedRef<Channel>,
  emit: <K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) => void,
  speakersEnsure: (speakerId: string | null, name?: string) => void,
): ChannelHandle {
  const activeTranslationId = ref<string | null>(null)

  // Reset translation when channel changes
  watch(activeChannel, () => {
    activeTranslationId.value = null
  })

  const activeTranslation = createTranslationHandle(
    () => m.findActiveTranslation(activeChannel.value, activeTranslationId.value),
    emit,
    speakersEnsure,
  )

  function setActiveTranslation(translationId: string | null): void {
    const source = m.findSourceTranslation(activeChannel.value)
    const normalized = translationId === source.id ? null : translationId
    if (normalized === activeTranslationId.value) return
    activeTranslationId.value = normalized
    emit("translation:change", { translationId: activeTranslationId.value })
  }

  return {
    data: activeChannel,
    activeTranslation,
    setActiveTranslation,
  }
}
