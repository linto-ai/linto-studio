const { createException } = require("./base")

module.exports = {
  TagError: createException("TagError", "tag", 400, "Tag error"),
  TagConflict: createException("TagConflict", "tag", 409, "Tag conflict"),
  TagNotFound: createException("TagNotFound", "tag", 404, "Tag not found"),
  TagUnsupportedMediaType: createException(
    "TagUnsupportedMediaType",
    "tag",
    415,
    "Tag unsupported media type",
  ),
}
