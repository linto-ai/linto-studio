const { createException } = require("./base")

module.exports = {
  FileUnsupportedMediaType: createException(
    "FileUnsupportedMediaType",
    "file",
    415,
    "File unsupported media type",
  ),
}
