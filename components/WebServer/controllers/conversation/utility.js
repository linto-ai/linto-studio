const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:conversation:utility')
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/rights/conversation`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

const { } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function getUserConversation(userId) {
  const convList = []
  const conversations = await conversationModel.getAllConvos()
  for(let conversation of conversations){
    // User is owner
    if(conversation.owner === userId){
      convList.push(conversation)
    }
    // User have rights to read
    else if(conversation.sharedWithUsers.filter(user => user.userId === userId &&
                CONVERSATION_RIGHTS.hasRightAccess(user.right, CONVERSATION_RIGHTS.READ)).length !== 0)
    {
          convList.push(conversation)
    }
    // If user have role in organization
    else {
      const organization = await organizationModel.getOrganizationById(conversation.organization.organizationId)

      if(organization[0].users.filter(user => user.userId === userId &&
              ORGANIZATION_ROLES.hasRoleAccess(user.role, conversation.organization.role)).length !== 0)
      {
        convList.push(conversation)
      }
    }
  }
  return convList
}

async function getOrgaConversation(orgaId){
  const conversations = await conversationModel.getAllConvos()
  return conversations.filter(conv => conv.organization.organizationId.toString() === orgaId)
}

module.exports = { getUserConversation, getOrgaConversation }