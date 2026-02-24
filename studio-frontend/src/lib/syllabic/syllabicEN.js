import { syllable } from "syllable"
import Syllabic from "./syllabic.js"

export default class syllabicEN extends Syllabic {
  constructor(language = "en-US") {
    super(language)
  }

  count(term) {
    return syllable(term)
  }
}
