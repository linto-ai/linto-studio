const { createException } = require("./base")

const HotwordDictionaryError = createException(
  "HotwordDictionaryError",
  "hotwordDictionary",
  400,
  "Hotword dictionary error",
)
const HotwordDictionaryNotFound = createException(
  "HotwordDictionaryNotFound",
  "hotwordDictionary",
  404,
  "Hotword dictionary not found",
)
const HotwordDictionaryConflict = createException(
  "HotwordDictionaryConflict",
  "hotwordDictionary",
  409,
  "Hotword dictionary conflict",
)
const HotwordDictionaryForbidden = createException(
  "HotwordDictionaryForbidden",
  "hotwordDictionary",
  403,
  "Hotword dictionary not available for this organization",
)

module.exports = {
  HotwordDictionaryError,
  HotwordDictionaryNotFound,
  HotwordDictionaryConflict,
  HotwordDictionaryForbidden,
}
