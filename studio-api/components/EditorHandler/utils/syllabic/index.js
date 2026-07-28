const SyllabicFR = require("./syllabicFR")
const SyllabicEN = require("./syllabicEN")

const cache = new Map()

function getSyllabic(language) {
  const code = (language || "").toLowerCase()
  const family = code.split(/[-_]/)[0]

  if (cache.has(family)) return cache.get(family)

  let instance
  switch (family) {
    case "en":
      instance = new SyllabicEN()
      break
    case "fr":
    default:
      instance = new SyllabicFR()
      break
  }
  cache.set(family, instance)
  return instance
}

module.exports = { getSyllabic }
