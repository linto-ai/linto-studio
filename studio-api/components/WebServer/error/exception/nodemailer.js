const { createException } = require("./base")

module.exports = {
  NodemailerError: createException(
    "NodemailerError",
    "nodemailer",
    400,
    "An error has occurred when sending email. Please retry later or contact support.",
  ),
}
