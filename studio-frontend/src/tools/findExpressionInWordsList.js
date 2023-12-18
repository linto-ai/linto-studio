// return multiple range containing start and end index of each expression in wordsList
// expression: string list of expression (can contain multiple words)
// wordsList: array of string without space
// return: array of object containing start and end index of each expression in wordsList
export default function findExpressionInWordsList(
  expressionsList,
  wordsList,
  expressionToString,
  wordToString
) {
  if (!wordToString) {
    wordToString = (word) => word
  }

  if (!expressionToString) {
    expressionToString = (expression) => expression
  }
  let rangesList = []
  let counterInExpressions = expressionsList.map(() => 0)
  let indexOfWordStartingWithExpression = expressionsList.map(() => -1) // -1 means not found
  for (let i = 0; i < wordsList.length; i++) {
    let word = wordToString(wordsList[i])
    for (let j = 0; j < expressionsList.length; j++) {
      let expression = expressionToString(expressionsList[j])
      let expressionWords = expression.split(" ")
      if (compareWithoutPunctuation(word, expression)) {
        rangesList.push({ start: i, end: i, expression: expression })
        continue
      } else if (
        compareWithoutPunctuation(
          word,
          expressionWords[counterInExpressions[j]]
        )
      ) {
        if (indexOfWordStartingWithExpression[j] === -1) {
          indexOfWordStartingWithExpression[j] = i
        }
        counterInExpressions[j]++
        if (counterInExpressions[j] === expressionWords.length) {
          rangesList.push({
            start: indexOfWordStartingWithExpression[j],
            end: i,
            expression: expression,
          })
          counterInExpressions[j] = 0
          indexOfWordStartingWithExpression[j] = -1
        }
      } else if (compareWithoutPunctuation(word, expressionWords[0])) {
        indexOfWordStartingWithExpression[j] = i
        counterInExpressions[j] = 1
      } else {
        counterInExpressions[j] = 0
        indexOfWordStartingWithExpression[j] = -1
      }
    }
  }

  return rangesList
}

function compareWithoutPunctuation(str1, str2) {
  return (
    str1
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .trim()
      .toLowerCase()
      .replace("l'", "") ===
    str2
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .trim()
      .toLowerCase()
      .replace("l'", "")
  )
}
