const debug = require("debug")(
  "linto:components:WebServer:controllers:user:utility",
)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)

const { deleteAudioFileIfOrphaned } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const orgaUtility = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const saas = require(`${process.cwd()}/lib/saas`)

const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
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
  let outcome = true
  try {
    // Get all conversations shared with the user
    const conversations = await model.conversations.getByShare(userId)

    // Remove the user from the sharedWithUsers array
    await Promise.all(
      conversations.map(async (conversation) => {
        conversation.sharedWithUsers = conversation.sharedWithUsers.filter(
          (user) => user.userId !== userId,
        )

        // Update the conversation
        const resultConvoUpdate = await model.conversations.update(conversation)
        if (resultConvoUpdate.matchedCount === 0) throw new UserError()
      }),
    )

    // Get all organizations the user is part of
    const organizations = await model.organizations.listSelf(userId)
    await Promise.all(
      organizations.map(async (organization) => {
        const data = orgaUtility.countAdmin(organization, userId)
        if (data.adminCount === 1 && data.isAdmin) {
          const conversations = await model.conversations.getByOrga(
            organization._id,
          )
          await Promise.all(
            conversations.map(async (conversation) => {
              if (conversation.metadata?.audio?.filepath) {
                await deleteAudioFileIfOrphaned(
                  conversation.metadata.audio.filepath,
                )
              }

              const resultConvo = await model.conversations.delete(
                conversation._id,
              )
              if (resultConvo.deletedCount !== 1) throw new UserError()
            }),
          )
          // delete orga
          const resultOrga = await model.organizations.delete(organization._id)
          if (resultOrga.deletedCount !== 1) throw new UserError()
          // RGPD cascade for the org being removed (SaaS only; NO-OP in OSS).
          const orgIdStr = organization._id.toString()
          await saas.purgeOrganization(orgIdStr)
          try {
            await model.activityLog.deleteByOrganization(orgIdStr)
          } catch (e) {
            console.error("activityLog.deleteByOrganization failed:", e && e.message)
          }
        } else if (data.adminCount > 1 || !data.isAdmin) {
          organization.users = organization.users.filter(
            (user) => user.userId !== userId,
          )
          let resultOperation = await model.organizations.update(organization)
          if (resultOperation.matchedCount === 0) throw new UserError()
        }
      }),
    )

  } catch (error) {
    console.error(error)
    outcome = error
  }

  // RGPD erasure of the departing user's personal data runs REGARDLESS of the
  // cascade outcome above: a partial media/org failure (or a thrown UserError)
  // must never leave the user's PII behind in the billing ledger or the activity
  // log. Each step is independently fail-soft (SaaS calls are NO-OP in OSS).
  try {
    await saas.purgeUser(userId)
  } catch (e) {
    console.error("saas.purgeUser failed:", e && e.message)
  }
  try {
    // Anonymize rather than hard-delete: activity rows carry org-level KPIs
    // (transcription/session counts) that must survive the member's departure;
    // we strip the personal dimension (user.id + user.info).
    await model.activityLog.anonymizeByUser(userId)
  } catch (e) {
    console.error("activityLog.anonymizeByUser failed:", e && e.message)
  }

  return outcome
}

module.exports = { getUsersListByConversation, removeUserFromPlatform }
