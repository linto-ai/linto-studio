const logger = require(`${process.cwd()}/lib/logger/logger`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const saas = require(`${process.cwd()}/lib/saas`)

const { OrganizationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const { ConversationError, ConversationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

const { deleteAudioFileIfOrphaned, cascadeDeleteSampleFiles } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const triggers = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
)

const RIGHT = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

function countAdmin(organization, userId) {
  let adminCount = 0
  let isAdmin = false
  let otherAdmin = []
  for (let oUser of organization.users) {
    if (oUser.role === ROLES.ADMIN) {
      adminCount++
      if (oUser.userId === userId) isAdmin = true
      else otherAdmin.push(oUser.userId)
    }
  }

  return {
    userCount: organization.users.length,
    adminCount,
    isAdmin,
    otherAdmin,
  }
}

async function deleteCategoriesFromScope(scopeId) {
  const categories = throwIfError(await model.categories.getByScope(scopeId))

  await Promise.all(
    categories.map(async (category) => {
      const results = await Promise.all([
        model.tags.deleteAllFromCategory(category._id.toString()),
        model.categories.delete(category._id),
      ])
      results.forEach(throwIfError)
    }),
  )
}

// Audio file, record, subtitles, then scoped categories and tags
async function deleteConversationCascade(conversation) {
  if (conversation.metadata?.audio?.filepath) {
    await deleteAudioFileIfOrphaned(conversation.metadata.audio.filepath)
  }

  const resultConvo = throwIfError(
    await model.conversations.delete(conversation._id),
  )
  if (resultConvo.deletedCount !== 1)
    throw new ConversationError("Error when deleting conversation")

  throwIfError(
    await model.conversationSubtitles.deleteAllFromConv(
      conversation._id.toString(),
    ),
  )

  await deleteCategoriesFromScope(conversation._id.toString())
}

// Deletion order matters: media, taxonomy, organization-scoped speaker
// identification, then the organization record
async function deleteOrganizationCascade(organizationId) {
  const conversations = throwIfError(
    await model.conversations.getByOrga(organizationId),
  )

  await Promise.all(
    conversations.map((conversation) =>
      deleteConversationCascade(conversation),
    ),
  )

  // Sweeps subtitles of conversations getByOrga does not return
  throwIfError(
    await model.conversationSubtitles.deleteAllFromOrga(organizationId),
  )

  await deleteCategoriesFromScope(organizationId)

  const [orgSamples, orgCollections, orgLabels] = (
    await Promise.all([
      model.voiceSamples.getByOrganizationId(organizationId),
      model.voiceprintCollections.getByOrganizationId(organizationId),
      model.speakerLabels.getByOrganizationId(organizationId),
    ])
  ).map(throwIfError)
  cascadeDeleteSampleFiles(orgSamples)

  // Must run before the Mongo deletes below remove collections and labels
  await triggers.dropOrganizationSpeakers(
    organizationId,
    orgCollections,
    orgLabels,
  )

  const speakerIdResults = await Promise.all([
    model.voiceSamples.deleteAllFromOrganization(organizationId),
    model.speakerLabels.deleteAllFromOrganization(organizationId),
    model.voiceprintCollections.deleteAllFromOrganization(organizationId),
    model.voiceOptIns.deleteAllFromOrganization(organizationId),
    model.speakerIdSyncOps.deleteAllFromOrganization(organizationId),
  ])
  speakerIdResults.forEach(throwIfError)

  const resultOrga = throwIfError(
    await model.organizations.delete(organizationId),
  )
  if (resultOrga.deletedCount !== 1)
    throw new OrganizationError("Error when deleting organization")

  // RGPD cascade into the SaaS plugin. Every org-deletion path goes through this
  // helper, so this is the single purge point. Fail-soft: the org delete has
  // already committed, a billing/log purge failure must not turn it into a 500.
  // NO-OP in the OSS build.
  const purge = await saas.purgeOrganization(organizationId)
  // A non-clean purge can leave a still-billable Stripe subscription attached to
  // a now-deleted org, so surface it above debug for manual reconciliation.
  if (purge && Array.isArray(purge.errors) && purge.errors.length) {
    logger.error(
      `[saas] org ${organizationId} purge had errors (manual reconciliation may be needed): ${JSON.stringify(purge.errors)}`,
    )
  }
  try {
    await model.activityLog.deleteByOrganization(organizationId)
  } catch (e) {
    logger.error(
      `activityLog.deleteByOrganization failed for ${organizationId}: ${e && e.message}`,
    )
  }
}

async function getUserConversationFromOrganization(
  userId,
  organizationId,
  options = {},
) {
  const organization = (
    await model.organizations.getByIdAndUser(organizationId, userId, {
      bypass: options.backofficeAccess,
    })
  )[0]
  if (!organization)
    throw new OrganizationError("You are not part of this organization")

  const userRole = ROLES.getUserRoleInOrg(organization, userId, {
    backofficeAccess: options.backofficeAccess,
  })
  const projection = {
    speakers: 0,
    keywords: 0,
    highlights: 0,
  }
  const conversations = await model.conversations.getByOrga(
    organizationId,
    projection,
  )

  let listConv = conversations
    .filter((conv) => {
      let access = conv.organization.customRights.find(
        (customRight) => customRight.userId === userId,
      )
      if (access && RIGHT.hasRightAccess(access.right, RIGHT.READ)) {
        return conv
      } else if (!access && ROLES.hasRoleAccess(userRole, ROLES.MAINTAINER)) {
        return conv
      } else if (
        RIGHT.hasRightAccess(conv.organization.membersRight, RIGHT.READ)
      ) {
        return conv
      }
    })
    .filter((conv) => conv !== undefined)

  return listConv
}

async function getOrgaIdFromReq(req) {
  let organizationId = req.params.organizationId

  if (organizationId === undefined) {
    const conversation = await model.conversations.getById(
      req.params.conversationId,
    )
    if (conversation.length !== 1) throw new ConversationNotFound()

    organizationId = conversation[0].organization.organizationId
  }

  return organizationId
}

// Add user to all organization with the same email domain
async function populateUserToOrganization(user, role = ROLES.MEMBER) {
  const matchingMail = "@" + user.email.split("@")[1]

  const organizations = await model.organizations.getAll({
    matchingMail: matchingMail,
  })
  organizations.list.forEach(async (organization) => {
    if (
      organization.users.filter((u) => u.userId === user._id.toString())
        .length === 0
    ) {
      let orgaCopy = JSON.parse(JSON.stringify(organization))
      orgaCopy.users.push({ userId: user._id.toString(), role: role })
      await model.organizations.update(orgaCopy)
    }
  })
}

async function addM2mUserToOrganization(orgaId, m2m_id, role = ROLES.MEMBER) {
  const organizations = (await model.organizations.getById(orgaId))[0]
  organizations.users.push({
    userId: m2m_id.toString(),
    role: role,
    type: USER_TYPE.M2M,
  })
  await model.organizations.update(organizations)
}

module.exports = {
  getOrgaIdFromReq,
  countAdmin,
  deleteCategoriesFromScope,
  deleteConversationCascade,
  deleteOrganizationCascade,
  getUserConversationFromOrganization,
  populateUserToOrganization,
  addM2mUserToOrganization,
}
