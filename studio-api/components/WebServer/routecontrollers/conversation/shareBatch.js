const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation:share`,
)
const method_delete = "DELETE"

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { updateChildConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/child`,
)

const Mailing = require(`${process.cwd()}/lib/mailer/mailing`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const { ConversationMetadataRequire } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

const { OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)

async function batchShareConversation(req, res, next) {
  try {
    if (!req.body.conversations)
      throw new ConversationMetadataRequire("A conversations ids list is")
    if (!req.body.users)
      throw new ConversationMetadataRequire(
        "A users ids list is with desired rights is require",
      )

    let auth_user = {
      id: req.payload.data.userId,
      role: ROLES.UNDEFINED,
      organizationId: req.body.organizationId,
    }

    let conversations = await model.conversations.getConvsListByIds(
      req.body.conversations.split(","),
      {
        _id: 1,
        text: 0,
        tags: 0,
        speakers: 0,
        metadata: 0,
        jobs: 0,
      },
    )

    const method = req.method
    let users_list = JSON.parse(req.body.users)
    await usersCheck(users_list, method) // Check and handle user creation if needed

    let user_updated = await updateConv(
      conversations,
      method,
      users_list,
      auth_user,
    )

    const sharedBy = await model.users.getById(auth_user.id)
    for (let user of users_list.users) {
      if (user.magicId) {
        Mailing.conversationSharedNewUser(
          user.email,
          req,
          user.magicId,
          sharedBy[0].email,
          req.body.conversations,
        )
        delete user.magicId
      } else {
        Mailing.multipleConversationRight(
          user,
          req,
          sharedBy[0].email,
          user.conversations,
        )
      }

      if (user.private) delete user.email
      delete user.private
    }

    res.status(200).send(user_updated)
  } catch (err) {
    next(err)
  }
}

// Update the conversation with the new rights for the users
// Rights are already checked in the middleware
async function updateConv(conversations, method, users_list, auth_user) {
  let orgaUser = false

  for (const conversation of conversations) {
    let organization = await model.organizations.getById(
      conversation.organization.organizationId,
    )

    for (const user of users_list.users) {
      orgaUser = false

      const userInOrga = organization[0].users.filter(
        (usr) => usr.userId === user.id,
      )
      if (userInOrga.length > 0) {
        orgaUser = true
      }

      if (method === method_delete || user.right === undefined) user.right = 0

      const userRights = {
        userId: user.id.toString(),
        right: user.right,
        sharedBy: auth_user.id,
      }
      if (orgaUser) {
        // The user is in part of the organization of the conversation
        let index = conversation.organization.customRights.findIndex(
          (usr) => usr.userId === user.id,
        )

        if (index === -1)
          conversation.organization.customRights.push(userRights)
        else conversation.organization.customRights[index].right = user.right
      } else {
        // The user is not part of the organization of the conversation
        let index = conversation.sharedWithUsers.findIndex(
          (usr) => usr.userId === user.id.toString(),
        )

        if (index === -1) conversation.sharedWithUsers.push(userRights)
        else conversation.sharedWithUsers[index].right = user.right
      }

      user.conversations.push(conversation._id)
    }
    await model.conversations.update(conversation)
    await updateChildConversation(conversation, "RIGHTS")
  }

  return users_list

  //If at the end an user got a magicId, it's been a new user and we need to send him an email
  // in user.rights we can find where the user has been added, updated or delete
}

async function usersCheck(users_list, method) {
  let users = []
  for (let user of users_list.users) {
    user.conversations = []

    if (user.id === undefined) {
      // in case of user.email is used
      let u = await model.users.getByEmail(user.email)

      if (u.length === 0) {
        if (method === method_delete) continue // skip the user on delete request, probably an error from the client
        u = await inviteNewUser(user.email)
        user.id = u.id
        user.magicId = u.magicId
      } else {
        user.private = u[0].private
        user.id = u[0]._id
      }
    } else {
      let u = await model.users.getById(user.id)
      if (u.length !== 0) {
        user.email = u[0].email
      }
    }
    users.push(user)
  }
  users_list.users = users
}

async function inviteNewUser(email) {
  if (process.env.DISABLE_USER_CREATION === "true")
    throw new UserError("User creation is disabled")
  const createdUser = await model.users.createExternal({ email })
  // Create new user personal organization

  if (createdUser.insertedCount !== 1) throw new UserError()
  const userId = createdUser.insertedId.toString()

  const invitedUser = await model.users.getById(userId, true)
  const magicId = invitedUser[0].authLink.magicId

  if (magicId) {
    const createOrganization = await model.organizations.createDefault(
      userId,
      email + "'s Organization",
      {},
    )
    if (createOrganization.insertedCount !== 1) {
      await model.users.delete(userId)
      throw new UserError()
    }
    return {
      id: userId,
      magicId: magicId,
    }
  }
}

module.exports = {
  batchShareConversation,
}
