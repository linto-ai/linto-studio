const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:user:utility')
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/rights/conversation`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

async function getUsersConversationByArary(users, setupRight) {
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
          visibility: u.visibility
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

module.exports = { getUsersConversationByArary }