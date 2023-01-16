const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:user:utility')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const organizationsModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const { UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/users`)

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

async function getUsersListByConversation(userId, conversation, organiaztion) {
    try {
        let isShare = false
        let sharedById = undefined
        let sharedByAdded = false

        const organizationUsers = organiaztion.users
        const convoMembersRight = conversation.organization.membersRight
        const convoCustomRights = conversation.organization.customRights
        const sharedWithUsers = conversation.sharedWithUsers
        let external_members = []
        let organization_members = []
        
        const myUserInfo = await userModel.getUserById(userId)
        // external users (shared with users)
        for (const swUser of sharedWithUsers) {
            if (swUser.userId === userId) {
                isShare = true
                sharedById = swUser.sharedBy
            }
            const userInfo = await userModel.getUserById(swUser.userId)
            if(userInfo.length > 0) {
              if(userInfo.length === 1) {
                const userOrga = await organizationsModel.getOrganizationByName(userInfo[0].email)
                
                if (userOrga[0].type === 'public' || userOrga[0].name === myUserInfo[0].email) {
                    if (swUser.userId === sharedById) {
                        sharedByAdded = true
                    }
                    external_members.push({
                        ...userInfo[0],
                        role: 0,
                        right: swUser.right
                    })
                }
              } else throw new UserNotFound()
            }
        }

        if (sharedById && !sharedByAdded) {
            for (const swUser of sharedWithUsers) {
                if (swUser.userId === sharedById) {
                    sharedByAdded = true
                    const userInfo = await userModel.getUserById(swUser.userId)
                    external_members.push({
                        ...userInfo[0],
                        role: 0,
                        right: swUser.right
                    })
                }
            }
        }

        //  organization members default rights
        if (organiaztion.type === 'public' || (organiaztion.type === 'private' && isShare === false)) {
            for (const oUser of organizationUsers) {
                if (oUser.userId !== sharedById && (isShare && oUser.visibility === 'private')) {
                    continue
                }

                const userInfo = await userModel.getUserById(oUser.userId)
                let userObj = {
                    ...userInfo[0],
                    role: oUser.role
                }
                if (oUser.userId === conversation.owner) {
                    userObj.right = CONVERSATION_RIGHTS.adminRight()
                } else if (userObj.role === 3) {
                    userObj.right = CONVERSATION_RIGHTS.adminRight()
                } else if (userObj.role === 2) {
                    userObj.right = CONVERSATION_RIGHTS.maintainerRight()
                } else {
                    userObj.right = convoMembersRight
                }
                organization_members.push(userObj)
            }
        } else if (sharedByAdded === false) {
            const userInfo = await userModel.getUserById(sharedById)
            organization_members.push(userInfo[0])
        }

        // organization members custom rights
        for (const oUser of convoCustomRights) {
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
    const user = await userModel.getUserByEmail(email)
    if (user.length !== 1) throw new UserNotFound()

    return {
        ...user[0],
        userId: user[0]._id.toString()
    }
}

module.exports = { getUsersConversationByArray, getUsersListByConversation, getUser }