import { ref, computed, shallowReactive } from "vue"
import type { Channel } from "../../types/editor"
import type {
  ChannelStore,
  EditorEventMap,
  ReadableTranslation,
  TranslationStore,
} from "../types"
import { createTranslationStore } from "./translationStore"
import { CROSS_TRANSLATION_ID, createCrossTranslationStore } from "./crossTranslationStore"

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

  const crossTranslation = createCrossTranslationStore(sourceTranslation, translations)

  const selectableTranslations: ReadableTranslation[] = [...translations.values()]
  if (crossTranslation) selectableTranslations.push(crossTranslation)

  const activeTranslationId = ref<string | null>(null)
  const isLoadingHistory = ref(false)
  const hasMoreHistory = ref(true)

  const activeTranslation = computed<ReadableTranslation>(() => {
    const id = activeTranslationId.value
    if (id === CROSS_TRANSLATION_ID) return crossTranslation ?? sourceTranslation
    if (id) return translations.get(id) ?? sourceTranslation
    return sourceTranslation
  })

  function setActiveTranslation(translationId: string | null): void {
    const normalized = translationId === sourceTranslation.id ? null : translationId
    if (normalized === activeTranslationId.value) return
    activeTranslationId.value = normalized
    emit("translation:change", { translationId: activeTranslation.value.id })
  }

  function reset(): void {
    for (const translation of translations.values()) {
      translation.setTurns([])
    }
    isLoadingHistory.value = false
    hasMoreHistory.value = true
    emit("channel:reset", { channelId: id })
  }

  return {
    id,
    name,
    description,
    duration,
    translations,
    sourceTranslation,
    crossTranslation,
    selectableTranslations,
    activeTranslation,
    isLoadingHistory,
    hasMoreHistory,
    setActiveTranslation,
    reset,
  }
}
