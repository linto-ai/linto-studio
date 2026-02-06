const debug = require("debug")("linto:lib:mailer:templates:mj-footer")
const year = new Date().getFullYear()

module.exports = function () {
  return `
  <mj-section css-class="mail-footer">
    <mj-column>
      <mj-text css-class="mail-footer-text">
        © COPYRIGHT LINAGORA ${year}
      </mj-text>
    </mj-column>
  </mj-section>`
}
