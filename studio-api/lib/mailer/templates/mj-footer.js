const debug = require("debug")("linto:lib:Mailer:templates:builder:title")

module.exports = function () {
  return `
  <mj-section css-class="mail-footer">
    <mj-column>
      <mj-text css-class="mail-footer-text">
        © COPYRIGHT LINAGORA 2022
      </mj-text>
    </mj-column>
  </mj-section>`
}
