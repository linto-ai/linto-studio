import { layoutWords } from "./layoutWords"
import type { Word } from "../../types/editor"
import type { ApiWord } from "../../types/api"

/** Build the word list from an API turn payload (see layoutWords). */
export function wordsFromApi(turnId: string, apiWords: ApiWord[]): Word[] {
  return layoutWords(
    turnId,
    apiWords.map((w) => ({
      text: w.word ?? "",
      ...(w.stime !== undefined && { startTime: w.stime }),
      ...(w.etime !== undefined && { endTime: w.etime }),
      ...(w.confidence !== undefined && { confidence: w.confidence }),
    })),
  )
}
