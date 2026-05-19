const { createException } = require("./base")

module.exports = {
  ServiceError: createException(
    "ServiceError",
    "service",
    400,
    "Error during the operation",
  ),
}
