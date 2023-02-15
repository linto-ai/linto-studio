const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:conversation:utility')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const { ConversationError } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)
const { OrganizationNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function getUserConversation(userId) {
    try {
        const convList = []
        const convShare = await model.conversation.getByShare(userId)
        for (let conversation of convShare) {
            // User may have a right to see the conversation from sharedWithUsers
            if (conversation.sharedWithUsers.filter(user => user.userId === userId &&
                CONVERSATION_RIGHTS.hasRightAccess(user.right, CONVERSATION_RIGHTS.READ)).length !== 0) {
                convList.push(conversation)
            }
        }

        const userOrga = await model.organization.listSelf(userId)
        for (let orga of userOrga) {
            const convOrga = await model.conversation.getByOrga(orga._id)

            const userRole = orga.users.filter(user => user.userId === userId)
            for (let conversation of convOrga) {
                if (ORGANIZATION_ROLES.hasRoleAccess(userRole[0].role, ORGANIZATION_ROLES.MAINTAINER)) {
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

        return convList
    } catch (err) {
        throw new ConversationError(err)
    }
}

async function getUserRightFromConversation(userId, conversation) {
    try {
        const orgaId = conversation.organization.organizationId
        const organization = await model.organization.getById(orgaId)
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
            if (conversationRight) access.right = parseInt(conversationRight.right)
        }

        return access
    } catch (err) {
        throw err
    }
}

async function getUserRightFromConversationList(userId, conversations) {
    for (let conv of conversations) {
        const data = await getUserRightFromConversation(userId, conv)
        conv.userAccess = data
    }
    return conversations
}


async function textInConversation(text, conversationId) {
    const conversation = (await model.conversation.getById(conversationId))[0]
    for (const turn of conversation.text) {
        if (turn.raw_segment.toLowerCase().includes(text.toLowerCase())) {
            return true
        }
    }
    return false
}


module.exports = { getUserConversation, getUserRightFromConversation, getUserRightFromConversationList, textInConversation }