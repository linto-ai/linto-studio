import { computed } from "vue"
import type { Translation, Turn, Word } from "../../types/editor"
import type { EditorEventMap, TranslationHandle } from "../types"
import * as m from "../mutations"

export function createTranslationHandle(
  getTranslation: () => Translation,
  emit: <K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) => void,
  speakersEnsure: (speakerId: string | null, name?: string) => void,
): TranslationHandle {
  const data = computed(getTranslation)
  const turns = computed(() => data.value.turns)

  function addTurn(turn: Turn): void {
    const translation = getTranslation()
    speakersEnsure(turn.speakerId)
    translation.turns = m.insertTurn(translation.turns, turn)
    emit("turn:add", { turn })
  }

  function updateTurn(turnId: string, patch: Partial<Turn>): void {
    const translation = getTranslation()
    const result = m.patchTurn(translation.turns, turnId, patch)
    if (!result) return
    translation.turns = result.turns
    emit("turn:update", { turn: result.updated })
  }

  function removeTurn(turnId: string): void {
    const translation = getTranslation()
    const turns = m.removeTurn(translation.turns, turnId)
    if (!turns) return
    translation.turns = turns
    emit("turn:remove", { turnId })
  }

  function updateWords(turnId: string, words: Word[]): void {
    const translation = getTranslation()
    const result = m.updateTurnWords(translation.turns, turnId, words)
    if (!result) return
    translation.turns = result.turns
    emit("turn:update", { turn: result.updated })
  }

  return { data, turns, addTurn, updateTurn, removeTurn, updateWords }
}
