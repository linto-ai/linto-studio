function countSyllabsFromWord(word, syllabic) {
  return syllabic.count(word) || 1
}

module.exports = { countSyllabsFromWord }
