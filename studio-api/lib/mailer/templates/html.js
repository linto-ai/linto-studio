const debug = require("debug")("linto:lib:Mailer:templates:builder:html")

const mjml2html = require("mjml")
const mjMailHeader = require("./mj-header")
const mjMailBody = require("./mj-body")
const mjMailFooter = require("./mj-footer")
const mjMailStyle = require("./mj-style")

module.exports = function (Type, payload) {
  const mailContent = `
  <mjml>
    <mj-head>
      ${mjMailStyle()}
    </mj-head>
    <mj-body>
      ${mjMailHeader(Type)}
      ${mjMailBody(Type, payload)}
      ${mjMailFooter(Type, payload)}
    </mj-body>
  </mjml>
  `

  const mail = mjml2html(mailContent).html
  return mail
}
