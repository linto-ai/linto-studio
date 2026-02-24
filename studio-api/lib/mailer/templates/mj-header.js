const debug = require("debug")("linto:lib:mailer:templates:mj-header")
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
