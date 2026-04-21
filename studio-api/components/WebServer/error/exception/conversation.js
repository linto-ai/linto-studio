const { createException } = require("./base")

// Conversation
const ConversationError = createException(
  "ConversationError",
  "conversation",
  400,
  "Error during the operation",
)
const ConversationNoFileUploaded = createException(
  "ConversationNoFileUploaded",
  "conversation",
  400,
  "No files were uploaded.",
)
const ConversationURLExtractorError = createException(
  "ConversationURLExtractorError",
  "conversation",
  400,
  "No files were downloaded.",
)
const ConversationMetadataRequire = createException(
  "ConversationMetadataRequire",
  "conversation",
  400,
  "Metadata was not provided.",
)
const ConversationUnsupportedMediaType = createException(
  "ConversationUnsupportedMediaType",
  "conversation",
  415,
  "Parameter is not supported",
)
const ConversationWriteAccessDenied = createException(
  "ConversationWriteAccessDenied",
  "conversation",
  401,
  "User doesn't have write access to the conversation",
)
const ConversationShareAccessDenied = createException(
  "ConversationShareAccessDenied",
  "conversation",
  401,
  "User doesn't have share access to the conversation",
)
const ConversationDeleteAccessDenied = createException(
  "ConversationDeleteAccessDenied",
  "conversation",
  401,
  "User doesn't have delete access to the conversation",
)
const ConversationReadAccessDenied = createException(
  "ConversationReadAccessDenied",
  "conversation",
  401,
  "User doesn't have read access to the conversation",
)
const ConversationNotShared = createException(
  "ConversationNotShared",
  "conversation",
  401,
  "User doesn't have access to the conversation",
)
const ConversationIdRequire = createException(
  "ConversationIdRequire",
  "conversation",
  403,
  "Conversation id param is required",
)
const ConversationNotFound = createException(
  "ConversationNotFound",
  "conversation",
  404,
  "Requested conversation not found",
)

// Turn
const TurnNotFound = createException(
  "TurnNotFound",
  "conversationTurn",
  404,
  "Requested turn not found",
)

// Subtitle
const SubtitleError = createException(
  "SubtitleError",
  "conversation",
  400,
  "Error during the operation",
)
const SubtitleUnsupportedMediaType = createException(
  "SubtitleUnsupportedMediaType",
  "conversation",
  415,
  "Parameter is not supported",
)
const SubtitleMaxVersion = createException(
  "SubtitleMaxVersion",
  "conversation",
  403,
  "The number of subtitle versions for that conversion has reached its limit.",
)
const SubtitleNotFound = createException(
  "SubtitleNotFound",
  "conversation",
  404,
  "Requested subtitle not found",
)

// Export
const ExportNotConfigured = createException(
  "ExportNotConfigured",
  "conversation",
  500,
  "LLM Gateway not configured",
)
const ExportGatewayError = createException(
  "ExportGatewayError",
  "conversation",
  502,
  "LLM Gateway request failed",
)

// Generation
const GenerationNotFound = createException(
  "GenerationNotFound",
  "conversation",
  404,
  "Generation not found",
)

module.exports = {
  ConversationNoFileUploaded,
  ConversationURLExtractorError,
  ConversationMetadataRequire,
  ConversationUnsupportedMediaType,
  ConversationReadAccessDenied,
  ConversationWriteAccessDenied,
  ConversationDeleteAccessDenied,
  ConversationShareAccessDenied,
  ConversationNotShared,
  ConversationIdRequire,
  ConversationError,
  ConversationNotFound,
  TurnNotFound,
  SubtitleUnsupportedMediaType,
  SubtitleError,
  SubtitleMaxVersion,
  SubtitleNotFound,
  ExportNotConfigured,
  ExportGatewayError,
  GenerationNotFound,
}
