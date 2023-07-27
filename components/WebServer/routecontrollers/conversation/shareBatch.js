const { DocumentAttributes, DocumentBackgroundAttributes } = require('docx')
const { use } = require('passport')

const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:share`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const Mailing = require(`${process.cwd()}/lib/mailer/mailing`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const {
  ConversationIdRequire,
  ConversationMetadataRequire
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function batchShareConversation(req, res, next) {
  try {
    if (!req.body.conversations) throw new ConversationMetadataRequire('A conversations ids list is')
    if (!req.body.users) throw new ConversationMetadataRequire('A users ids list is with desired rights is require')

    let auth_user = { id: req.payload.data.userId, role: ROLES.UNDEFINED, organizationId: req.body.organizationId }

    if (req.body.organizationId) {
      const organization = await model.organizations.getByIdAndUser(auth_user.organizationId, auth_user.id)
      if (organization.length !== 1) throw new OrganizationNotFound()

      organization[0].users.map(user => {
        if (user.userId === auth_user.id) auth_user.role = user.role
      })
    }

    const conversationsIds = req.body.conversations.split(',')
    let conversations = await model.conversations.listConvFromAccess(conversationsIds, auth_user.id,
      auth_user.organizationId, auth_user.role, RIGHTS.READ, { _id: 1, text: 0, tags: 0, speakers: 0, metadata: 0, jobs: 0 })


    const method = req.method
    //req.body.users is a json string, transform it to an object
    let users_list = JSON.parse(req.body.users)

    await usersCheck(users_list) // Check and handle user creation if needed
    let user_updated = await updateConv(conversations, method, users_list, auth_user)  // Update the conversation with the new users rights


    for(let user of users_list.users) {
      delete user.magicId
    }
    //TODO: Send mail to users

    res.status(200).send(user_updated)
  } catch (err) {
    next(err)
  }
}

async function updateConv(conversations, method, users_list, auth_user) {
  let orgaUser = false

  for (const conversation of conversations) {
    let organization = await model.organizations.getById(conversation.organization.organizationId)

    for (const user of users_list.users) {
      orgaUser = false

      const userInOrga = organization[0].users.filter(usr => usr.userId === user.id)
      if (userInOrga.length > 0) {
        orgaUser = true

        if (auth_user.organizationId !== conversation.organization.organizationId) continue // Skip if user is in the organization but not me
        else if (userInOrga[0].role > auth_user.role) continue // skip if user in the organization has a higher role than me
        else if (auth_user.role < ROLES.MAINTAINER) continue // skip if i'm not maintainer or admin
        // TODO: Should store data that user can't modify the user right
      }

      if (method === 'DELETE' || user.right === undefined)
        user.right = 0

      if (RIGHTS.validRight(user.right) === false) continue // skip if the right is not valid


      const userRights = { userId: user.id.toString(), right: user.right, sharedBy: auth_user.id }
      if (orgaUser) { // The user is in part of the organization of the conversation
        let index = conversation.organization.customRights.findIndex(usr => usr.userId === user.id)

        if (index === -1) conversation.organization.customRights.push(userRights)
        else conversation.organization.customRights[index].right = user.right

      } else { // The user is not part of the organization of the conversation
        let index = conversation.sharedWithUsers.findIndex(usr => usr.userId === user.id.toString())

        if (index === -1) conversation.sharedWithUsers.push(userRights)
        else conversation.sharedWithUsers[index].right = user.right
      }

      user.rights.push(conversation._id)
    }
    await model.conversations.update(conversation)
  }

  return users_list

  //If at the end an user got a magicId, it's been a new user and we need to send him an email
  // in user.rights we can find where the user has been added, updated or delete
}

async function usersCheck(users_list) {
  for (let user of users_list.users) {
    user.rights = []

    if (user.id === undefined) { // in case of user.email is used
      let u = await model.users.getByEmail(user.email)
      if (u.length === 0) {

        u = await inviteNewUser(user.email)
        user.id = u.id
        user.magicId = u.magicId
      }
      else user.id = u[0]._id
    } else {

      let u = await model.users.getById(user.id)
      if (u.length !== 0) {
        user.email = u[0].email
      }

    }
  }
}

async function inviteNewUser(email) {
  const createdUser = await model.users.createExternal({ email })

  // Create new user personal organization
  if (createdUser.insertedCount !== 1) throw new UserError()
  const userId = createdUser.insertedId.toString()
  const magicId = createdUser.ops[0].authLink.magicId

  if (magicId) {
    const createOrganization = await model.organizations.createDefault(userId, email + '\'s Organization', {})
    if (createOrganization.insertedCount !== 1) {
      await model.users.delete(userId)
      throw new UserError()
    }
    return {
      id: userId,
      magicId: magicId
    }
    // await Mailing.conversationSharedNewUser(email, req, magicId, sharedBy[0].email)
    // await model.conversations.addSharedUser(req.params.conversationId, { userId, sharedBy: req.payload.data.userId, right: 1 })
  }
  //TODO: throw error ?
}


module.exports = {
  batchShareConversation
}