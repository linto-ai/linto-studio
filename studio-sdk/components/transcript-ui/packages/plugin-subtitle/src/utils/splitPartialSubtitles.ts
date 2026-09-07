import { diffArrays } from "diff"

interface SubtitleState {
  previousText: string
  previousIndexes: number[]
}

interface DiffEntry {
  value: string[]
  added?: boolean
  removed?: boolean
  count: number
}

interface ReplacementEntry {
  replaced: true
  removed: boolean
  added: boolean
  countRemoved: number
  countAdded: number
}

type DiffWithReplacements = (DiffEntry | ReplacementEntry)[]

export default function splitPartialSubtitles(
  { previousText, previousIndexes: oldCutPositions }: SubtitleState,
  newText: string,
  computeIfTextIsTooLong: (text: string) => boolean,
  computeIfTextOverflows?: (text: string) => boolean,
): SubtitleState {
  if (!newText) {
    return { previousText, previousIndexes: oldCutPositions }
  }

  const previousTextSplitBySpace = previousText.split(" ")
  const newTextSplitBySpace = newText.split(" ")
  const diffList = diffArrays(previousTextSplitBySpace, newTextSplitBySpace, {
    comparator: isSameWord,
  })

  const diffListWithReplacements = detectReplacements(diffList)

  const copyCutPositions = [...oldCutPositions]
  let newCutPositions = [...oldCutPositions]

  let wordIndex = 0
  for (const diff of diffListWithReplacements) {
    do {
      if (wordIndex < copyCutPositions[0]!) break
    } while (copyCutPositions.shift() !== undefined)

    if (copyCutPositions.length === 0) break

    if ("replaced" in diff && diff.replaced) {
      newCutPositions = incrementIndexes(
        newCutPositions,
        copyCutPositions[0]!,
        diff.countAdded - diff.countRemoved,
      )
      wordIndex += diff.countRemoved
    } else if ("removed" in diff && diff.removed) {
      const d = diff as DiffEntry
      wordIndex += d.count
      newCutPositions = incrementIndexes(
        newCutPositions,
        copyCutPositions[0]!,
        -d.count,
      )
    } else if ("added" in diff && diff.added) {
      const d = diff as DiffEntry
      newCutPositions = incrementIndexes(
        newCutPositions,
        copyCutPositions[0]!,
        d.count,
      )
    } else {
      const d = diff as DiffEntry
      wordIndex += d.count
    }
  }

  // The scroller only ever displays the last two lines, so we only keep those
  // two inside the canvas.
  const lineText = (from: number, to?: number): string =>
    newTextSplitBySpace.slice(from, to).join(" ")

  // Step 1 — keep the second-to-last (first visible) line inside the canvas. If a
  // widened word pushed it off the edge, move the last cut earlier so the
  // overflowing tail flows down into the last line; the head stays in place. We
  // trigger on the overflow threshold but cut at the normal one, leaving a margin
  // before it can overflow again (hysteresis, avoids re-cutting on every partial).
  if (computeIfTextOverflows && newCutPositions.length > 0) {
    const lastIndex = newCutPositions.length - 1
    const lineStart = lastIndex > 0 ? newCutPositions[lastIndex - 1]! : 0
    const secondToLastLine = lineText(lineStart, newCutPositions[lastIndex]!)

    if (computeIfTextOverflows(secondToLastLine)) {
      const [headCut] = getIndexesWhereToCutText(
        secondToLastLine,
        computeIfTextIsTooLong,
      )
      // headCut is undefined for a single unsplittable word: leave it as is.
      if (headCut !== undefined) newCutPositions[lastIndex] = lineStart + headCut
    }
  }

  // Step 2 — cut the last line if it is too long, including the words step 1 may
  // have just pushed down. This is the normal live-growth cut.
  const lastLineStart =
    newCutPositions.length > 0 ? newCutPositions[newCutPositions.length - 1]! : 0
  const lastLine = lineText(lastLineStart)
  if (computeIfTextIsTooLong(lastLine)) {
    const cuts = getIndexesWhereToCutText(lastLine, computeIfTextIsTooLong)
    newCutPositions = newCutPositions.concat(cuts.map((i) => i + lastLineStart))
  }

  return {
    previousIndexes: newCutPositions,
    previousText: newText,
  }
}

function detectReplacements(diffList: DiffEntry[]): DiffWithReplacements {
  const result: DiffWithReplacements = []

  for (let i = 0; i < diffList.length; i++) {
    const currentDiff = diffList[i]!
    const nextDiff = diffList[i + 1]

    // A replacement is a removed block immediately followed by an added one.
    const isReplacement = currentDiff.removed && nextDiff?.added

    if (isReplacement) {
      result.push({
        replaced: true,
        removed: true,
        added: true,
        countRemoved: currentDiff.count,
        countAdded: nextDiff!.count,
      })
      i++ // skip the added block, already merged into this replacement
    } else {
      result.push(currentDiff)
    }
  }

  return result
}

function incrementIndexes(indexes: number[], from: number, increment: number): number[] {
  return indexes.map((index) => (index >= from ? index + increment : index))
}

export function getIndexesWhereToCutText(
  text: string,
  computeIfTextIsTooLong: (text: string) => boolean,
): number[] {
  const splitText = text.split(" ")
  if (!computeIfTextIsTooLong(text) || splitText.length <= 1) {
    return []
  }

  let i: number
  for (i = 0; i < splitText.length; i++) {
    const currentText = splitText.slice(0, i).join(" ")
    if (computeIfTextIsTooLong(currentText)) break
  }

  return [i - 1].concat(
    incrementIndexes(
      getIndexesWhereToCutText(
        splitText.slice(i - 1).join(" "),
        computeIfTextIsTooLong,
      ),
      0,
      i - 1,
    ),
  )
}

function isSameWord(word1: string, word2: string): boolean {
  const w1Normalized = word1
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
  const w2Normalized = word2
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")

  const shortestLength = Math.min(w1Normalized.length, w2Normalized.length)

  let numberOfSameChars = 0
  for (let i = 0; i < shortestLength; i++) {
    if (w1Normalized[i] === w2Normalized[i]) numberOfSameChars++
  }

  const similarity = numberOfSameChars / w1Normalized.length
  return similarity > 0.8
}
