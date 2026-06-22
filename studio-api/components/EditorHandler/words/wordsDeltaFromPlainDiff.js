const { v4: uuidv4 } = require("uuid")
const { countSyllabsFromWord } = require("./countSyllabsFromWord")
const { numberOfemptyWordBetween } = require("./numberOfemptyWordBetween")

/**
 * Server-side port of studio-frontend wordsDeltaFromPlainDiffV2.
 * Produces a delta of operations [{retain}, {delete}, {insert}] over the
 * full oldWords array (empty words included), with timestamps redistributed
 * proportionally to syllables across the modified zones.
 *
 * Pure CommonJS, no Yjs dependency.
 */
function wordsDeltafromPlainDiff(newWords, oldWords, plainDiff, syllabic, wordsToSkip = 0) {
  if (plainDiff.length == 0) return []

  const editablePlainDiff = JSON.parse(JSON.stringify(plainDiff))
  const oldWordsWithoutEmpty = oldWords.filter((w) => w.word !== "")
  let currentChange = editablePlainDiff.shift()
  let numberOfRetainAtTheBeginning = 0

  // 1ST step: count words to retain at the beginning
  while (currentChange && !currentChange.added && !currentChange.removed) {
    numberOfRetainAtTheBeginning += currentChange.count
    currentChange = editablePlainDiff.shift()
  }

  if (numberOfRetainAtTheBeginning > wordsToSkip) {
    numberOfRetainAtTheBeginning -= wordsToSkip
  } else {
    numberOfRetainAtTheBeginning = 0
  }

  if (!currentChange) {
    if (numberOfRetainAtTheBeginning) {
      return [{ retain: numberOfRetainAtTheBeginning }]
    }
    return []
  }

  // 2ND step: count syllabs and words to add/delete until next retain
  let numberOfDeletion = 0
  let numberOfAddition = 0
  let numberOfSyllabsDeletable = 0
  let numberOfSyllabsAdded = 0

  while (currentChange && (currentChange.added || currentChange.removed)) {
    if (currentChange.added) {
      numberOfSyllabsAdded += getNumberOfSyllabs(
        newWords,
        numberOfRetainAtTheBeginning + numberOfAddition - 1,
        currentChange.count,
        syllabic,
      )
      numberOfAddition += currentChange.count
    }
    if (currentChange.removed) {
      numberOfSyllabsDeletable += getNumberOfSyllabs(
        oldWordsWithoutEmpty,
        numberOfRetainAtTheBeginning + numberOfDeletion - 1,
        currentChange.count,
        syllabic,
      )
      numberOfDeletion += currentChange.count
    }
    currentChange = editablePlainDiff.shift()
  }
  editablePlainDiff.unshift(currentChange)

  // 3RD step: count empty words
  const {
    numberOfEmptyWords,
    numberOfSyllabs: numberOfSyllabsEmpty,
  } = numberOfemptyWordBetween(
    oldWords,
    numberOfRetainAtTheBeginning - 1,
    numberOfRetainAtTheBeginning + numberOfDeletion,
  )

  const numberOfEmptyWordBeforeLastDeletion = numberOfemptyWordBetween(
    oldWords,
    0,
    numberOfRetainAtTheBeginning + numberOfDeletion - 1,
  ).numberOfEmptyWords

  // 4TH step: compute start/end timestamps of current change
  const previousWordsWithNeededSyllabs = getPreviousWordsWithNeededSyllabs(
    oldWordsWithoutEmpty,
    numberOfRetainAtTheBeginning - 1,
    syllabic,
  )
  const nextWordsWithNeededSyllabs = getNextWordsWithNeededSyllabs(
    oldWordsWithoutEmpty,
    numberOfRetainAtTheBeginning + numberOfDeletion,
    syllabic,
  )

  const startTimestamp = computeStartTimestamp(
    oldWordsWithoutEmpty,
    numberOfRetainAtTheBeginning,
    previousWordsWithNeededSyllabs.words.length,
  )

  const endTimestamp = computeEndTimestamp(
    oldWords,
    numberOfRetainAtTheBeginning,
    numberOfDeletion,
    numberOfEmptyWords +
      numberOfemptyWordBetween(oldWords, 0, numberOfRetainAtTheBeginning - 1)
        .numberOfEmptyWords,
    nextWordsWithNeededSyllabs.words.length,
  )

  // 5TH step: concat retain + delete/insert + recurse
  const retainWithoutEmptyWords =
    numberOfRetainAtTheBeginning - previousWordsWithNeededSyllabs.words.length

  const emptyWordsInRetain = numberOfemptyWordBetween(
    oldWords,
    0,
    retainWithoutEmptyWords - 1,
  )

  return [
    { retain: retainWithoutEmptyWords + emptyWordsInRetain.numberOfEmptyWords },
    ...recomputeTimestamps(
      numberOfDeletion +
        numberOfEmptyWords +
        nextWordsWithNeededSyllabs.words.length +
        previousWordsWithNeededSyllabs.words.length,
      numberOfSyllabsDeletable +
        numberOfSyllabsEmpty +
        previousWordsWithNeededSyllabs.syllabs -
        previousWordsWithNeededSyllabs.neededSyllabs,
      numberOfSyllabsAdded,
      startTimestamp,
      endTimestamp,
      previousWordsWithNeededSyllabs.words.concat(
        newWords.slice(
          numberOfRetainAtTheBeginning,
          numberOfRetainAtTheBeginning + numberOfAddition,
        ),
        nextWordsWithNeededSyllabs.words,
      ),
      syllabic,
    ),
    ...wordsDeltafromPlainDiff(
      newWords.slice(
        numberOfRetainAtTheBeginning +
          numberOfAddition +
          nextWordsWithNeededSyllabs.words.length,
      ),
      oldWords.slice(
        numberOfRetainAtTheBeginning +
          numberOfDeletion +
          numberOfEmptyWordBeforeLastDeletion +
          nextWordsWithNeededSyllabs.words.length,
      ),
      editablePlainDiff,
      syllabic,
      nextWordsWithNeededSyllabs.words.length,
    ),
  ]
}

