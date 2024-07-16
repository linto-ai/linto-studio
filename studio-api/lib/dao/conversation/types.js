const TYPES = Object.freeze({
  "CANONICAL": 'canonical',
  "CHILD": 'child',

  // check if the type is valid
  checkValue: (type) => (job === JOBS.TRANSCRIPTION || job === JOBS.CHILD),
  desiredType: (type) => {
    switch (true) {
      case type === undefined: return false
      case type === JOBS.TRANSCRIPTION:
      case type === JOBS.CHILD:
        return true
      default:
        return false
    }
  }
})

module.exports = TYPES