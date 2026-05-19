const { createException } = require("./base")

module.exports = {
  FolderError: createException("FolderError", "folder", 400, "Folder error"),
  FolderNotFound: createException(
    "FolderNotFound",
    "folder",
    404,
    "Folder not found",
  ),
  FolderConflict: createException(
    "FolderConflict",
    "folder",
    409,
    "Folder conflict",
  ),
  FolderCycleDetected: createException(
    "FolderCycleDetected",
    "folder",
    422,
    "Moving this folder would create a cycle",
  ),
  FolderDepthLimitExceeded: createException(
    "FolderDepthLimitExceeded",
    "folder",
    422,
    "Maximum folder nesting depth reached",
  ),
  FolderForbidden: createException(
    "FolderForbidden",
    "folder",
    403,
    "Folder access denied",
  ),
}
