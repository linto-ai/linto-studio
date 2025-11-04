const TYPE = Object.freeze({
  M2M: "machine",
  USER: "user",

  isValid(type) {
    return Object.values(TYPE).includes(type)
  },

  matches(type, desiredTypes = []) {
    if (!type || !Array.isArray(desiredTypes)) return false
    return desiredTypes.includes(type)
  },

  getDefault() {
    return {
      name: "user",
      type: TYPE.USER,
    }
  },
})

module.exports = TYPE
