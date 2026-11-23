import test from "ava"
import { testHotwords } from "../testHotwords.js"
import {
  MAX_HOTWORD_LENGTH,
  MAX_HOTWORDS_PER_DICTIONARY,
} from "../../../const/hotwords.js"

const t = (key, params) => ({ key, ...params })

function check(value) {
  const field = { value, error: null, valid: false }
  return { isValid: testHotwords(field, t), field }
}

test("words within the limits are valid, an empty list too", (t) => {
  t.true(check("LinTO\n" + "a".repeat(MAX_HOTWORD_LENGTH)).isValid)
  const empty = check("")
  t.true(empty.isValid)
  t.true(empty.field.valid)
  t.is(empty.field.error, null)
})

test("too many words", (t) => {
  const words = Array.from(
    { length: MAX_HOTWORDS_PER_DICTIONARY + 1 },
    (_, index) => `word${index}`,
  )
  const { isValid, field } = check(words.join("\n"))
  t.false(isValid)
  t.deepEqual(field.error, {
    key: "hotword_dictionaries.too_many",
    max: MAX_HOTWORDS_PER_DICTIONARY,
  })
})

test("a word too long is named", (t) => {
  const word = "a".repeat(MAX_HOTWORD_LENGTH + 1)
  const { isValid, field } = check(`LinTO, ${word}`)
  t.false(isValid)
  t.deepEqual(field.error, {
    key: "hotword_dictionaries.too_long",
    word,
    max: MAX_HOTWORD_LENGTH,
  })
})
