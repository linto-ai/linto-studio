import uuidv4 from "uuid/v4.js"
import { countSyllabsFromWord } from "./countSyllabsFromWord.js"
import { findIndexSplit } from "./findIndexSplit.js"

export function divideTurn(turn, textBefore, textAfter, syllabic) {
  let firstTurnWords = []
  let secondTurnWords = []
  const plainWordsBefore = textBefore.split(" ")
  const plainWordsAfter = textAfter.split(" ")

  const indexTurn = findIndexSplit(
    turn.words.map((w) => w.word),
    textBefore
  )

  if (
    isDividedInAMiddleOfAWord(
      turn.words,
      plainWordsBefore,
      plainWordsAfter,
      indexTurn
    )
  ) {
    const [splitBefore, splitAfter] = splitWord(
      plainWordsBefore[plainWordsBefore.length - 1],
      plainWordsAfter[0],
      turn.words[indexTurn],
      syllabic
    )
    firstTurnWords = [...turn.words.slice(0, indexTurn), splitBefore]
    secondTurnWords = [splitAfter, ...turn.words.slice(indexTurn + 1)]
  } else {
    firstTurnWords = turn.words.slice(0, indexTurn + 1) // maybe can be optimise by using "splice" instead of "slice"
    secondTurnWords = turn.words.slice(indexTurn + 1)
  }

  return [
    {
      ...turn,
      segment: textBefore,
      words: firstTurnWords,
      turn_id: generateID(),
    },
    {
      ...turn,
      segment: textAfter,
      words: secondTurnWords,
      turn_id: generateID(),
    },
  ]
}

function isDividedInAMiddleOfAWord(
  turnWords,
  plainWordsBefore,
  plainWordsAfter,
  index
) {
  return (
    turnWords[index].word ===
    `${plainWordsBefore[plainWordsBefore.length - 1]}${plainWordsAfter[0]}`
  )
}

export function splitWord(plainWordStart, plainWordEnd, turnWord, syllabic) {
  const syllabesStart = plainWordStart
    ? countSyllabsFromWord(plainWordStart, syllabic)
    : 0
  const syllabesEnd = plainWordEnd
    ? countSyllabsFromWord(plainWordEnd, syllabic)
    : 0

  const duration = turnWord.etime - turnWord.stime

  const timeCut =
    turnWord.stime + duration * (syllabesStart / (syllabesStart + syllabesEnd))
  const turnWordStart = {
    ...turnWord,
    etime: simplifyNumber(timeCut),
    word: plainWordStart,
  }

  const turnWordEnd = {
    ...turnWord,
    wid: generateID(),
    stime: simplifyNumber(timeCut),
    word: plainWordEnd,
  }

  return [turnWordStart, turnWordEnd]
}

function simplifyNumber(number) {
  return parseFloat(number.toFixed(2))
}

function generateID() {
  return import.meta.env?.TEST ? "id" : uuidv4()
}
