const logger = require(`${process.cwd()}/lib/logger/logger`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

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

const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

const saas = require(`${process.cwd()}/lib/saas`)

// Users listed for one conversation
async function getUsersListByConversation(userId, conversation, organization) {
  const result = await getUsersListByConversations(userId, [
    { conversation, organization },
  ])
  if (result instanceof Error) return result
  return result[0]
}

// Users listed for several conversations, one users query for all of them
async function getUsersListByConversations(userId, items) {
  try {
    const usersById = await loadUsersById(
      items.flatMap(({ conversation, organization }) =>
        listedUserIds(conversation, organization),
      ),
    )
    return items.map(({ conversation, organization }) =>
      conversationUsers(userId, conversation, organization, usersById),
    )
  } catch (error) {
    console.error(error)
    return error
  }
}

function listedUserIds(conversation, organization) {
  const shared = conversation.sharedWithUsers.map((share) => share.userId)
  const members = organization.users
    .filter((member) => member.type !== USER_TYPE.M2M)
    .map((member) => member.userId)
  return [...shared, ...members]
}

async function loadUsersById(userIds) {
  const ids = [...new Set(userIds)]
  if (ids.length === 0) return new Map()
  const users = throwIfError(await model.users.getByIds(ids))
  return new Map(users.map((user) => [user._id.toString(), user]))
}

function conversationUsers(userId, conversation, organization, usersById) {
  const share = conversation.sharedWithUsers.find(
    (swUser) => swUser.userId === userId,
  )
  // Members are listed to organization members and to shares holding the share right
  const listMembers =
    !share ||
    CONVERSATION_RIGHTS.hasRightAccess(share.right, CONVERSATION_RIGHTS.SHARE)
  const customRightById = new Map(
    conversation.organization.customRights.map((customRight) => [
      customRight.userId,
      customRight.right,
    ]),
  )

  const external_members = []
  for (const swUser of conversation.sharedWithUsers) {
    const user = usersById.get(swUser.userId)
    if (!user) {
      logger.info("User not found", { userId: swUser.userId })
    } else {
      external_members.push({ ...user, role: 0, right: swUser.right })
    }
  }

  const organization_members = []
  for (const oUser of organization.users) {
    if (oUser.type === USER_TYPE.M2M) continue
    const user = usersById.get(oUser.userId)
    if (!user) {
      logger.info("User not found", { userId: oUser.userId })
    } else if (listMembers) {
      let right = customRightById.get(oUser.userId)
      if (right === undefined) {
        right = CONVERSATION_RIGHTS.setRight(
          oUser.role,
          conversation.organization.membersRight,
        )
      }
      organization_members.push({ ...user, role: oUser.role, right })
    }
  }

  return { external_members, organization_members }
}

async function removeUserFromPlatform(userId) {
  const organizations = throwIfError(await model.organizations.listSelf(userId))
  const lastAdminOf = organizations.filter((organization) => {
    const data = orgaUtility.countAdmin(organization, userId)
    return data.adminCount === 1 && data.isAdmin
  })
  // Billing first: a subscription that cannot be canceled keeps the account whole
  for (const organization of lastAdminOf) {
    await orgaUtility.cancelBilling(organization._id.toString())
  }

  const conversations = throwIfError(
    await model.conversations.getByShare(userId),
  )

  await Promise.all(
    conversations.map(async (conversation) => {
      conversation.sharedWithUsers = conversation.sharedWithUsers.filter(
        (user) => user.userId !== userId,
      )

      const resultConvoUpdate = throwIfError(
        await model.conversations.update(conversation),
      )
      if (resultConvoUpdate.matchedCount === 0) throw new UserError()
    }),
  )

  await Promise.all(
    organizations.map(async (organization) => {
      if (lastAdminOf.includes(organization)) {
        await orgaUtility.deleteOrganizationCascade(organization._id.toString())
      } else {
        organization.users = organization.users.filter(
          (user) => user.userId !== userId,
        )
        const resultOperation = throwIfError(
          await model.organizations.update(organization),
        )
        if (resultOperation.matchedCount === 0) throw new UserError()
      }
    }),
  )

  // RGPD cascade. Opt-ins are read before deletion: they list the Qdrant
  // collections still holding the user's point.
  const [samples, optIns] = (
    await Promise.all([
      model.voiceSamples.getByUserId(userId),
      model.voiceOptIns.getByUserId(userId),
    ])
  ).map(throwIfError)
  cascadeDeleteSampleFiles(samples)
  const deletionResults = await Promise.all([
    model.voiceSamples.deleteAllFromUser(userId),
    model.voiceOptIns.deleteAllFromUser(userId),
    model.voiceprints.deleteAllFromUser(userId),
  ])
  deletionResults.forEach(throwIfError)
  // Fire-and-forget, queued on failure
  triggers.removeUserEverywhere(userId, optIns)

  // Fail-soft erasure: the steps above have already committed, the caller
  // must not think the account survived. No-op in OSS
  try {
    await saas.purgeUser(userId)
  } catch (e) {
    logger.error(`saas.purgeUser failed for ${userId}: ${e && e.message}`)
  }
  try {
    // Anonymize rather than delete: activity rows carry org-level KPIs that
    // must survive a member's departure, only user.id and user.info go
    await model.activityLog.anonymizeByUser(userId)
  } catch (e) {
    logger.error(
      `activityLog.anonymizeByUser failed for ${userId}: ${e && e.message}`,
    )
  }
}

module.exports = {
  getUsersListByConversation,
  getUsersListByConversations,
  removeUserFromPlatform,
}
