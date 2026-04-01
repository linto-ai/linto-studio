const { createException } = require("./base")

module.exports = {
  DeliveryError: createException(
    "DeliveryError",
    "delivery",
    400,
    "Keyword extraction error",
  ),
  DeliveryNotFound: createException(
    "DeliveryNotFound",
    "delivery",
    404,
    "Requested delivery session not found",
  ),
  DeliveryUnknowType: createException(
    "DeliveryUnknowType",
    "delivery",
    400,
    "Requested type is not supported",
  ),
  DeliveryUnsupportedMediaType: createException(
    "DeliveryUnsupportedMediaType",
    "delivery",
    415,
    "Request parameter is not supported",
  ),
}
