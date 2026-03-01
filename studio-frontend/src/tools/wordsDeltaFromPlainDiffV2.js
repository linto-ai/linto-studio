import uuidv4 from "uuid/v4.js"

import { countSyllabsFromWord } from "./countSyllabsFromWord.js"
import { numberOfemptyWordBetween } from "./numberOfemptyWordBetween.js"

export function wordsDeltafromPlainDiff(
  newWords,
  oldWords,
  plainDiff,
  syllabic,
  wordsToSkip = 0
) {
  if (plainDiff.length == 0) {
    return []
  }
  const editablePlainDiff = JSON.parse(JSON.stringify(plainDiff)) // deep copy so we don't modify the original
  const oldWordsWithoutEmpty = oldWords.filter((w) => w.word !== "")
  let currentChange = editablePlainDiff.shift()
  let numberOfRetainAtTheBeginning = 0

  // -------------------------------------------------------------
  // 1ST step: we count number of words to retain at the beginning
  // -------------------------------------------------------------

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
    if (numberOfRetainAtTheBeginning)
      return [
        {
          retain: numberOfRetainAtTheBeginning,
        },
      ]
    else return []
  }

  // ------------------------------------------------------------------------------------------------------------------------------
  // 2ND step: we count the number of syllabs and number of words we will delete and the number of syllabs and words we need to add
  //           we count until the next retain (computation after retain  will be done recursively (step 5))
  // ------------------------------------------------------------------------------------------------------------------------------
  // We are working without empty words (oldWordsWithoutEmpty)

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
        syllabic
      )
      numberOfAddition += currentChange.count
    }
    if (currentChange.removed) {
      numberOfSyllabsDeletable += getNumberOfSyllabs(
        oldWordsWithoutEmpty,
        numberOfRetainAtTheBeginning + numberOfDeletion - 1, // + empty words
        currentChange.count,
        syllabic
      )
      numberOfDeletion += currentChange.count
    }

    currentChange = editablePlainDiff.shift()
  }
  editablePlainDiff.unshift(currentChange)

  // -------------------------------------
  // 3RD step: We count empty words
  // -------------------------------------

  // Empty words between the end of last retain and the begin of next retain
  const {
    numberOfEmptyWords: numberOfEmptyWords,
    numberOfSyllabs: numberOfSyllabsEmpty,
  } = numberOfemptyWordBetween(
    oldWords,
    numberOfRetainAtTheBeginning - 1,
    numberOfRetainAtTheBeginning + numberOfDeletion // we don't remove one because we want to count also empty words after the deletion
  )

  // empty words from the beginning of the text to the last deletion
  const numberOfEmptyWordBeforeLastDeletion = numberOfemptyWordBetween(
    oldWords,
    0,
    numberOfRetainAtTheBeginning + numberOfDeletion - 1
  ).numberOfEmptyWords

  // -----------------------------------------------------------------------
  // 4TH step: We compute the start and end timestamps of the current change
  // -----------------------------------------------------------------------

  // get words with needed syllabs before and after the current change

  const previousWordsWithNeededSyllabs = getPreviousWordsWithNeededSyllabs(
    oldWordsWithoutEmpty,
    numberOfRetainAtTheBeginning - 1,
    syllabic
  )
  const nextWordsWithNeededSyllabs = getNextWordsWithNeededSyllabs(
    oldWordsWithoutEmpty,
    numberOfRetainAtTheBeginning + numberOfDeletion,
    syllabic
  )

  let startTimestamp = computeStartTimestamp(
    oldWordsWithoutEmpty,
    numberOfRetainAtTheBeginning,
    previousWordsWithNeededSyllabs.words.length
  )

  let endTimestamp = computeEndTimestamp(
    oldWords,
    numberOfRetainAtTheBeginning,
    numberOfDeletion,
    numberOfEmptyWords +
      numberOfemptyWordBetween(oldWords, 0, numberOfRetainAtTheBeginning - 1)
        .numberOfEmptyWords,
    nextWordsWithNeededSyllabs.words.length
  )

  // TODO: we need to be careful if there is music so currentChange.stime is not the same as changeBefore.etime, maybe stop the loop before. And redo the same after the music.

  /*
  5TH step: We concatenate 3 arrays: 
    - the first one is the retain, 
    - the second one is delete and insert for the current change with the new timestamps
    - the third one is the rest of the diff
  */
  const retainWithoutEmptyWords =
    numberOfRetainAtTheBeginning - previousWordsWithNeededSyllabs.words.length

  const emptyWordsInRetain = numberOfemptyWordBetween(
    oldWords,
    0,
    retainWithoutEmptyWords - 1
  )

  return [
    {
      retain: retainWithoutEmptyWords + emptyWordsInRetain.numberOfEmptyWords,
    },
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
          numberOfRetainAtTheBeginning + numberOfAddition
        ),
        nextWordsWithNeededSyllabs.words
      ),
      syllabic
    ),
    ...wordsDeltafromPlainDiff(
      newWords.slice(
        numberOfRetainAtTheBeginning +
          numberOfAddition +
          nextWordsWithNeededSyllabs.words.length
      ),
      oldWords.slice(
        numberOfRetainAtTheBeginning +
          numberOfDeletion +
          numberOfEmptyWordBeforeLastDeletion +
          nextWordsWithNeededSyllabs.words.length
      ),
      editablePlainDiff,
      syllabic,
      nextWordsWithNeededSyllabs.words.length // these words are already in the diff so we need to skip them
    ),
  ]
}

