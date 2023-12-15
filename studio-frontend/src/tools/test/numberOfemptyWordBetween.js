import test from "ava"

import { numberOfemptyWordBetween } from "../numberOfemptyWordBetween.js"

test("compute number of empty words", (t) => {
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

  t.deepEqual(numberOfemptyWordBetween(words, 0, 0), {
    numberOfEmptyWords: 0,
    numberOfSyllabs: 0,
  })
  t.deepEqual(numberOfemptyWordBetween(words, 0, 1), {
    numberOfEmptyWords: 0,
    numberOfSyllabs: 0,
  })
  t.deepEqual(numberOfemptyWordBetween(words, 0, 2), {
    numberOfEmptyWords: 1,
    numberOfSyllabs: 5,
  })
  t.deepEqual(numberOfemptyWordBetween(words, 0, 3), {
    numberOfEmptyWords: 4,
    numberOfSyllabs: 11,
  })
  t.deepEqual(numberOfemptyWordBetween(words, 2, 3), {
    numberOfEmptyWords: 3,
    numberOfSyllabs: 6,
  })
  t.deepEqual(numberOfemptyWordBetween(words, 1, 5), {
    numberOfEmptyWords: 4,
    numberOfSyllabs: 11,
  })
})