function computeStartTimestamp(oldWordsWithoutEmpty, numberOfRetainAtTheBeginning, numberOfpreviousMissingSyllabsWords) {
  if (numberOfRetainAtTheBeginning - numberOfpreviousMissingSyllabsWords > 0) {
    return oldWordsWithoutEmpty[
      numberOfRetainAtTheBeginning - numberOfpreviousMissingSyllabsWords - 1
    ].etime
  }
  return oldWordsWithoutEmpty[0].stime
}

function computeEndTimestamp(oldWords, numberOfRetainAtTheBeginning, numberOfDeletion, numberOfEmptyWords, numberOfNextMissingSyllabsWords) {
  if (
    numberOfRetainAtTheBeginning +
      numberOfDeletion +
      numberOfEmptyWords +
      numberOfNextMissingSyllabsWords >
    0
  ) {
    return oldWords[
      numberOfRetainAtTheBeginning +
        numberOfDeletion +
        numberOfEmptyWords +
        numberOfNextMissingSyllabsWords -
        1
    ].etime
  }
  return oldWords[0].stime
}

function recomputeTimestamps(numberOfWordsToRemove, numberOfSyllabsToRemove, numberOfSyllabsAdded, startTimestamp, endTimestamp, wordsToAdd, syllabic) {
  switch (true) {
    case numberOfSyllabsToRemove >= numberOfSyllabsAdded:
      return [
        { delete: numberOfWordsToRemove },
        {
          insert: divideTimestamps(
            startTimestamp,
            endTimestamp,
            wordsToAdd,
            simplifyNumber((endTimestamp - startTimestamp) / numberOfSyllabsToRemove),
            numberOfSyllabsToRemove,
            syllabic,
          ),
        },
      ]
    case numberOfWordsToRemove == 0:
      return [
        {
          insert: wordsToAdd.map((word) => ({
            ...word,
            wid: generateID(),
            stime: endTimestamp,
            etime: endTimestamp,
            neededSyllabs: countSyllabsFromWord(word.word, syllabic),
          })),
        },
      ]
    case numberOfSyllabsToRemove < numberOfSyllabsAdded: {
      const timeForASyllab = simplifyNumber(
        (endTimestamp - startTimestamp) / numberOfSyllabsToRemove,
      )
      return [
        { delete: numberOfWordsToRemove },
        {
          insert: divideTimestamps(
            startTimestamp,
            endTimestamp,
            wordsToAdd,
            timeForASyllab,
            numberOfSyllabsToRemove,
            syllabic,
          ),
        },
      ]
    }
    default:
      return []
  }
}

