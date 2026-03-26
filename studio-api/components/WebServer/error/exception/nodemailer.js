const { createException } = require("./base")

module.exports = {
  NodemailerError: createException(
    "NodemailerError",
    "nodemailer",
    400,
    "An error has occurred when sending email. Please retry later or contact support.",
  ),
  NodemailerInvalidEmail: createException(
    "NodemailerInvalidEmail",
    "nodemailer",
    400,
    "The email address is invalid or have a bad domain.",
  ),
}
