import Syllabic from "../syllabicFR.js"
import dict from "../dict/fr-FR.json" assert { type: "json" }

// Test this on french dictionnary see //http://www.lexique.org/

async function test() {
  const syllabic = await new Syllabic()

  const erroredWords = []
  const perfectWords = []
  for (let i = 0; i < dict.length; i++) {
    //print percentage of progress every 10000 words
    if (i % 10000 === 0) {
      console.log(`${Math.round((i / dict.length) * 100)}%`)
    }
    let word = dict[i][0]
    const realCount = parseInt(dict[i][1])
    // Accuracy test
    const count = syllabic.count(word)
    if (count !== realCount) {
      erroredWords.push(new Array(word, realCount, count))
    } else {
      perfectWords.push(new Array(word, realCount, count))
    }
  }

  //dumps errored words to a file
  //fs.writeFileSync(`./dict/${syllabic.language}-errored.json`, JSON.stringify(erroredWords))
  //print standard deviation between real and computed count for errored words
  console.log("Algorithm performances", "\n", "-------------------")
  console.log(erroredWords.length, "words with errors")
  console.log(perfectWords.length, "perfect words")
  console.log(dict.length, "words analyzed")
  const accuracy = ((dict.length - erroredWords.length) / dict.length) * 100
  console.log(`${accuracy}% of words are perfect matches`)

  const deviations = erroredWords.map((word) => Math.abs(word[1] - word[2]))
  const deviationsCalc = Math.sqrt(
    deviations.reduce((a, b) => a + b * b, 0) / deviations.length
  )
  console.log(`Standard deviation for errored words: ${deviationsCalc}`)
  //print average between real and computed count for errored words
  console.log(
    `Average error for errored words: ${
      deviations.reduce((a, b) => a + b, 0) / deviations.length
    }`
  )
  //global accuracy
  const allWords = erroredWords.concat(perfectWords)
  const globalDeviations = allWords.map((word) => Math.abs(word[1] - word[2]))
  const globalDeviationsCalc = Math.sqrt(
    globalDeviations.reduce((a, b) => a + b * b, 0) / globalDeviations.length
  )
  console.log(`Standard deviation for a given word: ${globalDeviationsCalc}`)
  console.log(
    `Average error for a given word: ${
      globalDeviations.reduce((a, b) => a + b, 0) / globalDeviations.length
    }`
  )
  //Top errored words
  console.log("Top errored words", "\n", "-------------------")
  //print errored words with errors count
  let topErroredWords
  for (let i = 1; i < 10; i++) {
    topErroredWords = erroredWords.filter(
      (word) => Math.abs(word[2] - word[1]) == i
    )
    console.log(topErroredWords.length, `words with errors == ${i}`)
  }
}
