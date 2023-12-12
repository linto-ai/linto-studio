import test from "ava"

import findExpressionInWordsList from "../findExpressionInWordsList.js"

test("find a single word in a list of words", (t) => {
  let expressionsList = ["world"]
  let wordsList = ["hello", "world", "how", "are", "you"]
  let rangesList = findExpressionInWordsList(expressionsList, wordsList)
  t.deepEqual(rangesList, [{ start: 1, end: 1, expression: "world" }])
})

test("find a multiple word expression in a list of words", (t) => {
  let expressionsList = ["how are"]
  let wordsList = ["hello", "world", "how", "are", "you"]
  let rangesList = findExpressionInWordsList(expressionsList, wordsList)
  t.deepEqual(rangesList, [{ start: 2, end: 3, expression: "how are" }])
})

test("find two 'multiple word expression' in a list of words", (t) => {
  let expressionsList = ["how are", "my friend"]
  let wordsList = ["hello", "world", "how", "are", "you", "my", "friend"]
  let rangesList = findExpressionInWordsList(expressionsList, wordsList)
  t.deepEqual(rangesList, [
    { start: 2, end: 3, expression: "how are" },
    { start: 5, end: 6, expression: "my friend" },
  ])
})

test("find multiple word expression in a list of words with expression repetition", (t) => {
  let expressionsList = ["how are you", "my friend"]
  let wordsList = [
    "hello",
    "world",
    "my",
    "friend",
    "how",
    "are",
    "you",
    "my",
    "friend",
  ]
  let rangesList = findExpressionInWordsList(expressionsList, wordsList)
  t.deepEqual(rangesList, [
    { start: 2, end: 3, expression: "my friend" },
    { start: 4, end: 6, expression: "how are you" },
    { start: 7, end: 8, expression: "my friend" },
  ])
})

test("find expression if there is some words repetition", (t) => {
  let expressionsList = ["my friend"]
  let wordsList = ["hello", "world", "how", "are", "you", "my", "my", "friend"]
  let rangesList = findExpressionInWordsList(expressionsList, wordsList)
  t.deepEqual(rangesList, [{ start: 6, end: 7, expression: "my friend" }])
})

test("find expression and ignore punctuation", (t) => {
  let expressionsList = ["how are you", "my friend"]
  let wordsList = ["hello", "world,", "how", "are", "you,", "my", "friend."]
  let rangesList = findExpressionInWordsList(expressionsList, wordsList)
  t.deepEqual(rangesList, [
    { start: 2, end: 4, expression: "how are you" },
    { start: 5, end: 6, expression: "my friend" },
  ])
})

test("use custom getter to access word value", (t) => {
  let expressionsList = ["how are you", "my friend"]
  let wordsList = [
    { value: "hello" },
    { value: "world" },
    { value: "how" },
    { value: "are" },
    { value: "you" },
    { value: "my" },
    { value: "friend" },
  ]
  let rangesList = findExpressionInWordsList(
    expressionsList,
    wordsList,
    null,
    (word) => word.value
  )
  t.deepEqual(rangesList, [
    { start: 2, end: 4, expression: "how are you" },
    { start: 5, end: 6, expression: "my friend" },
  ])
})

test("use custom getter to access expression value", (t) => {
  let expressionsList = [{ value: "how are you" }, { value: "my friend" }]
  let wordsList = ["hello", "world", "how", "are", "you", "my", "friend"]
  let rangesList = findExpressionInWordsList(
    expressionsList,
    wordsList,
    (expr) => expr.value
  )
  t.deepEqual(rangesList, [
    { start: 2, end: 4, expression: "how are you" },
    { start: 5, end: 6, expression: "my friend" },
  ])
})
