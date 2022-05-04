const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:conversation:utility')
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/rights/conversation`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

const { ConversationError } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function getUserConversation(userId) {
  try {
    const convList = []
    const conversations = await conversationModel.getAllConvos()
    for (let conversation of conversations) {
      // User is owner
      if (conversation.owner === userId) convList.push(conversation)
      // User may have a right to see the conversation from sharedWithUsers

      else if (conversation.sharedWithUsers.filter(user => user.userId === userId &&
        CONVERSATION_RIGHTS.hasRightAccess(user.right, CONVERSATION_RIGHTS.READ)).length !== 0) {
        convList.push(conversation)
      }
      // User may have a right from the conversation organization

      else {
        const organization = await organizationModel.getOrganizationById(conversation.organization.organizationId)
        const userInOgra = organization[0].users.filter(user => user.userId === userId)
        if (userInOgra.length === 1) {
          if (ORGANIZATION_ROLES.hasRoleAccess(userInOgra[0].role, ORGANIZATION_ROLES.MAINTAINER)) {
            convList.push(conversation)
          } else if (CONVERSATION_RIGHTS.hasRightAccess(conversation.organization.membersRight, CONVERSATION_RIGHTS.READ)) {
            convList.push(conversation)
          } else {
            conversation.organization.customRights.map(orgaUser => {
              if (orgaUser.userId === userId && CONVERSATION_RIGHTS.hasRightAccess(orgaUser.right, CONVERSATION_RIGHTS.READ))
                convList.push(conversation)
            })
          }
        }
      }
    }
    return convList
  } catch (err) {
    throw new ConversationError(err)
  }
}

async function getOrgaConversation(orgaId) {
  const conversations = await conversationModel.getAllConvos()
  return conversations.filter(conv => conv.organization.organizationId.toString() === orgaId)
}

module.exports = { getUserConversation, getOrgaConversation }