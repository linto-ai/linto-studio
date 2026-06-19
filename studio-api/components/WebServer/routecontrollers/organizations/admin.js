const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:admin",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { deleteAudioFileIfOrphaned } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const { OrganizationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { ConversationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

const saas = require(`${process.cwd()}/lib/saas`)

async function updateOrganization(req, res, next) {
  try {
    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0)
      throw new OrganizationError("Organization not found")
    organization = organization[0]

    if (req.body.token) organization.token = req.body.token
    if (req.body.description) organization.description = req.body.description
    if (req.body.name) organization.name = req.body.name

    const result = await model.organizations.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send({
      message: "Organization has been updated",
    })
  } catch (err) {
    next(err)
  }
}

async function deleteOrganization(req, res, next) {
  try {
    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0)
      throw new OrganizationError("Organization not found")
    organization = organization[0]

    let lconv = await model.conversations.getByOrga(req.params.organizationId)
    lconv.map(async (conv) => {
      const result = await model.conversations.delete(conv._id)
      if (result.deletedCount !== 1)
        throw new ConversationError(
          "Error while deleting conversation from organization",
        )

      if (conv?.metadata?.audio) {
        await deleteAudioFileIfOrphaned(conv.metadata.audio.filepath)
      }
    })
    //delete all subtitle from that organization
    await model.conversationSubtitles.deleteAllFromOrga(
      organization._id.toString(),
    )

    const result = await model.organizations.delete(organization._id.toString())
    if (result.deletedCount !== 1)
      throw new OrganizationError("Error when deleting organization")

    // RGPD cascade (SaaS only; NO-OP in OSS build). Fail-soft: a billing/log
    // purge failure must not abort an org deletion that already committed.
    const orgIdStr = organization._id.toString()
    const purge = await saas.purgeOrganization(orgIdStr)
    if (purge) {
      debug("saas purge org %s: %o", orgIdStr, purge)
      // Surface a non-clean purge (e.g. a Stripe cancel that failed -> a possibly
      // still-billable subscription for a now-deleted org) above debug level so
      // an operator can reconcile it; the org delete itself already committed.
      if (Array.isArray(purge.errors) && purge.errors.length) {
        console.error(
          `[saas] org ${orgIdStr} purge had errors (manual reconciliation may be needed):`,
          purge.errors,
        )
      }
    }
    try {
      await model.activityLog.deleteByOrganization(orgIdStr)
    } catch (e) {
      debug("activityLog.deleteByOrganization failed:", e && e.message)
    }

    res.status(200).send({
      message: "Organization has been deleted",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  updateOrganization,
  deleteOrganization,
}
