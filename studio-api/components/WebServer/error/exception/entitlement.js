const { createException } = require("./base")

module.exports = {
  EntitlementInvalid: createException(
    "EntitlementInvalid",
    "entitlement",
    400,
    "Invalid entitlement payload",
    "invalid_body",
  ),
  EntitlementNotFound: createException(
    "EntitlementNotFound",
    "entitlement",
    404,
    "No entitlement is recorded for this subject",
    "not_found",
  ),
}
