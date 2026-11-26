const TYPES = Object.freeze({
  CANONICAL: "canonical",
  CHILD: "child",
  TRANSLATION: "translation",

  // A child or a translation hangs on a parent conversation
  isChild: (type) => type === TYPES.CHILD || type === TYPES.TRANSLATION,

  // check if the type is valid
  checkValue: (type) =>
    type === TYPES.CANONICAL ||
    type === TYPES.CHILD ||
    type === TYPES.TRANSLATION,
  desiredType: (type) => {
    switch (true) {
      case type === undefined:
        return false
      case type === TYPES.CANONICAL:
      case type === TYPES.CHILD:
      case type === TYPES.TRANSLATION:
        return true
      default:
        return false
    }
  },
})

module.exports = TYPES
