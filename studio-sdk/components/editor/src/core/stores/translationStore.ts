import { shallowRef } from "vue"
import type { AudioSource, Turn, Word } from "../../types/editor"
import type { EditorEventMap, TranslationStore } from "../types"
import { insertTurn } from "../helpers/insertTurn"
import { prependTurns as prependTurnsHelper } from "../helpers/prependTurns"
import { patchTurn } from "../helpers/patchTurn"
import { removeTurn as removeTurnHelper } from "../helpers/removeTurn"
import { updateTurnWords } from "../helpers/updateTurnWords"
import { ensureSpeakersFromTurns } from "../helpers/ensureSpeakersFromTurns"
import { findTurnIndex } from "../helpers/findTurnIndex"

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
  const turns = shallowRef<Turn[]>(init.turns)

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
    ensureSpeakersFromTurns(newTurns, speakersEnsure)
    turns.value = prependTurnsHelper(turns.value, newTurns)
  }

  function setTurns(newTurns: Turn[]): void {
    ensureSpeakersFromTurns(newTurns, speakersEnsure)
    turns.value = newTurns
    emit("translation:sync", { translationId: id })
  }

  function hasTurn(turnId: string): boolean {
    return findTurnIndex(turns.value, turnId) !== -1
  }

  return { id, languages, isSource, audio, turns, addTurn, prependTurns, updateTurn, removeTurn, updateWords, setTurns, hasTurn }
}
