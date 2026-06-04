import { computed } from "vue"
import type { Turn } from "../../types/editor"
import type { ReadableTranslation, TranslationStore } from "../types"

export const CROSS_TRANSLATION_ID = "cross"

function extractLangCode(language: string): string {
  return language.split("-")[0]!
}
/**
 * Virtual, read-only translation for a bilingual document: each turn is shown
 * in the *other* language. Returns null when not applicable — i.e. the source
 * doesn't have exactly two languages, or a translation track is missing for one
 * of them. Otherwise turn content is composed from the two matching translation
 * tracks (keyed by turnId). Stores nothing — `turns` is a computed.
 */
export function createCrossTranslationStore(
  source: TranslationStore,
  translations: Map<string, TranslationStore>,
): ReadableTranslation | null {
  const langs = source.languages.map(extractLangCode)
  if (langs.length !== 2) return null
  const tracksByLanguage = new Map<string, TranslationStore>()

  for (const tr of translations.values()) {
    if (tr.id === source.id) {
      continue
    }
    if (tr.languages.length != 1) {
      return null
    }
    if (!tr.languages[0]) {
      return null
    }

    tracksByLanguage.set(extractLangCode(tr.languages[0]), tr)
  }

  for (const lang of langs) {
    if (!tracksByLanguage.has(lang)) {
      return null
    }
  }

  const [langA, langB] = langs
  if (!langA || !langB) return null

  const turns = computed<Turn[]>(() =>
    source.turns.value.map((turn) => getTurn(turn.id) ?? turn),
  )

  function getTurn(turnId: string): Turn | undefined {
    const sourceTurn = source.getTurn(turnId)
    if (!sourceTurn) return undefined

    const target =
      extractLangCode(sourceTurn.language) === langA ? langB : langA
    if (!target) return sourceTurn

    const targetTurn = tracksByLanguage.get(target)?.getTurn(turnId)
    if (!targetTurn) return sourceTurn

    // Swap content into the other language; keep identity, timing, speaker.
    return targetTurn
  }

  return {
    id: CROSS_TRANSLATION_ID,
    isSource: false,
    languages: source.languages,
    turns,
    getTurn,
  }
}
