export default class Syllabic {
  constructor(language) {
    this.language = language
  }

  count(term) {
    throw new Error("Not implemented")
  }

  syllabify(term) {
    throw new Error("Not implemented")
  }
}
