const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:user:utility')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)

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
                console.log('User not found', swUser.userId)
            } else {
                if (isShare && (!user.private || CONVERSATION_RIGHTS.hasRightAccess(sharedUser.right, CONVERSATION_RIGHTS.SHARE))) {
                    external_members.push({ ...user[0], role: 0, right: swUser.right })
                } else if (!isShare) {
                    external_members.push({ ...user[0], role: 0, right: swUser.right })
                }
            }
        }

        for (const oUser of organiaztion.users) {
            let user = await model.users.getById(oUser.userId)
            if (user.length !== 1) {
                console.log('User not found', oUser.userId)
            } else {
                if (isShare && CONVERSATION_RIGHTS.hasRightAccess(sharedUser.right, CONVERSATION_RIGHTS.SHARE)) {
                    organization_members.push({ ...user[0], role: oUser.role, right: CONVERSATION_RIGHTS.setRight(oUser.role, conversation.organization.membersRight) })
                } else if (!isShare) {
                    organization_members.push({ ...user[0], role: oUser.role, right: CONVERSATION_RIGHTS.setRight(oUser.role, conversation.organization.membersRight) })
                }
            }
        }

        for (const oUser of conversation.organization.customRights) {
            let orgaUser = organization_members.find(u => u._id.toString() === oUser.userId)
            if (orgaUser) orgaUser.right = oUser.right
        }

        return {
            external_members,
            organization_members
        }
    } catch (error) {
        console.error(error)
        return error
    }
}

module.exports = { getUsersListByConversation }