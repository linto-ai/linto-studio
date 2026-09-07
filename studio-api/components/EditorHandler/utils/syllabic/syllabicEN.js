const { syllable } = require("syllable")
const Syllabic = require("./syllabic")

class SyllabicEN extends Syllabic {
  constructor(language = "en-US") {
    super(language)
  }

  count(term) {
    return syllable(term)
  }
}

module.exports = SyllabicEN