function computeStartTimestamp(
  oldWordsWithoutEmpty,
  numberOfRetainAtTheBeginning,
  numberOfpreviousMissingSyllabsWords
) {
  if (numberOfRetainAtTheBeginning - numberOfpreviousMissingSyllabsWords > 0) {
    return oldWordsWithoutEmpty[
      numberOfRetainAtTheBeginning - numberOfpreviousMissingSyllabsWords - 1
    ].etime
  } else {
    return oldWordsWithoutEmpty[0].stime
  }
}

function computeEndTimestamp(
  oldWords,
  numberOfRetainAtTheBeginning,
  numberOfDeletion,
  numberOfEmptyWords,
  numberOfNextMissingSyllabsWords
) {
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

function recomputeTimestamps(
  numberOfWordsToRemove,
  numberOfSyllabsToRemove,
  numberOfSyllabsAdded,
  startTimestamp,
  endTimestamp,
  wordsToAdd,
  syllabic
) {
  // Pour l'instant on va mettre pas de timestamp pour les mots qui tiennent pas,
  // une autre solution serait de diviser avec les mots autour, en retenant le timestamp "original" des mots qu'on réduit

  switch (true) {
    case numberOfSyllabsToRemove >= numberOfSyllabsAdded:
      return [
        {
          delete: numberOfWordsToRemove,
        },
        {
          insert: divideTimestamps(
            startTimestamp,
            endTimestamp,
            wordsToAdd,
            simplifyNumber(
              (endTimestamp - startTimestamp) / numberOfSyllabsToRemove
            ),
            numberOfSyllabsToRemove,
            syllabic
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
    case numberOfSyllabsToRemove < numberOfSyllabsAdded:
      let timeForASyllab = simplifyNumber(
        (endTimestamp - startTimestamp) / numberOfSyllabsToRemove
      )
      return [
        {
          delete: numberOfWordsToRemove,
        },
        {
          insert: divideTimestamps(
            startTimestamp,
            endTimestamp,
            wordsToAdd,
            timeForASyllab,
            numberOfSyllabsToRemove,
            syllabic
          ),
        },
      ]
    default:
      return []
      break
  }
}

function divideTimestamps(
  startTimestamp,
  endTimestamp,
  wordsToAdd,
  timeForASyllab,
  numberOfSyllabs,
  syllabic
) {
  let insert = []
  let index = 0
  let neededSyllabsForLastWord = 0
  while (numberOfSyllabs > 0 && index < wordsToAdd.length) {
    let word = wordsToAdd[index]
    let currentEndTime

    let numberOfsyllabsInTheWord = countSyllabsFromWord(word.word, syllabic)

    if (numberOfSyllabs >= numberOfsyllabsInTheWord) {
      numberOfSyllabs = numberOfSyllabs - numberOfsyllabsInTheWord
    } else {
      neededSyllabsForLastWord =
        -1 * (numberOfSyllabs - numberOfsyllabsInTheWord)
      numberOfSyllabs = 0
    }
    if (numberOfSyllabs > 0) {
      currentEndTime = simplifyNumber(
        startTimestamp +
          simplifyNumber(numberOfsyllabsInTheWord * timeForASyllab)
      )
    } else {
      currentEndTime = endTimestamp
    }

    let res = {
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
      let word = wordsToAdd[index]
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
  for (
    let index = startIndex;
    index < startIndex + numberOfWords && index < words.length;
    index++
  ) {
    if (
      !(words[index + 1].neededSyllabs && words[index + 1].neededSyllabs > 0)
    ) {
      numberOfSyllabs += countSyllabsFromWord(words[index + 1].word, syllabic)
    } else {
      numberOfSyllabs +=
        countSyllabsFromWord(words[index + 1].word, syllabic) -
        words[index + 1].neededSyllabs
    }
  }
  return numberOfSyllabs
}

function generateID() {
  return (typeof process !== "undefined" && process.env && process.env["TEST"]) ? "id" : uuidv4()
}

function simplifyNumber(number) {
  return parseFloat(number.toFixed(3))
}

function getPreviousWordsWithNeededSyllabs(words, index, syllabic) {
  let previousWords = []
  let numberOfSyllabs = 0
  let numberOfNeededSyllabs = 0
  let i = index
  while (i >= 0 && numberOfSyllabs < 1 && words[i].neededSyllabs > 0) {
    let word = words[i]
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
  let nextWords = []
  let numberOfSyllabs = 0
  let i = index < 0 ? 0 : index
  while (
    i < words.length &&
    numberOfSyllabs < 1 &&
    words[i].neededSyllabs > 0
  ) {
    let word = words[i]
    numberOfSyllabs += countSyllabsFromWord(word.word, syllabic)
    nextWords.push(word)
    i++
  }
  return { words: nextWords, syllabs: numberOfSyllabs }
}
