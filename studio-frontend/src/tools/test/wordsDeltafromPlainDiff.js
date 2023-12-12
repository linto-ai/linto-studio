import test from "ava"
import util from "util"

import { wordsDeltafromPlainDiff } from "../wordsDeltaFromPlainDiffV2.js"
import myers from "myers-diff"
import SyllabicFR from "../../../public/js/syllabic/syllabicFR.js"
import { diffWords, diffArrays } from "diff"
const syllabicFr = new SyllabicFR("fr-FR")

function diffFunction(newText, words, syllabic = syllabicFr) {
  const splitText = newText.split(" ").map((word) => ({ word: word.trim() }))
  const diff = diffArrays(
    words.filter((w) => w.word !== ""),
    splitText,
    {
      comparator: (a, b) => a.word === b.word,
    }
  )

  return wordsDeltafromPlainDiff(splitText, words, diff, syllabic)
}

test("Keep same sentence", (t) => {
  const oldText = "Bonjour les amis"
  const newText = "Bonjour les amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.77,
      word: "les",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 3,
    },
  ])
})

test("Change one word on middle", (t) => {
  const oldText = "Bonjour les amis"
  const newText = "Bonjour mes amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.77,
      word: "les",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.77,
          word: "mes",
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Divide a word", (t) => {
  const oldText = "Bonjour vayants amis"
  const newText = "Bonjour va yen amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.77,
      word: "vayants",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.665,
          word: "va",
          wid: "id",
        },
        {
          stime: 1.665,
          etime: 1.77,
          word: "yen",
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Merge a word", (t) => {
  const oldText = "Bonjour va yen amis"
  const newText = "Bonjour vayants amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.67,
      word: "va",
      wid: "id",
    },
    {
      stime: 1.67,
      etime: 1.77,
      word: "yen",
      wid: "id",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 2,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.77,
          word: "vayants",
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Replace an empty word with a new one", (t) => {
  const oldText = "Bonjour amis"
  const newText = "Bonjour mes amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.77,
      word: "",
      syllabs: 1,
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.77,
          word: "mes",
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Change one word on middle on a turn containing empty words", (t) => {
  const oldText = "Bonjour les amis"
  const newText = "Bonjour mes amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.66,
      word: "",
      syllabs: 1,
    },
    {
      stime: 1.66,
      etime: 1.77,
      word: "les",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 2,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.665,
          word: "mes",
          wid: "id",
        },
        {
          stime: 1.665,
          etime: 1.77,
          word: "",
          syllabs: 1,
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Delete one word on middle and add two", (t) => {
  const oldText = "Bonjour les amis"
  const newText = "Bonjour à ses amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.77,
      word: "les",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.77,
          word: "à",
          wid: "id",
        },
        {
          stime: 1.77,
          etime: 1.77,
          word: "ses",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Delete a word with one syllabs and replace with a word of two syllabs", (t) => {
  const oldText = "Bonjour les amis"
  const newText = "Bonjour supers amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.77,
      word: "les",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.77,
          word: "supers",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Delete two word on middle and add one", (t) => {
  const oldText = "Bonjour à ses amis"
  const newText = "Bonjour cher amis"
  const plainDiff = myers.diff(oldText, newText, {
    compare: "words",
  })

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
      etime: 1.77,
      word: "ses",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 2,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.665,
          word: "cher",
          wid: "id",
        },
        {
          word: "",
          stime: 1.665,
          etime: 1.77,
          syllabs: 1,
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Delete two word on middle", (t) => {
  const oldText = "Bonjour à ses amis"
  const newText = "Bonjour amis"

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
      etime: 1.77,
      word: "ses",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      delete: 2,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.77,
          word: "",
          syllabs: 2,
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("add one word on middle", (t) => {
  const oldText = "Bonjour à ses amis"
  const newText = "Bonjour aussi à ses amis"
  const plainDiff = myers.diff(oldText, newText, {
    compare: "words",
  })

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
      etime: 1.77,
      word: "ses",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.56,
          word: "aussi",
          wid: "id",
          neededSyllabs: 2,
        },
      ],
    },
    {
      retain: 3,
    },
  ])
})

test("add one word on middle two time", (t) => {
  const oldText = "Bonjour à ses amis"
  const newText = "Bonjour aussi à ses autres amis"

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
      etime: 1.77,
      word: "ses",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.56,
          word: "aussi",
          wid: "id",
          neededSyllabs: 2,
        },
      ],
    },
    {
      retain: 2,
    },
    {
      insert: [
        {
          stime: 1.77,
          etime: 1.77,
          word: "autres",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("add one word at end", (t) => {
  const oldText = "Bonjour à ses amis"
  const newText = "Bonjour à ses amis là"
  const plainDiff = myers.diff(oldText, newText, {
    compare: "words",
  })

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
      etime: 1.77,
      word: "ses",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 4,
    },
    {
      insert: [
        {
          stime: 2.19,
          etime: 2.19,
          word: "là",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
  ])
})

test("add one word at start", (t) => {
  const oldText = "Bonjour à ses amis"
  const newText = "hey, Bonjour à ses amis"

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
      etime: 1.77,
      word: "ses",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      insert: [
        {
          stime: 0.72,
          etime: 0.72,
          word: "hey,",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
    {
      retain: 4,
    },
  ])
})

test("Delete last word", (t) => {
  const oldText = "Bonjour les amis"
  const newText = "Bonjour les"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.77,
      word: "les",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 2,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 1.77,
          etime: 2.19,
          word: "",
          syllabs: 2,
          wid: "id",
        },
      ],
    },
  ])
})

