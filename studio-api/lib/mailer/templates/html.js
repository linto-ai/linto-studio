const debug = require("debug")("linto:lib:mailer:templates:html")

const mjml2html = require("mjml")
const mjMailHeader = require("./mj-header")
const mjMailBody = require("./mj-body")
const mjMailFooter = require("./mj-footer")
const mjMailStyle = require("./mj-style")

module.exports = async function (Type, payload) {
  const mailPayload = mjMailBody(Type, payload)

  const mailContent = `
  <mjml>
    <mj-head>
      ${mjMailStyle()}
    </mj-head>
    <mj-body>
      ${mjMailHeader(Type)}
      ${mailPayload.body}
      ${mjMailFooter(Type, payload)}
    </mj-body>
  </mjml>
  `
  const mjmlHtml = await mjml2html(mailContent)
  return {
    title: mailPayload.title,
    html: mjmlHtml.html,
  }
}
