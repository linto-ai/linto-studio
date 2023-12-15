import test from "ava"
import { mergeArrayOnId } from "../mergeArrayOnId.js"

test("mergeArrayOnId() returns an empty array when both arguments are empty arrays", (t) => {
  const res = mergeArrayOnId([], [])
  t.deepEqual(res, [])
})

test("mergeArrayOnId() returns exactly the first array when the second is empty", (t) => {
  const cats1 = [
    {
      _id: "catId1",
      name: "cat1",
      tags: [
        {
          _id: "tid1",
          name: "tag1",
        },
        {
          _id: "tid2",
          name: "tag2",
        },
      ],
    },
  ]

  const res = mergeArrayOnId(cats1, [])
  t.deepEqual(res, cats1)
})

test("mergeArrayOnId() returns exactly the second array when the first is empty", (t) => {
  const cats2 = [
    {
      _id: "catId1",
      name: "cat1",
      tags: [
        {
          _id: "tid1",
          name: "tag1",
        },
        {
          _id: "tid2",
          name: "tag2",
        },
      ],
    },
  ]

  const res = mergeArrayOnId([], cats2)
  t.deepEqual(res, cats2)
})

test("mergeArrayOnId() merges two flat arrays on _id", (t) => {
  const cats1 = [
    {
      _id: "catId1",
      name: "cat1",
    },
    {
      _id: "catId2",
      name: "cat2",
    },
  ]

  const cats2 = [
    {
      _id: "catId1",
      name: "cat1",
    },
    {
      _id: "catId3",
      name: "cat3",
    },
  ]

  const res = mergeArrayOnId(cats1, cats2)
  t.deepEqual(res, [
    {
      _id: "catId1",
      name: "cat1",
    },
    {
      _id: "catId2",
      name: "cat2",
    },
    {
      _id: "catId3",
      name: "cat3",
    },
  ])
})

test("mergeArrayOnId() merges two arrays with nested arrays on _id", (t) => {
  const cats1 = [
    {
      _id: "catId1",
      name: "cat1",
      tags: [
        {
          _id: "tid1",
          name: "tag1",
        },
        {
          _id: "tid2",
          name: "tag2",
        },
      ],
    },
    {
      _id: "catId2",
      name: "cat2",
    },
  ]

  const cats2 = [
    {
      _id: "catId1",
      name: "cat1",
      tags: [
        {
          _id: "tid1",
          name: "tag1",
        },
        {
          _id: "tid3",
          name: "tag3",
        },
      ],
    },
    {
      _id: "catId3",
      name: "cat3",
    },
  ]

  const res = mergeArrayOnId(cats1, cats2)
  t.deepEqual(res, [
    {
      _id: "catId1",
      name: "cat1",
      tags: [
        {
          _id: "tid1",
          name: "tag1",
        },
        {
          _id: "tid2",
          name: "tag2",
        },
        {
          _id: "tid3",
          name: "tag3",
        },
      ],
    },
    {
      _id: "catId2",
      name: "cat2",
    },
    {
      _id: "catId3",
      name: "cat3",
    },
  ])
})
