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
