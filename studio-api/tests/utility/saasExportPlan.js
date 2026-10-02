const { SaasFeatureLocked } = require(
  `${process.cwd()}/components/WebServer/error/exception/saas`,
)

const FOOTER_NOTE = "footer note of the plan"

const locked = (capability, reason = "feature_disabled") =>
  new SaasFeatureLocked(`Not on your plan: ${capability}`, {
    reason,
    capability,
  })

// Stands in for the plugin's export verdict on a free plan (its rules are
// tested in the plugin): editable formats and custom templates refused, PDF
// marked.
function freeExportPlan(mockSaas) {
  mockSaas.enabled.mockReturnValue(true)
  mockSaas.decide.mockImplementation(
    async (point, { orgId, format, templateScope }) => {
      if (!orgId) throw locked("publication.docx_export", "no_org")
      if (["docx", "html", "odt"].includes(format))
        throw locked("publication.docx_export")
      if (templateScope && templateScope !== "system")
        throw locked("publication.custom_templates")
      return {
        allowed: true,
        pdfFooterNote: format === "pdf" ? FOOTER_NOTE : null,
      }
    },
  )
}

module.exports = { FOOTER_NOTE, locked, freeExportPlan }
