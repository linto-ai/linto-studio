import { ref, computed, shallowReactive } from "vue"
import type { Channel } from "../../types/editor"
import type { ChannelStore, EditorEventMap, TranslationStore } from "../types"
import { createTranslationStore } from "./translationStore"

type Emit = <K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) => void
type SpeakersEnsure = (speakerId: string | null, name?: string) => void

export function createChannelStore(
  channel: Channel,
  emit: Emit,
  speakersEnsure: SpeakersEnsure,
): ChannelStore {
  const { id, name, description, duration } = channel

  const translations = shallowReactive(new Map<string, TranslationStore>())
  let sourceTranslation!: TranslationStore

  for (const tr of channel.translations) {
    const store = createTranslationStore(tr, emit, speakersEnsure)
    translations.set(tr.id, store)
    if (tr.isSource && !sourceTranslation) sourceTranslation = store
  }

  if (!sourceTranslation) {
    sourceTranslation = translations.values().next().value!
  }

  const activeTranslationId = ref<string | null>(null)

  const activeTranslation = computed<TranslationStore>(() => {
    if (activeTranslationId.value) {
      return translations.get(activeTranslationId.value) ?? sourceTranslation
    }
    return sourceTranslation
  })

  function setActiveTranslation(translationId: string | null): void {
    const normalized = translationId === sourceTranslation.id ? null : translationId
    if (normalized === activeTranslationId.value) return
    activeTranslationId.value = normalized
    emit("translation:change", { translationId: activeTranslationId.value })
  }

  return {
    id,
    name,
    description,
    duration,
    translations,
    sourceTranslation,
    activeTranslation,
    setActiveTranslation,
  }
}
