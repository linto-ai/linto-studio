const { createException } = require("./base")

module.exports = {
  UserError: createException(
    "UserError",
    "users",
    400,
    "Error during the operation",
  ),
  UserConflict: createException(
    "UserConflict",
    "users",
    409,
    "User address already used",
  ),
  UserForbidden: createException(
    "UserForbidden",
    "users",
    403,
    "Not allowed to do this",
  ),
  UserNotFound: createException("UserNotFound", "users", 404, "User not found"),
  UserUnsupportedMediaType: createException(
    "UserUnsupportedMediaType",
    "users",
    415,
    "Parameter is not supported",
  ),
  GenerateMagicLinkError: createException(
    "GenerateMagicLinkError",
    "users",
    424,
    "Error on generating authentication link.",
  ),
}
