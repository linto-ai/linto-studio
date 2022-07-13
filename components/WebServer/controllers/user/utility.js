const { cp } = require('fs')
const { off } = require('process')

const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:user:utility')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/rights/conversation`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

// Deprecated function
async function getUsersConversationByArray(users, setupRight) {
    try {
        let members = []
        if (!users) return []
        for (let user of users) {
            const u = await userModel.getUserById(user.userId)
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

async function getUsersListByConversation(conversation, organiaztion) {
    try {
        let organizationUsers = organiaztion.users
        let convoMembersRight = conversation.organization.membersRight
        let convoCustomRights = conversation.organization.customRights
        let sharedWithUsers = conversation.sharedWithUsers
        let external_members = []
        let organization_members = []

        //  organization members default rights
        for (let oUser of organizationUsers) {
            let userInfo = await userModel.getUserById(oUser.userId)
            let userObj = {
                ...userInfo[0],
                role: oUser.role,
                visibility: oUser.visibility
            }
            if (userObj.role === 3) userObj.right = CONVERSATION_RIGHTS.adminRight()
            else if (userObj.role === 2) userObj.right = CONVERSATION_RIGHTS.maintainerRight()
            else userObj.right = convoMembersRight
            organization_members.push(userObj)
        }
        // organization members custom rights
        if (convoCustomRights.length > 0) {
            for (let oUser of convoCustomRights) {
                let orgaUser = organization_members.find(u => u._id.toString() === oUser.userId)
                orgaUser.right = oUser.right
            }
        }

        // external users (shared with users)
        if (sharedWithUsers.length > 0) {
            for (let swUser of sharedWithUsers) {
                let userInfo = await userModel.getUserById(swUser.userId)
                let userObj = {
                    ...userInfo[0],
                    role: 0,
                    right: swUser.right,
                    visibility: 'public'
                }
                external_members.push(userObj)
            }
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

module.exports = { getUsersConversationByArray, getUsersListByConversation }