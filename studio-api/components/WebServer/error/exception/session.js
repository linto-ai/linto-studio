const { createException } = require("./base")

module.exports = {
  SessionError: createException(
    "SessionError",
    "session",
    400,
    "Error during the operation",
  ),
  SessionUnsupportedMediaType: createException(
    "SessionUnsupportedMediaType",
    "session",
    415,
    "Metadata was not provided.",
  ),
  SessionNotFound: createException(
    "SessionNotFound",
    "session",
    404,
    "Requested session not found",
  ),
  SessionForbidden: createException(
    "SessionForbidden",
    "session",
    403,
    "Not allowed to do this",
  ),
  SessionConflict: createException(
    "SessionConflict",
    "session",
    409,
    "Session already exists",
  ),
}
