const moment = require("moment")

const EXPIRATION = Object.freeze({
  // Undefined when the input is not a date to come
  parseDate: (input) => {
    if (typeof input !== "string") return
    const date = moment(input, moment.ISO_8601, true)
    if (!date.isValid() || !date.isAfter(moment())) return
    return date.format()
  },
})

module.exports = EXPIRATION
