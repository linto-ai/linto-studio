const { throwIfError } = require("./throwIfError")

function firstOf(docs) {
  return throwIfError(docs)[0] ?? null
}

module.exports = { firstOf }
