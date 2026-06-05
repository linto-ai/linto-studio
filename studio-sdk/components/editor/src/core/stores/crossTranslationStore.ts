import { computed } from "vue"
import type { Turn } from "../../types/editor"
import type {
  EditorEventMap,
  ReadableTranslation,
  TranslationStore,
} from "../types"
import { extractLangCode } from "../../utils/extractLangCode"
import { isSameLanguage } from "../../utils/isSameLanguage"

export const CROSS_TRANSLATION_ID = "cross"

type Emit = <K extends keyof EditorEventMap>(
  event: K,
  payload: EditorEventMap[K],
) => void
type On = <K extends keyof EditorEventMap>(
  event: K,
  handler: (payload: EditorEventMap[K]) => void,
) => () => void

export interface CrossTranslationStore extends ReadableTranslation {
  /** Unsubscribe the underlying turn-event relay. */
  dispose(): void
}

/**
 * Virtual, read-only translation for a bilingual document: each turn is shown
 * in the *other* language. Returns null when not applicable — i.e. the source
 * doesn't have exactly two languages, or a translation track is missing for one
 * of them. Otherwise turn content is composed from the two matching translation
 * tracks (keyed by turnId). Stores nothing — `turns` is a computed.
 *
 * Because the active-translation event scope filters on `translationId`, and the
 * real tracks emit under their own id, this store relays their turn events under
 * `CROSS_TRANSLATION_ID` so that subtitle/scroller listeners fire while cross is
 * active. Call `dispose()` to detach the relay.
 */
export function createCrossTranslationStore(
  source: TranslationStore,
  translations: Map<string, TranslationStore>,
  emit: Emit,
  on: On,
): CrossTranslationStore | null {
  const langs = source.languages.map(extractLangCode)
  if (langs.length !== 2) return null
  const tracksByLanguage = new Map<string, TranslationStore>()

  for (const tr of translations.values()) {
    if (tr.id === source.id) {
      continue
    }
    if (tr.languages.length !== 1) {
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

  // The two translation tracks the cross composes from (excludes any extra
  // language track). Both tracks hold every turn — one in each language — so
  // membership alone isn't enough to pick a side (see relay below).
  const crossTrackIds = new Set([
    tracksByLanguage.get(langA)!.id,
    tracksByLanguage.get(langB)!.id,
  ])

  const turns = computed<Turn[]>(() =>
    source.turns.value.map((turn) => getTurn(turn.id) ?? turn),
  )

  function getTurn(turnId: string): Turn | undefined {
    const sourceTurn = source.getTurn(turnId)
    if (!sourceTurn) return undefined

    const target = isSameLanguage(sourceTurn.language, langA) ? langB : langA
    if (!target) return sourceTurn

    const targetTurn = tracksByLanguage.get(target)?.getTurn(turnId)
    if (!targetTurn) return sourceTurn

    return targetTurn
  }

  // ── Relay underlying track events under the cross id ──────────────────
  // The active-translation scope filters on translationId, and the real tracks
  // emit under their own id, so we re-emit as "cross". Both tracks hold every
  // turn, so we relay only the side opposite the original — i.e. where the
  // turn's language differs from its sourceLanguage. This is data-driven, so it
  // doesn't depend on the source/translation event ordering.
  const unsubs: Array<() => void> = []

  function isOppositeSide(turn: Turn, translationId: string): boolean {
    if (!crossTrackIds.has(translationId)) return false
    if (turn.sourceLanguage == null) return true
    return !isSameLanguage(turn.language, turn.sourceLanguage)
  }

  function relayAddOrUpdate(event: "turn:add" | "turn:update"): void {
    unsubs.push(
      on(event, ({ turn, translationId }) => {
        if (!isOppositeSide(turn, translationId)) return
        emit(event, { turn, translationId: CROSS_TRANSLATION_ID })
      }),
    )
  }
  relayAddOrUpdate("turn:add")
  relayAddOrUpdate("turn:update")
  unsubs.push(
    on("turn:remove", ({ turnId, translationId }) => {
      if (!crossTrackIds.has(translationId)) return
      emit("turn:remove", { turnId, translationId: CROSS_TRANSLATION_ID })
    }),
  )

  function dispose(): void {
    unsubs.forEach((fn) => fn())
    unsubs.length = 0
  }

  return {
    id: CROSS_TRANSLATION_ID,
    isSource: false,
    languages: source.languages,
    turns,
    getTurn,
    dispose,
  }
}
