const debug = require("debug")(
  "linto:components:WebServer:controllers:publication:exportPolicy",
)

const saas = require(`${process.cwd()}/lib/saas`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const { SaasFeatureLocked } = require(
  `${process.cwd()}/components/WebServer/error/exception/saas`,
)

const FOOTER_NOTE = "Généré avec LinTO Studio · linto.ai"
const EDITABLE_FORMATS = new Set(["docx", "html", "odt"])

async function conversationOrgId(conversationId) {
  const conversation = await model.conversations.getById(conversationId)
  const orgId = conversation?.[0]?.organization?.organizationId
  return orgId ? String(orgId) : null
}

/**
 * SaaS rules for a file export of an AI report, decided by the plan of the
 * organization that owns the conversation. Throws 403 for an editable format
 * or a non-system template off plan, returns the gateway params that lock and
 * mark the PDF otherwise. No-op without the SaaS plugin.
 */
async function exportRestrictions({
  conversationId,
  userId,
  format,
  templateScope,
}) {
  if (!saas.enabled()) return {}
  const orgId = await conversationOrgId(conversationId)
  if (!orgId) {
    throw new SaasFeatureLocked("No organization to gate against", {
      reason: "no_org",
      capability: "publication.docx_export",
    })
  }
  if (EDITABLE_FORMATS.has(format)) {
    await saas.enforce({
      orgId,
      capability: "publication.docx_export",
      userId,
    })
  }
  if (templateScope && templateScope !== "system") {
    await saas.enforce({
      orgId,
      capability: "publication.custom_templates",
      userId,
    })
  }
  if (format !== "pdf") return {}
  const unlocked = await saas.allowed({
    orgId,
    capability: "publication.docx_export",
    userId,
  })
  return unlocked ? {} : { pdf_lock: "true", pdf_footer_note: FOOTER_NOTE }
}

module.exports = { exportRestrictions, FOOTER_NOTE }
