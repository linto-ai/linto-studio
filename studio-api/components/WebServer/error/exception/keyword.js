const { createException } = require("./base")

module.exports = {
  KeywordError: createException(
    "KeywordError",
    "keyword",
    400,
    "Keyword extraction error",
  ),
  KeywordMetadataRequire: createException(
    "KeywordMetadataRequire",
    "keyword",
    400,
    "Metadata was not provided.",
  ),
}
