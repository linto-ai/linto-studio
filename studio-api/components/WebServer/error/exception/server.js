const { createException } = require("./base")

module.exports = {
  InternalServerError: createException(
    "InternalServerError",
    "server",
    500,
    "Server error",
  ),
}
