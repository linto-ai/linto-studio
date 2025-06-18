const debug = require("debug")("linto:lib:Mailer:templates:builder:title")

module.exports = function (Type) {
  return `
  <mj-section css-class="mail-header">
    <mj-column>
      <mj-text>
        ${Type.title}
      </mj-text>
    </mj-column>
  </mj-section>`
}
