import { shallowRef } from "vue"
import type { AudioSource, Turn, Word } from "../../types/editor"
import type { CoreEventMap, TranslationStore } from "../types"
import { insertTurn } from "../helpers/insertTurn"
import { prependTurns as prependTurnsHelper } from "../helpers/prependTurns"
import { patchTurn } from "../helpers/patchTurn"
import { removeTurn as removeTurnHelper } from "../helpers/removeTurn"
import { updateTurnWords } from "../helpers/updateTurnWords"
import { ensureSpeakersFromTurns } from "../helpers/ensureSpeakersFromTurns"

interface TranslationInit {
  id: string
  languages: string[]
  isSource: boolean
  audio?: AudioSource
  turns: Turn[]
}

type Emit = <K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]) => void
type SpeakersEnsure = (speakerId: string | null, name?: string) => void

export function createTranslationStore(
  init: TranslationInit,
  emit: Emit,
  speakersEnsure: SpeakersEnsure,
): TranslationStore {
  const { id, languages, isSource, audio } = init
  const turns = shallowRef<Turn[]>(init.turns)

  // ── Index: turnId → array position (O(1) lookup) ─────────────────────
  const indexMap = new Map<string, number>()

  function rebuildIndex(): void {
    indexMap.clear()
    const arr = turns.value
    for (let i = 0; i < arr.length; i++) {
      indexMap.set(arr[i]!.id, i)
    }
  }
  rebuildIndex()

  function addTurn(turn: Turn): void {
    speakersEnsure(turn.speakerId)
    indexMap.set(turn.id, turns.value.length)
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
    rebuildIndex()
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
    rebuildIndex()
  }

  function setTurns(newTurns: Turn[]): void {
    ensureSpeakersFromTurns(newTurns, speakersEnsure)
    turns.value = newTurns
    rebuildIndex()
    emit("translation:sync", { translationId: id })
  }

  function replaceTurns(newTurns: Turn[]): void {
    turns.value = newTurns
    rebuildIndex()
  }

  function updateOrCreateTurnSilent(turn: Turn): void {
    const idx = indexMap.get(turn.id)
    if (idx !== undefined) {
      turns.value[idx] = turn
    } else {
      indexMap.set(turn.id, turns.value.length)
      turns.value.push(turn)
    }
  }

  function hasTurn(turnId: string): boolean {
    return indexMap.has(turnId)
  }

  return { id, languages, isSource, audio, turns, addTurn, prependTurns, updateTurn, removeTurn, updateWords, setTurns, replaceTurns, updateOrCreateTurnSilent, hasTurn }
}
