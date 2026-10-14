const BRAND_COLOR = "#11977c"

module.exports = function () {
  return `
    <mj-attributes>
      <mj-button background-color="${BRAND_COLOR}" color="#ffffff" font-size="16px" border-radius="4px" align="left" />
    </mj-attributes>
    <mj-style>
      .mail-header {
        background-color: #f0f0f0;
      }
      .mail-header-text div {
        font-size: 24px !important;
        color: #626262;
        text-align: center !important;
      }
      .mail-footer {
        background-color: ${BRAND_COLOR};
      }
      .mail-footer-text div {
        color: #ffffff !important;
        font-size: 16px !important;
        text-align: center !important;
        font-weight: bold !important;
      }
    </mj-style>
  `
}
