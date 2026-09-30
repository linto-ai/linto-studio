const saas = require(`${process.cwd()}/lib/saas`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

async function conversationOrgId(conversationId) {
  const conversation = await model.conversations.getById(conversationId)
  const orgId = conversation?.[0]?.organization?.organizationId
  return orgId ? String(orgId) : null
}

/**
 * What the SaaS plan imposes on a file export of an AI report, decided by the
 * plugin on the organization that owns the conversation: a refusal (403), or
 * the gateway params of a locked, marked PDF. No-op without the plugin.
 */
async function exportRestrictions({
  conversationId,
  userId,
  format,
  templateScope,
}) {
  if (!saas.enabled()) return {}
  const policy = await saas.decide("publicationExport", {
    orgId: await conversationOrgId(conversationId),
    userId,
    format,
    templateScope,
  })
  if (!policy.pdfFooterNote) return {}
  return { pdf_lock: "true", pdf_footer_note: policy.pdfFooterNote }
}

module.exports = { exportRestrictions }
