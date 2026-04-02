const { createException } = require("./base")

module.exports = {
  CategoryTypeNotDefined: createException(
    "CategoryTypeNotDefined",
    "category",
    415,
    "Category type is not defined",
  ),
  CategoryTypeNotValid: createException(
    "CategoryTypeNotValid",
    "category",
    415,
    "Category type is not valid",
  ),
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
  CategoryNotFound: createException(
    "CategoryNotFound",
    "category",
    404,
    "Category not found",
  ),
}
