import { parseHotwords } from "../parseHotwords.js"
import {
  MAX_HOTWORD_LENGTH,
  MAX_HOTWORDS_PER_DICTIONARY,
} from "../../const/hotwords.js"

export function testHotwords(field, t) {
  field.error = null
  field.valid = false
  const words = parseHotwords(field.value)
  if (words.length > MAX_HOTWORDS_PER_DICTIONARY) {
    field.error = t("hotword_dictionaries.too_many", {
      max: MAX_HOTWORDS_PER_DICTIONARY,
    })
    return false
  }
  const tooLong = words.find((word) => word.length > MAX_HOTWORD_LENGTH)
  if (tooLong !== undefined) {
    field.error = t("hotword_dictionaries.too_long", {
      word: tooLong,
      max: MAX_HOTWORD_LENGTH,
    })
    return false
  }
  field.valid = true
  return true
}
