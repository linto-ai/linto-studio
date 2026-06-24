const {
  countSyllabsFromWord,
} = require(`${process.cwd()}/components/EditorHandler/words/countSyllabsFromWord`)
const SyllabicFR = require(`${process.cwd()}/components/EditorHandler/words/syllabic/syllabicFR`)

const syllabicFr = new SyllabicFR("fr-FR")

describe("countSyllabsFromWord", () => {
  test("Count syllabes for french word", () => {
    expect(countSyllabsFromWord("bonjour", syllabicFr)).toBe(2)
  })

  test("Return true number of syllabe for french word known as error", () => {
    expect(countSyllabsFromWord("étymologiste", syllabicFr)).toBe(5)
  })
})
