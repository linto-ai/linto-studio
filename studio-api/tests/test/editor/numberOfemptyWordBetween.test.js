const {
  numberOfemptyWordBetween,
} = require(`${process.cwd()}/components/EditorHandler/words/numberOfemptyWordBetween`)

describe("numberOfemptyWordBetween", () => {
  test("compute number of empty words", () => {
    const words = [
      {
        stime: 0.72,
        etime: 1.56,
        word: "Bonjour",
      },
      {
        stime: 1.56,
        etime: 1.67,
        word: "à",
      },
      {
        stime: 1.67,
        etime: 1.67,
        word: "",
        syllabs: 5,
      },
      {
        stime: 1.67,
        etime: 1.77,
        word: "ses",
      },
      {
        stime: 1.77,
        etime: 1.77,
        word: "",
      },
      {
        stime: 1.77,
        etime: 1.77,
        word: "",
      },
      {
        stime: 1.77,
        etime: 1.77,
        word: "",
      },
      {
        stime: 1.77,
        etime: 2.19,
        word: "amis",
      },
    ]

    expect(numberOfemptyWordBetween(words, 0, 0)).toEqual({
      numberOfEmptyWords: 0,
      numberOfSyllabs: 0,
    })
    expect(numberOfemptyWordBetween(words, 0, 1)).toEqual({
      numberOfEmptyWords: 0,
      numberOfSyllabs: 0,
    })
    expect(numberOfemptyWordBetween(words, 0, 2)).toEqual({
      numberOfEmptyWords: 1,
      numberOfSyllabs: 5,
    })
    expect(numberOfemptyWordBetween(words, 0, 3)).toEqual({
      numberOfEmptyWords: 4,
      numberOfSyllabs: 11,
    })
    expect(numberOfemptyWordBetween(words, 2, 3)).toEqual({
      numberOfEmptyWords: 3,
      numberOfSyllabs: 6,
    })
    expect(numberOfemptyWordBetween(words, 1, 5)).toEqual({
      numberOfEmptyWords: 4,
      numberOfSyllabs: 11,
    })
  })
})
