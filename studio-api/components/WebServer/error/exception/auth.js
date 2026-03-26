const { createException } = require("./base")

module.exports = {
  // Auth
  InvalidCredential: createException(
    "InvalidCredential",
    "auth",
    401,
    "Invalid credentials",
  ),
  UnableToGenerateKeyToken: createException(
    "UnableToGenerateKeyToken",
    "auth",
    401,
    "Unable to generate the keyToken",
  ),
  UserNotFound: createException(
    "UserNotFound",
    "auth",
    401,
    "Invalid credentials",
  ),
  MultipleUserFound: createException(
    "MultipleUserFound",
    "auth",
    401,
    "Multiple user have been found, please check with an administrator",
  ),
  // Passport
  MalformedToken: createException(
    "MalformedToken",
    "auth",
    401,
    "Malformed token",
  ),
  ExpiredLink: createException("ExpiredLink", "auth", 401, "Link is expired"),
  DisabledUser: createException(
    "DisabledUser",
    "auth",
    423,
    "Your account is disabled. Contact support to reactivate it.",
  ),
  EmailNotVerified: createException(
    "EmailNotVerified",
    "auth",
    403,
    "Email address not verified",
  ),
  Unauthorized: createException(
    "Unauthorized",
    "auth",
    401,
    "You are not authorized to access this resource",
  ),
  // Proxy
  UnauthorizedProxy: createException(
    "Unauthorized",
    "auth",
    403,
    "You are not authorized to access this resource",
  ),
}
