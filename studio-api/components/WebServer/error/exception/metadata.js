const { createException } = require("./base")

module.exports = {
  MetadataError: createException("MetadataError", "tag", 400, "Metadata error"),
  MetadataNotFound: createException(
    "MetadataNotFound",
    "tag",
    404,
    "Metadata not found",
  ),
  MetadataUnsupportedMediaType: createException(
    "MetadataUnsupportedMediaType",
    "tag",
    415,
    "Metadata unsupported media type",
  ),
}