test("add multiple words, at start, middle and end", (t) => {
  const oldText = "Bonjour à ses amis"
  const newText = "hey dis Bonjour aussi à ses autres amis là bas"

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
      etime: 1.77,
      word: "ses",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      insert: [
        {
          stime: 0.72,
          etime: 0.72,
          word: "hey",
          wid: "id",
          neededSyllabs: 1,
        },
        {
          stime: 0.72,
          etime: 0.72,
          word: "dis",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
    {
      retain: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.56,
          word: "aussi",
          wid: "id",
          neededSyllabs: 2,
        },
      ],
    },
    {
      retain: 2,
    },
    {
      insert: [
        {
          stime: 1.77,
          etime: 1.77,
          word: "autres",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
    {
      retain: 1,
    },
    {
      insert: [
        {
          stime: 2.19,
          etime: 2.19,
          word: "là",
          wid: "id",
          neededSyllabs: 1,
        },
        {
          stime: 2.19,
          etime: 2.19,
          word: "bas",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
  ])
})

test("Change all words", (t) => {
  const oldText = "Bonjour à ses amis"
  const newText = "La lune est belle ce soir"

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
      etime: 1.77,
      word: "ses",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      delete: 4,
    },
    {
      insert: [
        {
          stime: 0.72,
          etime: 0.965,
          word: "La",
          wid: "id",
        },
        {
          stime: 0.965,
          etime: 1.21,
          word: "lune",
          wid: "id",
        },
        {
          stime: 1.21,
          etime: 1.455,
          word: "est",
          wid: "id",
        },
        {
          stime: 1.455,
          etime: 1.7,
          word: "belle",
          wid: "id",
        },
        {
          stime: 1.7,
          etime: 1.945,
          word: "ce",
          wid: "id",
        },
        {
          stime: 1.945,
          etime: 2.19,
          word: "soir",
          wid: "id",
        },
      ],
    },
  ])
})

test("Remove a punctuation", (t) => {
  const oldText = "Bonjour à , amis"
  const newText = "Bonjour à amis"
  const plainDiff = myers.diff(oldText, newText, {
    compare: "words",
  })

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
      etime: 1.77,
      word: ",",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 2,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 1.67,
          etime: 1.77,
          wid: "id",
          word: "",
          syllabs: 1,
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("expand word before deletion", (t) => {
  const oldText = "Hey Bonjour les amis"
  const newText = "Hey les amis"

  const words = [
    {
      stime: 0.72,
      etime: 0.72,
      word: "Hey",
      neededSyllabs: 1,
    },
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.67,
      word: "les",
    },
    {
      stime: 1.67,
      etime: 1.87,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      delete: 2,
    },
    {
      insert: [
        {
          stime: 0.72,
          etime: 1.14,
          word: "Hey",
          wid: "id",
        },
        {
          stime: 1.14,
          etime: 1.56,
          word: "",
          wid: "id",
          syllabs: 1,
        },
      ],
    },
    {
      retain: 2,
    },
  ])
})

test("expand word after deletion", (t) => {
  const oldText = "Bonjour Hey les amis"
  const newText = "Hey les amis"

  const words = [
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.56,
      word: "Hey",
      neededSyllabs: 1,
    },
    {
      stime: 1.56,
      etime: 1.67,
      word: "les",
    },
    {
      stime: 1.67,
      etime: 1.87,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      delete: 2,
    },
    {
      insert: [
        {
          stime: 0.72,
          etime: 1.14,
          word: "Hey",
          wid: "id",
        },
        {
          stime: 1.14,
          etime: 1.56,
          word: "",
          wid: "id",
          syllabs: 1,
        },
      ],
    },
    {
      retain: 2,
    },
  ])
})

test("expand word without deletion", (t) => {
  const oldText = "Hey les amis"
  const newText = "Hey salut les amis"

  const words = [
    {
      stime: 0.72,
      etime: 0.72,
      word: "Hey",
      neededSyllabs: 1,
    },
    {
      stime: 0.72,
      etime: 1.56,
      word: "les",
    },
    {
      stime: 1.56,
      etime: 1.87,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 0.72,
          etime: 0.72,
          word: "Hey",
          wid: "id",
          neededSyllabs: 1,
        },
        {
          stime: 0.72,
          etime: 0.72,
          word: "salut",
          wid: "id",
          neededSyllabs: 2,
        },
      ],
    },
    {
      retain: 2,
    },
  ])
})

