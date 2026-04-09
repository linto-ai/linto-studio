const { createException } = require("./base")

module.exports = {
  CategoryError: createException(
    "CategoryError",
    "category",
    400,
    "Category error",
  ),
  CategoryConflict: createException(
    "CategoryConflict",
    "category",
    409,
    "Category conflict",
  ),
  CategoryUnsupportedMediaTypepeNotDefined: createException(
    "CategoryUnsupportedMediaTypepeNotDefined",
    "category",
    415,
    "Category unsupported media type",
  ),
}
