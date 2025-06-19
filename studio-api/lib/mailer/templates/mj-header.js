const debug = require("debug")("linto:lib:Mailer:templates:builder:title")
const TITLE = process.env.APPLICATION_NAME || "LinTO Studio"

module.exports = function (Type) {
  return `
  <mj-section css-class="mail-header">
    <mj-column>
      <mj-text css-class="mail-header-text">
        ${TITLE}
      </mj-text>
    </mj-column>
  </mj-section>`
}