test("Edit word with needed syllab and add a word", (t) => {
  const oldText = "Hey les amis"
  const newText = "Yo salut les amis"

  const words = [
    {
      stime: 0.72,
      etime: 0.72,
      word: "Hey",
      neededSyllabs: 1,
    },
    {
      stime: 0.72,
      etime: 1.56,
      word: "les",
    },
    {
      stime: 1.56,
      etime: 1.87,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 0.72,
          etime: 0.72,
          word: "Yo",
          wid: "id",
          neededSyllabs: 1,
        },
        {
          stime: 0.72,
          etime: 0.72,
          word: "salut",
          wid: "id",
          neededSyllabs: 2,
        },
      ],
    },
    {
      retain: 2,
    },
  ])
})

test("Edit word with needed syllab by longer one", (t) => {
  const oldText = "Hey les amis"
  const newText = "Bonjour salut les amis"

  const words = [
    {
      stime: 0.72,
      etime: 0.72,
      word: "Hey",
      neededSyllabs: 1,
    },
    {
      stime: 0.72,
      etime: 1.56,
      word: "les",
    },
    {
      stime: 1.56,
      etime: 1.87,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 0.72,
          etime: 0.72,
          word: "Bonjour",
          wid: "id",
          neededSyllabs: 2,
        },
        {
          stime: 0.72,
          etime: 0.72,
          word: "salut",
          wid: "id",
          neededSyllabs: 2,
        },
      ],
    },
    {
      retain: 2,
    },
  ])
})

test("Change one word on middle when there is empty words before", (t) => {
  const oldText = "Allo, Bonjour les amis"
  const newText = "Allo, Bonjour mes amis"

  const words = [
    {
      stime: 0.1,
      etime: 0.5,
      word: "Allo,",
    },
    {
      stime: 0.5,
      etime: 0.72,
      word: "",
    },
    {
      stime: 0.72,
      etime: 1.56,
      word: "Bonjour",
    },
    {
      stime: 1.56,
      etime: 1.77,
      word: "les",
    },
    {
      stime: 1.77,
      etime: 2.19,
      word: "amis",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 3,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 1.56,
          etime: 1.77,
          word: "mes",
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("erase a three word syllab whith one syllab needed by a two word syllab", (t) => {
  const oldText = "ressources naturelles, paraity atteinte"
  const newText = "ressources naturelles, parait atteinte"

  const words = [
    {
      stime: 76.11,
      etime: 76.59,
      word: "ressources",
    },
    {
      stime: 76.59,
      etime: 77.43,
      word: "naturelles,",
    },
    {
      stime: 77.43,
      etime: 78.658625,
      word: "paraity",
      neededSyllabs: 1,
    },
    {
      stime: 78.658625,
      etime: 79.32,
      word: "atteinte",
    },
  ]

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 2,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 77.43,
          etime: 78.658625,
          word: "parait",
          wid: "id",
        },
      ],
    },
    {
      retain: 1,
    },
  ])
})

test("Delete word preceded by words with needed syllabs", (t) => {
  const oldText = "chaquee jour vers l' enfer"
  const newText = "chaquee e jour vers l' enfer"

  const words = [
    {
      word: "chaquee",
      stime: 0.57,
      etime: 1.05,
      wid: "b5282541-9542-43b0-abdd-7950c0645546",
      neededSyllabs: 2,
    },
    {
      wid: "65d84fc4-4d62-4e2e-b96c-1ab4a14ea038",
      stime: 1.05,
      etime: 1.35,
      word: "jour",
      confidence: 1,
      highlights: [],
      keywords: [],
    },
    {
      wid: "07b2598c-a5ab-4f87-bb7e-0762e5ecd026",
      stime: 1.35,
      etime: 1.53,
      word: "vers",
      confidence: 1,
      highlights: [],
      keywords: [],
    },
    {
      wid: "ae6145a8-264d-45a5-a885-f524cee85f48",
      stime: 1.53,
      etime: 1.59,
      word: "l'",
      confidence: 1,
      highlights: [],
      keywords: [],
    },
    {
      wid: "121f681e-3c67-4ba6-a057-e42490bc0373",
      stime: 1.59,
      etime: 1.98,
      word: "enfer",
      confidence: 1,
      highlights: [],
      keywords: [],
    },
  ]

  const splitText = newText.split(" ").map((word) => ({ word: word.trim() }))
  const diff = diffArrays(
    words.filter((w) => w.word !== ""),
    splitText,
    {
      comparator: (a, b) => a.word === b.word,
    }
  )

  t.deepEqual(diffFunction(newText, words), [
    {
      retain: 0,
    },
    {
      delete: 1,
    },
    {
      insert: [
        {
          stime: 0.57,
          etime: 1.05,
          word: "chaquee",
          neededSyllabs: 2,
          wid: "id",
        },
        {
          stime: 1.05,
          etime: 1.05,
          word: "e",
          wid: "id",
          neededSyllabs: 1,
        },
      ],
    },
    {
      retain: 4,
    },
  ])
})
