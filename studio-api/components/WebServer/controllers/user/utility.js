const logger = require(`${process.cwd()}/lib/logger/logger`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)

const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)

const { cascadeDeleteSampleFiles } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const orgaUtility = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const triggers = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
)

async function getUsersListByConversation(userId, conversation, organiaztion) {
  try {
    let isShare = false
    let sharedUser = undefined

    let external_members = []
    let organization_members = []

    for (const swUser of conversation.sharedWithUsers) {
      if (swUser.userId === userId) {
        isShare = true
        sharedUser = swUser
      }
    }

    for (const swUser of conversation.sharedWithUsers) {
      let user = await model.users.getById(swUser.userId)
      if (user.length !== 1) {
        logger.info("User not found", { userId: swUser.userId })
      } else {
        if (
          isShare &&
          (!user.private ||
            CONVERSATION_RIGHTS.hasRightAccess(
              sharedUser.right,
              CONVERSATION_RIGHTS.SHARE,
            ))
        ) {
          external_members.push({ ...user[0], role: 0, right: swUser.right })
        } else if (!isShare) {
          external_members.push({ ...user[0], role: 0, right: swUser.right })
        }
      }
    }

    for (const oUser of organiaztion.users) {
      let user = await model.users.getById(oUser.userId)
      if (user.length !== 1) {
        logger.info("User not found", { userId: oUser.userId })
      } else {
        if (
          isShare &&
          CONVERSATION_RIGHTS.hasRightAccess(
            sharedUser.right,
            CONVERSATION_RIGHTS.SHARE,
          )
        ) {
          organization_members.push({
            ...user[0],
            role: oUser.role,
            right: CONVERSATION_RIGHTS.setRight(
              oUser.role,
              conversation.organization.membersRight,
            ),
          })
        } else if (!isShare) {
          organization_members.push({
            ...user[0],
            role: oUser.role,
            right: CONVERSATION_RIGHTS.setRight(
              oUser.role,
              conversation.organization.membersRight,
            ),
          })
        }
      }
    }

    for (const oUser of conversation.organization.customRights) {
      let orgaUser = organization_members.find(
        (u) => u._id.toString() === oUser.userId,
      )
      if (orgaUser) orgaUser.right = oUser.right
    }

    return {
      external_members,
      organization_members,
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

async function removeUserFromPlatform(userId) {
  const conversations = await model.conversations.getByShare(userId)
  if (conversations instanceof Error) throw conversations

  await Promise.all(
    conversations.map(async (conversation) => {
      conversation.sharedWithUsers = conversation.sharedWithUsers.filter(
        (user) => user.userId !== userId,
      )

      const resultConvoUpdate = await model.conversations.update(conversation)
      if (resultConvoUpdate instanceof Error) throw resultConvoUpdate
      if (resultConvoUpdate.matchedCount === 0) throw new UserError()
    }),
  )

  const organizations = await model.organizations.listSelf(userId)
  if (organizations instanceof Error) throw organizations

  await Promise.all(
    organizations.map(async (organization) => {
      const data = orgaUtility.countAdmin(organization, userId)
      if (data.adminCount === 1 && data.isAdmin) {
        await orgaUtility.deleteOrganizationCascade(organization._id.toString())
      } else if (data.adminCount > 1 || !data.isAdmin) {
        organization.users = organization.users.filter(
          (user) => user.userId !== userId,
        )
        let resultOperation = await model.organizations.update(organization)
        if (resultOperation instanceof Error) throw resultOperation
        if (resultOperation.matchedCount === 0) throw new UserError()
      }
    }),
  )

  // RGPD cascade. Opt-ins are read before deletion: they list the Qdrant
  // collections still holding the user's point.
  const [samples, optIns] = await Promise.all([
    model.voiceSamples.getByUserId(userId),
    model.voiceOptIns.getByUserId(userId),
  ])
  if (samples instanceof Error) throw samples
  if (optIns instanceof Error) throw optIns
  cascadeDeleteSampleFiles(samples)
  const [samplesDeletion, optInsDeletion, voiceprintsDeletion] =
    await Promise.all([
      model.voiceSamples.deleteAllFromUser(userId),
      model.voiceOptIns.deleteAllFromUser(userId),
      model.voiceprints.deleteAllFromUser(userId),
    ])
  if (samplesDeletion instanceof Error) throw samplesDeletion
  if (optInsDeletion instanceof Error) throw optInsDeletion
  if (voiceprintsDeletion instanceof Error) throw voiceprintsDeletion
  // Fire-and-forget, queued on failure
  triggers.removeUserEverywhere(userId, optIns)
}

module.exports = { getUsersListByConversation, removeUserFromPlatform }
