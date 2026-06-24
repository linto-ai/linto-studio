// Ported from studio-frontend/src/tools/test/divideTurn.js (ava).
// Server divideTurn takes explicit turn ids (firstTurnId, secondTurnId); the
// frontend generated them and mocked the id to "id" under TEST. We pass
// "id","id" and mock uuid so splitWord's new fragment wid is "id" too,
// reproducing the original fixtures verbatim.
jest.mock("uuid", () => ({ v4: () => "id" }))

const {
  divideTurn,
  splitWord,
} = require(`${process.cwd()}/components/EditorHandler/words/divideTurn`)
const SyllabicFR = require(`${process.cwd()}/components/EditorHandler/words/syllabic/syllabicFR`)

const t = {
  deepEqual: (a, b) => expect(a).toEqual(b),
}

const syllabicFr = new SyllabicFR("fr-FR")

test("divide turn between two words", () => {
  const turn = {
    speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
    turn_id: "fc28e3e9-befd-4b2e-a848-ddd0d7c420bc",
    segment: "l'enfant déshérité s'enivre de soleil",
    words: [
      {
        wid: "77b64de6-0b7a-432d-874d-f946776645a8",
        stime: 0.27,
        etime: 0.75,
        word: "l'enfant",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
        stime: 0.75,
        etime: 1.35,
        word: "déshérité",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
        stime: 1.35,
        etime: 1.83,
        word: "s'enivre",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "264a10d7-b85f-48fa-ac83-4d107d3ea022",
        stime: 1.83,
        etime: 1.95,
        word: "de",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "bb4633b4-aa7b-41f5-8839-09ec0e35e259",
        stime: 1.95,
        etime: 2.34,
        word: "soleil",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
    ],
  }

  const res_turns = [
    {
      speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
      turn_id: "id",
      segment: "l'enfant déshérité s'enivre",
      words: [
        {
          wid: "77b64de6-0b7a-432d-874d-f946776645a8",
          stime: 0.27,
          etime: 0.75,
          word: "l'enfant",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
          stime: 0.75,
          etime: 1.35,
          word: "déshérité",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
          stime: 1.35,
          etime: 1.83,
          word: "s'enivre",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
      ],
    },
    {
      speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
      turn_id: "id",
      segment: "de soleil",
      words: [
        {
          wid: "264a10d7-b85f-48fa-ac83-4d107d3ea022",
          stime: 1.83,
          etime: 1.95,
          word: "de",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "bb4633b4-aa7b-41f5-8839-09ec0e35e259",
          stime: 1.95,
          etime: 2.34,
          word: "soleil",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
      ],
    },
  ]
  const textBefore = "l'enfant déshérité s'enivre"
  const textAfter = "de soleil"
  t.deepEqual(divideTurn(turn, textBefore, textAfter, syllabicFr, "id", "id"), res_turns)
})

test("divide turn in a middle of a word", () => {
  const turn = {
    speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
    turn_id: "id",
    segment: "l'enfant déshérité s'enivre de soleil",
    words: [
      {
        wid: "77b64de6-0b7a-432d-874d-f946776645a8",
        stime: 0.27,
        etime: 0.75,
        word: "l'enfant",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
        stime: 0.75,
        etime: 1.35,
        word: "déshérité",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
        stime: 1.35,
        etime: 1.83,
        word: "s'enivre",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "264a10d7-b85f-48fa-ac83-4d107d3ea022",
        stime: 1.83,
        etime: 1.95,
        word: "de",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "bb4633b4-aa7b-41f5-8839-09ec0e35e259",
        stime: 1.95,
        etime: 2.34,
        word: "soleil",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
    ],
  }

  const res_turns = [
    {
      speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
      turn_id: "id",
      segment: "l'enfant déshérité s'en",
      words: [
        {
          wid: "77b64de6-0b7a-432d-874d-f946776645a8",
          stime: 0.27,
          etime: 0.75,
          word: "l'enfant",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
          stime: 0.75,
          etime: 1.35,
          word: "déshérité",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
          stime: 1.35,
          etime: 1.59,
          word: "s'en",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
      ],
    },
    {
      speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
      turn_id: "id",
      segment: "ivre de soleil",
      words: [
        {
          wid: "id",
          stime: 1.59,
          etime: 1.83,
          word: "ivre",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "264a10d7-b85f-48fa-ac83-4d107d3ea022",
          stime: 1.83,
          etime: 1.95,
          word: "de",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "bb4633b4-aa7b-41f5-8839-09ec0e35e259",
          stime: 1.95,
          etime: 2.34,
          word: "soleil",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
      ],
    },
  ]
  const textBefore = "l'enfant déshérité s'en"
  const textAfter = "ivre de soleil"
  t.deepEqual(divideTurn(turn, textBefore, textAfter, syllabicFr, "id", "id"), res_turns)
})

test("empty word in the middle", () => {
  const turn = {
    speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
    turn_id: "id",
    segment: "l'enfant déshérité s'enivre de soleil",
    words: [
      {
        wid: "77b64de6-0b7a-432d-874d-f946776645a8",
        stime: 0.27,
        etime: 0.75,
        word: "l'enfant",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
        stime: 0.75,
        etime: 1.35,
        word: "déshérité",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
        stime: 1.35,
        etime: 1.35,
        word: "",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
        stime: 1.35,
        etime: 1.83,
        word: "s'enivre",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "264a10d7-b85f-48fa-ac83-4d107d3ea022",
        stime: 1.83,
        etime: 1.95,
        word: "de",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "bb4633b4-aa7b-41f5-8839-09ec0e35e259",
        stime: 1.95,
        etime: 2.34,
        word: "soleil",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
    ],
  }

  const res_turns = [
    {
      speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
      turn_id: "id",
      segment: "l'enfant déshérité s'en",
      words: [
        {
          wid: "77b64de6-0b7a-432d-874d-f946776645a8",
          stime: 0.27,
          etime: 0.75,
          word: "l'enfant",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
          stime: 0.75,
          etime: 1.35,
          word: "déshérité",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
          stime: 1.35,
          etime: 1.35,
          word: "",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
          stime: 1.35,
          etime: 1.59,
          word: "s'en",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
      ],
    },
    {
      speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
      turn_id: "id",
      segment: "ivre de soleil",
      words: [
        {
          wid: "id",
          stime: 1.59,
          etime: 1.83,
          word: "ivre",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "264a10d7-b85f-48fa-ac83-4d107d3ea022",
          stime: 1.83,
          etime: 1.95,
          word: "de",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "bb4633b4-aa7b-41f5-8839-09ec0e35e259",
          stime: 1.95,
          etime: 2.34,
          word: "soleil",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
      ],
    },
  ]
  const textBefore = "l'enfant déshérité s'en"
  const textAfter = "ivre de soleil"
  t.deepEqual(divideTurn(turn, textBefore, textAfter, syllabicFr, "id", "id"), res_turns)
})

test("divide turn", () => {
  t.deepEqual(
    splitWord(
      "bon",
      "jour",
      {
        wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
        stime: 0.75,
        etime: 1.35,
        word: "bonjour",
      },
      syllabicFr,
    ),
    [
      {
        wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
        stime: 0.75,
        etime: 1.05,
        word: "bon",
      },
      {
        wid: "id",
        stime: 1.05,
        etime: 1.35,
        word: "jour",
      },
    ],
  )
})

test("divide turn between two words if word contains a space", () => {
  const turn = {
    speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
    turn_id: "fc28e3e9-befd-4b2e-a848-ddd0d7c420bc",
    segment: "l'enfant ? déshérité s'enivre de soleil",
    words: [
      {
        wid: "77b64de6-0b7a-432d-874d-f946776645a8",
        stime: 0.27,
        etime: 0.75,
        word: "l'enfant ?",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
        stime: 0.75,
        etime: 1.35,
        word: "déshérité",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
        stime: 1.35,
        etime: 1.83,
        word: "s'enivre",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "264a10d7-b85f-48fa-ac83-4d107d3ea022",
        stime: 1.83,
        etime: 1.95,
        word: "de",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
      {
        wid: "bb4633b4-aa7b-41f5-8839-09ec0e35e259",
        stime: 1.95,
        etime: 2.34,
        word: "soleil",
        confidence: 1,
        highlights: [],
        keywords: [],
      },
    ],
  }

  const res_turns = [
    {
      speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
      turn_id: "id",
      segment: "l'enfant ? déshérité s'enivre",
      words: [
        {
          wid: "77b64de6-0b7a-432d-874d-f946776645a8",
          stime: 0.27,
          etime: 0.75,
          word: "l'enfant ?",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "97ec8461-f579-403a-8a0e-933dc5cd3a75",
          stime: 0.75,
          etime: 1.35,
          word: "déshérité",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "a0fab771-2dd4-4c15-9590-a10603ab756c",
          stime: 1.35,
          etime: 1.83,
          word: "s'enivre",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
      ],
    },
    {
      speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
      turn_id: "id",
      segment: "de soleil",
      words: [
        {
          wid: "264a10d7-b85f-48fa-ac83-4d107d3ea022",
          stime: 1.83,
          etime: 1.95,
          word: "de",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
        {
          wid: "bb4633b4-aa7b-41f5-8839-09ec0e35e259",
          stime: 1.95,
          etime: 2.34,
          word: "soleil",
          confidence: 1,
          highlights: [],
          keywords: [],
        },
      ],
    },
  ]
  const textBefore = "l'enfant ? déshérité s'enivre"
  const textAfter = "de soleil"
  t.deepEqual(divideTurn(turn, textBefore, textAfter, syllabicFr, "id", "id"), res_turns)
})
