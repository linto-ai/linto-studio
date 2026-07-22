const model = require(`${process.cwd()}/lib/mongodb/models`)

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
  const categories = await model.categories.getByScope(scopeId)
  if (categories instanceof Error) throw categories

  await Promise.all(
    categories.map(async (category) => {
      const tagsResult = await model.tags.deleteAllFromCategory(
        category._id.toString(),
      )
      if (tagsResult instanceof Error) throw tagsResult
      const categoryResult = await model.categories.delete(category._id)
      if (categoryResult instanceof Error) throw categoryResult
    }),
  )
}

// Audio file, record, subtitles, then scoped categories and tags
async function deleteConversationCascade(conversation) {
  if (conversation.metadata?.audio?.filepath) {
    await deleteAudioFileIfOrphaned(conversation.metadata.audio.filepath)
  }

  const resultConvo = await model.conversations.delete(conversation._id)
  if (resultConvo instanceof Error) throw resultConvo
  if (resultConvo.deletedCount !== 1)
    throw new ConversationError("Error when deleting conversation")

  const subtitlesResult = await model.conversationSubtitles.deleteAllFromConv(
    conversation._id.toString(),
  )
  if (subtitlesResult instanceof Error) throw subtitlesResult

  await deleteCategoriesFromScope(conversation._id.toString())
}

// Deletion order matters: media, taxonomy, organization-scoped speaker
// identification, then the organization record
async function deleteOrganizationCascade(organizationId) {
  const conversations = await model.conversations.getByOrga(organizationId)
  if (conversations instanceof Error) throw conversations

  await Promise.all(
    conversations.map((conversation) =>
      deleteConversationCascade(conversation),
    ),
  )

  // Sweeps subtitles of conversations getByOrga does not return
  const subtitlesResult =
    await model.conversationSubtitles.deleteAllFromOrga(organizationId)
  if (subtitlesResult instanceof Error) throw subtitlesResult

  await deleteCategoriesFromScope(organizationId)

  const [orgSamples, orgCollections, orgLabels] = await Promise.all([
    model.voiceSamples.getByOrganizationId(organizationId),
    model.voiceprintCollections.getByOrganizationId(organizationId),
    model.speakerLabels.getByOrganizationId(organizationId),
  ])
  if (orgSamples instanceof Error) throw orgSamples
  if (orgCollections instanceof Error) throw orgCollections
  if (orgLabels instanceof Error) throw orgLabels
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
  for (const result of speakerIdResults) {
    if (result instanceof Error) throw result
  }

  const resultOrga = await model.organizations.delete(organizationId)
  if (resultOrga instanceof Error) throw resultOrga
  if (resultOrga.deletedCount !== 1)
    throw new OrganizationError("Error when deleting organization")
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
