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
      if (oUser.type === USER_TYPE.M2M) continue
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

module.exports = { getUsersListByConversation, removeUserFromPlatform }
