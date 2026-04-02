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
  SessionNotStarted: createException(
    "SessionNotStarted",
    "session",
    400,
    "Session must be ready or active",
  ),
  SessionConflict: createException(
    "SessionConflict",
    "session",
    409,
    "Session already exists",
  ),
  TranscriberUnavailable: createException(
    "TranscriberUnavailable",
    "session",
    409,
    "Transcriber is not available at the moment",
  ),
}
