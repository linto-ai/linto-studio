const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:conversation:utility')
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const { ConversationError } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)
const { OrganizationNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

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

async function getUserRightFromConversation(userId, conversation) {
    try {
        const organization = await organizationModel.getOrganizationById(conversation.organization.organizationId)
        if (organization.length !== 1) throw new OrganizationNotFound()

        const orgaRole = organization[0].users.filter(user => user.userId === userId)[0]

        let access = {
            role: (orgaRole) ? orgaRole.role : 0,
            right: conversation.organization.membersRight
        }

        if (ORGANIZATION_ROLES.hasRoleAccess(access.role, ORGANIZATION_ROLES.ADMIN)) {
            access.right = CONVERSATION_RIGHTS.adminRight()
        } else if (ORGANIZATION_ROLES.hasRoleAccess(access.role, ORGANIZATION_ROLES.MAINTAINER)) {
            access.right = CONVERSATION_RIGHTS.maintainerRight()
        } else if (ORGANIZATION_ROLES.hasRoleAccess(access.role, ORGANIZATION_ROLES.MEMBER) ||
            ORGANIZATION_ROLES.hasRoleAccess(access.role, ORGANIZATION_ROLES.MAINTAINER)) {
            const organizationRight = conversation.organization.customRights.filter(user => user.userId === userId)[0]
            if (organizationRight) access.right = organizationRight.right
        } else {
            const conversationRight = conversation.sharedWithUsers.filter(user => user.userId === userId)[0]
            if (conversationRight) access.right = conversationRight.right
        }

        // If owner of the conversation > admin rights
        if(conversation.owner === userId) access.right = CONVERSATION_RIGHTS.adminRight()

        return {
            access,
            personal: organization[0].personal
        }
    } catch (err) {
        throw err
    }
}


async function textInConversation (text, conversationId) {
  const conversation = (await conversationModel.getConvoById(conversationId))[0]
  for (const turn of conversation.text) {
    if (turn.raw_segment.toLowerCase().includes(text.toLowerCase())) {
      return true
    }
  }
  return false
}


module.exports = { getUserConversation, getUserRightFromConversation, textInConversation }