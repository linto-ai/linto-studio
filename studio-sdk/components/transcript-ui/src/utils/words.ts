import type { Word } from "../types/editor"

export function hasWordTimestamps(words: Word[]): boolean {
  return words.length > 0 && words[0]!.startTime !== undefined
}

/**
 * Marge en secondes autour de l'intervalle [startTime, endTime] d'un mot.
 * Évite les "trous" de surlignage pendant les micro-gaps inter-mot
 * (silences, ponctuations). Au-delà de cette marge → aucun mot actif.
 */
const ACTIVE_WORD_MARGIN = 1

/**
 * Renvoie le dernier mot dont l'intervalle [startTime - margin, endTime + margin]
 * contient `time`. Renvoie null si aucun mot n'est à moins de `ACTIVE_WORD_MARGIN`
 * secondes du temps courant.
 */
export function findActiveWord(words: Word[], time: number): string | null {
  if (!hasWordTimestamps(words)) return null

  for (const word of words) {
    if (word.startTime! - ACTIVE_WORD_MARGIN <= time && time <= word.endTime!) {
      return word.id
    }
  }
  return null
}
