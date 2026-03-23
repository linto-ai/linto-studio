import { ref } from "vue"
import type { AudioSource, Turn, Word } from "../../types/editor"
import type { EditorEventMap, TranslationStore } from "../types"
import { insertTurn } from "../helpers/insertTurn"
import { prependTurns as prependTurnsHelper } from "../helpers/prependTurns"
import { patchTurn } from "../helpers/patchTurn"
import { removeTurn as removeTurnHelper } from "../helpers/removeTurn"
import { updateTurnWords } from "../helpers/updateTurnWords"

interface TranslationInit {
  id: string
  languages: string[]
  isSource: boolean
  audio?: AudioSource
  turns: Turn[]
}

type Emit = <K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) => void
type SpeakersEnsure = (speakerId: string | null, name?: string) => void

export function createTranslationStore(
  init: TranslationInit,
  emit: Emit,
  speakersEnsure: SpeakersEnsure,
): TranslationStore {
  const { id, languages, isSource, audio } = init
  const turns = ref<Turn[]>(init.turns)
  const isLoadingHistory = ref(false)
  const hasMoreHistory = ref(true)

  function addTurn(turn: Turn): void {
    speakersEnsure(turn.speakerId)
    turns.value = insertTurn(turns.value, turn)
    emit("turn:add", { turn, translationId: id })
  }

  function updateTurn(turnId: string, patch: Partial<Turn>): void {
    const result = patchTurn(turns.value, turnId, patch)
    if (!result) return
    turns.value = result.turns
    emit("turn:update", { turn: result.updated, translationId: id })
  }

  function removeTurn(turnId: string): void {
    const result = removeTurnHelper(turns.value, turnId)
    if (!result) return
    turns.value = result
    emit("turn:remove", { turnId, translationId: id })
  }

  function updateWords(turnId: string, words: Word[]): void {
    const result = updateTurnWords(turns.value, turnId, words)
    if (!result) return
    turns.value = result.turns
    emit("turn:update", { turn: result.updated, translationId: id })
  }

  function prependTurns(newTurns: Turn[]): void {
    const seen = new Set<string>()
    for (const turn of newTurns) {
      if (turn.speakerId && !seen.has(turn.speakerId)) {
        seen.add(turn.speakerId)
        speakersEnsure(turn.speakerId)
      }
    }
    turns.value = prependTurnsHelper(turns.value, newTurns)
    emit("turns:prepend", { turns: newTurns, translationId: id })
  }

  function setTurns(newTurns: Turn[]): void {
    const seen = new Set<string>()
    for (const turn of newTurns) {
      if (turn.speakerId && !seen.has(turn.speakerId)) {
        seen.add(turn.speakerId)
        speakersEnsure(turn.speakerId)
      }
    }
    turns.value = newTurns
    emit("translation:sync", { translationId: id })
  }

  return { id, languages, isSource, audio, turns, isLoadingHistory, hasMoreHistory, addTurn, prependTurns, updateTurn, removeTurn, updateWords, setTurns }
}
