import test from "ava"
import { divideTurn, splitWord } from "../divideTurn.js"
import { mergeTurn } from "../mergeTurn.js"
import SyllabicFR from "../../../public/js/syllabic/syllabicFR.js"

const syllabicFr = new SyllabicFR("fr-FR")

test("merge two turns", (t) => {
  const resTurn = {
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

  const startTurn = {
    speaker_id: "68a2b520-ead3-4caf-906d-6c2ea9a5d5ac",
    turn_id: "fc28e3e9-befd-4b2e-a848-ddd0d7c420bc",
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
  }

  const endTurn = {
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
  }

  t.deepEqual(mergeTurn(startTurn, endTurn, syllabicFr), resTurn)
})
