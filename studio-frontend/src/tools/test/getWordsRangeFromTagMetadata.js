import test from "ava"

import getWordsRangeFromTagMetadata from "../getWordsRangeFromTagMetadata.js"

test("get words range from tag metadata", (t) => {
  const tag = {
    metadata: [
      {
        schema: "words",
        value: {
          range_id: [
            {
              startId: "id1",
              endId: "id2",
            },
            {
              startId: "id3",
              endId: "id4",
            },
          ],
        },
      },
    ],
  }

  const range = getWordsRangeFromTagMetadata(tag)

  t.deepEqual(range, [
    {
      startId: "id1",
      endId: "id2",
    },
    {
      startId: "id3",
      endId: "id4",
    },
  ])
})

test("get words range from tag metadata with no metadata", (t) => {
  const tag = {}

  const range = getWordsRangeFromTagMetadata(tag)

  t.deepEqual(range, [])
})

test("get words range from tag metadata with no words metadata", (t) => {
  const tag = {
    metadata: [
      {
        schema: "other",
        value: {
          range_id: [
            {
              startId: "id1",
              endId: "id2",
            },
            {
              startId: "id3",
              endId: "id4",
            },
          ],
        },
      },
    ],
  }

  const range = getWordsRangeFromTagMetadata(tag)

  t.deepEqual(range, [])
})
