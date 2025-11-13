const TYPE = Object.freeze({
  HIGHLIGHT: "highlight",
  LABEL: "conversation_metadata",
  SYSTEM: "system",

  // check if the type is valid
  checkValue: (type) => type === TYPE.HIGHLIGHT || type === TYPE.LABEL,
  desiredType: (type, desiredType) => {
    switch (true) {
      case type === undefined:
        return false
      case desiredType === undefined:
        return true
      case type === TYPE.HIGHLIGHT && desiredType.includes(TYPE.HIGHLIGHT):
        return true
      case type === TYPE.LABEL && desiredType.includes(TYPE.LABEL):
        return true
      case type === TYPE.SYSTEM && desiredType.includes(TYPE.SYSTEM):
        return false // We don't want to allow to set the system type
      default:
        return false
    }
  },
  default: () => {
    return {
      name: "tags",
      type: TYPE.SYSTEM,
    }
  },
})

module.exports = TYPE
