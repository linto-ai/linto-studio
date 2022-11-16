const TYPES = Object.freeze({
  "DIARIZATION": "diarization",
  "PUNCTUATION": "punctuation",
  "STT": "stt",
  "UNSUPORTED": "unsuported",

  checkType: (typeSearch) => {
    if (typeSearch.includes(TYPES.DIARIZATION)) {
      return TYPES.DIARIZATION
    } else if (typeSearch.includes(TYPES.PUNCTUATION)) {
      return TYPES.PUNCTUATION
    } else if (typeSearch.includes(TYPES.STT)) {
      return TYPES.STT
    } else {
      return TYPES.UNSUPORTED
    }
  }
})

module.exports = TYPES