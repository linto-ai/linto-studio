const { createException } = require("./base")

// External entitlements (`/api/v1/organizations/{org}/entitlements`, the
// identity exchange and the server gates). `code` is the stable machine
// value; 400s also carry the detail in `error`, as the contract shipped to
// the external system requires.
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
  // No entitlement stands for this identity, or none of its features is on.
  EntitlementMissing: createException(
    "EntitlementMissing",
    "entitlement",
    404,
    "No entitlement stands for this identity",
    "no_entitlement",
  ),
  // The entitlement exists but does not open the feature this call needs.
  EntitlementFeatureForbidden: createException(
    "EntitlementFeatureForbidden",
    "entitlement",
    403,
    "This feature is not enabled for this identity",
    "no_entitlement",
  ),
}
