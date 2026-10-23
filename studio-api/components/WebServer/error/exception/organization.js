const { createException } = require("./base")

module.exports = {
  OrganizationError: createException(
    "OrganizationError",
    "organization",
    400,
    "Error during the operation",
  ),
  OrganizationForbidden: createException(
    "OrganizationForbidden",
    "organization",
    403,
    "Not allowed to do this",
  ),
  OrganizationNotFound: createException(
    "OrganizationNotFound",
    "organization",
    404,
    "Organization not found",
  ),
  OrganizationSessionNoticeInvalid: createException(
    "OrganizationSessionNoticeInvalid",
    "organization",
    400,
    "Invalid session notice",
    "ORGANIZATION_SESSION_NOTICE_INVALID",
  ),
  OrganizationConflict: createException(
    "OrganizationConflict",
    "organization",
    409,
    "Organization already exists",
  ),
  OrganizationUnsupportedMediaType: createException(
    "OrganizationUnsupportedMediaType",
    "organization",
    415,
    "Parameter is not supported",
  ),
}
