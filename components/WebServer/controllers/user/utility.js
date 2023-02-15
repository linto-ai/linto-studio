const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:user:utility')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const { UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/users`)

// Deprecated function
async function getUsersConversationByArray(users, setupRight) {
    try {
        let members = []
        if (!users) return []
        for (let user of users) {
            const u = await model.user.getById(user.userId)
            if (u && u.length !== 1) {
                members.push(u)
            } else {
                let myUser = {
                    ...u[0],
                    right: user.right,
                    visibility: user.visibility
                }
                if (user.right) myUser.right = user.right
                if (user.role) {
                    if (user.role === ORGANIZATION_ROLES.ADMIN) myUser.right = CONVERSATION_RIGHTS.adminRight()
                    if (user.role === ORGANIZATION_ROLES.MAINTAINER) myUser.right = CONVERSATION_RIGHTS.maintainerRight()
                    if (user.role === ORGANIZATION_ROLES.MEMBER) {
                        myUser.right = (setupRight) ? setupRight : user.right
                    }
                    myUser.role = user.role
                }
                members.push(myUser)
            }
        }
        return members
    } catch (err) {
        throw err
    }

}

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
            let user = await model.user.getById(swUser.userId)
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
            let user = await model.user.getById(oUser.userId)
            if (user.length !== 1) {
                console.log('User not found', oUser.userId)
            } else {
                if (isShare && CONVERSATION_RIGHTS.hasRightAccess(sharedUser.right, CONVERSATION_RIGHTS.SHARE)) {
                    organization_members.push({ ...user[0], role: oUser.role, right: CONVERSATION_RIGHTS.setRight(oUser.role) })
                } else if (!isShare) {
                    organization_members.push({ ...user[0], role: oUser.role, right: CONVERSATION_RIGHTS.setRight(oUser.role) })
                }
            }
        }

        for (const oUser of conversation.organization.customRights) {
            let orgaUser = organization_members.find(u => u._id.toString() === oUser.userId)
            orgaUser.right = oUser.right
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

async function getUser(email) {
    const user = await model.user.getByEmail(email)
    if (user.length !== 1) throw new UserNotFound()

    return {
        ...user[0],
        userId: user[0]._id.toString()
    }
}

module.exports = { getUsersConversationByArray, getUsersListByConversation, getUser }