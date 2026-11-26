// A conversation deleted on fetch is only reached by its id, never listed
const LISTED = Object.freeze({ deleteOnFetch: { $ne: true } })

module.exports = LISTED