function divideTimestamps(startTimestamp, endTimestamp, wordsToAdd, timeForASyllab, numberOfSyllabs, syllabic) {
  const insert = []
  let index = 0
  let neededSyllabsForLastWord = 0
  while (numberOfSyllabs > 0 && index < wordsToAdd.length) {
    const word = wordsToAdd[index]
    let currentEndTime

    const numberOfsyllabsInTheWord = countSyllabsFromWord(word.word, syllabic)

    if (numberOfSyllabs >= numberOfsyllabsInTheWord) {
      numberOfSyllabs = numberOfSyllabs - numberOfsyllabsInTheWord
    } else {
      neededSyllabsForLastWord = -1 * (numberOfSyllabs - numberOfsyllabsInTheWord)
      numberOfSyllabs = 0
    }
    if (numberOfSyllabs > 0) {
      currentEndTime = simplifyNumber(
        startTimestamp + simplifyNumber(numberOfsyllabsInTheWord * timeForASyllab),
      )
    } else {
      currentEndTime = endTimestamp
    }

    const res = {
      ...word,
      stime: startTimestamp,
      etime: currentEndTime,
      wid: generateID(),
    }

    delete res.neededSyllabs
    startTimestamp = res.etime
    insert.push(res)
    index++
  }

  if (neededSyllabsForLastWord > 0) {
    insert[insert.length - 1].neededSyllabs = neededSyllabsForLastWord
  }

  if (startTimestamp < endTimestamp) {
    insert.push({
      word: "",
      stime: startTimestamp,
      etime: endTimestamp,
      wid: generateID(),
      syllabs: numberOfSyllabs,
    })
  }

  if (index < wordsToAdd.length) {
    do {
      const word = wordsToAdd[index]
      insert.push({
        ...word,
        stime: endTimestamp,
        etime: endTimestamp,
        wid: generateID(),
        neededSyllabs: countSyllabsFromWord(word.word, syllabic),
      })
      index++
    } while (index < wordsToAdd.length)
  }

  return insert
}

function getNumberOfSyllabs(words, startIndex, numberOfWords, syllabic) {
  let numberOfSyllabs = 0
  for (let index = startIndex; index < startIndex + numberOfWords && index < words.length; index++) {
    const next = words[index + 1]
    if (!next) continue
    if (!(next.neededSyllabs && next.neededSyllabs > 0)) {
      numberOfSyllabs += countSyllabsFromWord(next.word, syllabic)
    } else {
      numberOfSyllabs += countSyllabsFromWord(next.word, syllabic) - next.neededSyllabs
    }
  }
  return numberOfSyllabs
}

function generateID() {
  return process.env.TEST ? "id" : uuidv4()
}

function simplifyNumber(number) {
  return parseFloat(number.toFixed(3))
}

function getPreviousWordsWithNeededSyllabs(words, index, syllabic) {
  const previousWords = []
  let numberOfSyllabs = 0
  let numberOfNeededSyllabs = 0
  let i = index
  while (i >= 0 && numberOfSyllabs < 1 && words[i] && words[i].neededSyllabs > 0) {
    const word = words[i]
    numberOfSyllabs += countSyllabsFromWord(word.word, syllabic)
    numberOfNeededSyllabs += word.neededSyllabs
    previousWords.unshift(word)
    i--
  }
  return {
    words: previousWords,
    syllabs: numberOfSyllabs,
    neededSyllabs: numberOfNeededSyllabs,
  }
}

function getNextWordsWithNeededSyllabs(words, index, syllabic) {
  const nextWords = []
  let numberOfSyllabs = 0
  let i = index < 0 ? 0 : index
  while (i < words.length && numberOfSyllabs < 1 && words[i] && words[i].neededSyllabs > 0) {
    const word = words[i]
    numberOfSyllabs += countSyllabsFromWord(word.word, syllabic)
    nextWords.push(word)
    i++
  }
  return { words: nextWords, syllabs: numberOfSyllabs }
}

module.exports = { wordsDeltafromPlainDiff }
