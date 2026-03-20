import { ref, watch, type ComputedRef } from "vue"
import type { Channel } from "../../types/editor"
import type { EditorEventMap, ChannelHandle, TurnEventKey } from "../types"
import { createTranslationHandle } from "./translationHandle"
import * as m from "../mutations"

export function createChannelHandle(
  activeChannel: ComputedRef<Channel>,
  emit: <K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) => void,
  on: <K extends keyof EditorEventMap>(event: K, handler: (payload: EditorEventMap[K]) => void) => () => void,
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

  function scopedOn<K extends TurnEventKey>(
    event: K,
    handler: (payload: EditorEventMap[K]) => void,
  ): () => void {
    return on(event, (payload) => {
      if (payload.translationId === activeTranslation.data.value.id) {
        handler(payload)
      }
    })
  }

  return {
    data: activeChannel,
    activeTranslation: { ...activeTranslation, on: scopedOn },
    setActiveTranslation,
  }
}
