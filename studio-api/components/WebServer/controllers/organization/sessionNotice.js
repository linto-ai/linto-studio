const { OrganizationSessionNoticeInvalid } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const SESSION_NOTICE_MAX_LENGTH = 20000

// The notice shown to every viewer of the organization's sessions, as Markdown.
// Returns the trimmed content; an empty string means the organization has none.
function parseSessionNotice(content) {
  if (typeof content !== "string")
    throw new OrganizationSessionNoticeInvalid("content must be a string")

  const trimmed = content.trim()
  if (trimmed.length > SESSION_NOTICE_MAX_LENGTH)
    throw new OrganizationSessionNoticeInvalid(
      `content must not exceed ${SESSION_NOTICE_MAX_LENGTH} characters`,
    )
  return trimmed
}

module.exports = { parseSessionNotice, SESSION_NOTICE_MAX_LENGTH }
