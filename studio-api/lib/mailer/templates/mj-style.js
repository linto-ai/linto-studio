const debug = require("debug")("linto:lib:mailer:templates:mj-style")
module.exports = function (format) {
  if (process.env.TEMPLATE_MAILER_STYLE === "eu") {
    return require("../style/linto")
  }
  return require("../style/linto")
}
