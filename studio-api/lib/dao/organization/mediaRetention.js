const moment = require("moment")

const UNITS = ["hour", "day", "week", "month", "year"]
const MAX_VALUE = 120

const MEDIA_RETENTION = Object.freeze({
  UNITS,
  MAX_VALUE,

  // Undefined when the input is not a whole number of one of the units
  parse: (input) => {
    const value = Number(input?.value)
    if (!Number.isInteger(value) || value < 1 || value > MAX_VALUE) return
    if (!UNITS.includes(input.unit)) return
    return { value, unit: input.unit }
  },

  // When a media created now gets deleted
  expirationDate: (retention) =>
    moment().add(retention.value, retention.unit).format(),
})

module.exports = MEDIA_RETENTION
