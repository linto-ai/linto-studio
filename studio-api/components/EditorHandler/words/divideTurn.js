const { v4: uuidv4 } = require("uuid")
const { countSyllabsFromWord } = require("./countSyllabsFromWord")
const { findIndexSplit } = require("./findIndexSplit")

/**
 * Split a turn's words between two segments (textBefore / textAfter).
 * Server-side variant: turn ids are provided by the caller (TipTap preserves
 * the first turn's id and assigns a new uuid to the second on Enter).
 *
 * @param {{ words: Array, segment: string }} turn - original turn
 * @param {string} textBefore
 * @param {string} textAfter
 * @param {object} syllabic - syllabic counter instance
 * @param {string} firstTurnId
 * @param {string} secondTurnId
 * @returns {[object, object]}
 */
function divideTurn(turn, textBefore, textAfter, syllabic, firstTurnId, secondTurnId) {
  let firstTurnWords = []
  let secondTurnWords = []
  const plainWordsBefore = textBefore.split(" ")
  const plainWordsAfter = textAfter.split(" ")

  const indexTurn = findIndexSplit(
    turn.words.map((w) => w.word),
    textBefore,
  )

  if (
    isDividedInAMiddleOfAWord(
      turn.words,
      plainWordsBefore,
      plainWordsAfter,
      indexTurn,
    )
  ) {
    const [splitBefore, splitAfter] = splitWord(
      plainWordsBefore[plainWordsBefore.length - 1],
      plainWordsAfter[0],
      turn.words[indexTurn],
      syllabic,
    )
    firstTurnWords = [...turn.words.slice(0, indexTurn), splitBefore]
    secondTurnWords = [splitAfter, ...turn.words.slice(indexTurn + 1)]
  } else {
    firstTurnWords = turn.words.slice(0, indexTurn + 1)
    secondTurnWords = turn.words.slice(indexTurn + 1)
  }

  const first = {
    ...turn,
    segment: textBefore,
    words: firstTurnWords,
    turn_id: firstTurnId,
  }
  const second = {
    ...turn,
    segment: textAfter,
    words: secondTurnWords,
    turn_id: secondTurnId,
  }
  adjustSplitTimes(first, second)
  return [first, second]
}

/**
 * Live-session turns carry turn-level stime/etime; after a split each half
 * must span only its own words instead of inheriting the full parent span:
 * the first half keeps the parent's start and ends at the cut, the second
 * starts at the cut and keeps the parent's end. The cut is read from the
 * word timestamps (splitWord already places timeCut on both fragments of a
 * mid-word split). Turns without turn-level times are left untouched.
 */
function adjustSplitTimes(first, second) {
  if (first.stime === undefined && first.etime === undefined) return

  const cutEnd = lastWordEtime(first.words)
  const cutStart = firstWordStime(second.words)
  if (cutEnd !== undefined) first.etime = cutEnd
  if (cutStart !== undefined) second.stime = cutStart
}

function lastWordEtime(words) {
  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i].etime !== undefined) return words[i].etime
  }
  return undefined
}

function firstWordStime(words) {
  for (const w of words) {
    if (w.stime !== undefined) return w.stime
  }
  return undefined
}

function isDividedInAMiddleOfAWord(turnWords, plainWordsBefore, plainWordsAfter, index) {
  if (index >= turnWords.length) return false
  return (
    turnWords[index].word ===
    `${plainWordsBefore[plainWordsBefore.length - 1]}${plainWordsAfter[0]}`
  )
}

function splitWord(plainWordStart, plainWordEnd, turnWord, syllabic) {
  const syllabesStart = plainWordStart ? countSyllabsFromWord(plainWordStart, syllabic) : 0
  const syllabesEnd = plainWordEnd ? countSyllabsFromWord(plainWordEnd, syllabic) : 0

  const duration = turnWord.etime - turnWord.stime
  const denom = syllabesStart + syllabesEnd || 1
  const timeCut = turnWord.stime + duration * (syllabesStart / denom)

  const turnWordStart = {
    ...turnWord,
    etime: simplifyNumber(timeCut),
    word: plainWordStart,
  }

  const turnWordEnd = {
    ...turnWord,
    wid: uuidv4(),
    stime: simplifyNumber(timeCut),
    word: plainWordEnd,
  }

  return [turnWordStart, turnWordEnd]
}

function simplifyNumber(number) {
  return parseFloat(number.toFixed(2))
}

module.exports = { divideTurn, splitWord }
