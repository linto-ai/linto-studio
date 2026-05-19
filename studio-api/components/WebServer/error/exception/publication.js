const { createException } = require("./base")

module.exports = {
  PublicationError: createException(
    "PublicationError",
    "publication",
    400,
    "Error during publication operation",
  ),
  PublicationNotConfigured: createException(
    "PublicationNotConfigured",
    "publication",
    500,
    "LLM Gateway not configured",
  ),
  PublicationNotFound: createException(
    "PublicationNotFound",
    "publication",
    404,
    "Publication not found",
  ),
  PublicationInvalidFormat: createException(
    "PublicationInvalidFormat",
    "publication",
    400,
    "Invalid export format",
  ),
  PublicationUploadFailed: createException(
    "PublicationUploadFailed",
    "publication",
    500,
    "Template upload failed",
  ),
  PublicationForbidden: createException(
    "PublicationForbidden",
    "publication",
    403,
    "Publication access denied",
  ),
  PublicationAuthRequired: createException(
    "PublicationAuthRequired",
    "publication",
    401,
    "Authentication required",
  ),
  PublicationIdRequired: createException(
    "PublicationIdRequired",
    "publication",
    400,
    "Parameter is required",
  ),
}
