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

  return [
    {
      ...turn,
      segment: textBefore,
      words: firstTurnWords,
      turn_id: firstTurnId,
    },
    {
      ...turn,
      segment: textAfter,
      words: secondTurnWords,
      turn_id: secondTurnId,
    },
  ]
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
