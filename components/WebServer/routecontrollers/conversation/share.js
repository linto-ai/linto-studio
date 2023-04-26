const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:share`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const Mailing = require(`${process.cwd()}/lib/mailer/mailing`)

const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationMetadataRequire,
  ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const {
  UserNotFound,
  UserError
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

async function getRightsByConversation(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const conversation = await model.conversations.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const data = await conversationUtility.getUserRightFromConversation(req.payload.data.userId, conversation[0])
    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}


async function updateConversationRights(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    if (req.body.right === undefined || !req.params.userId) throw new ConversationMetadataRequire("rights or userId are require")

    let user = await model.users.getById(req.params.userId, true)
    if (user.length !== 1) throw new UserNotFound()
    user = user[0]

    let conversation = await model.conversations.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()
    conversation = conversation[0]

    const organization = await model.organizations.getById(conversation.organization.organizationId)
    if (organization.length !== 1) throw new OrganizationNotFound()

    const isInOrga = organization[0].users.filter(usr => usr.userId === req.params.userId)

    // Select user right in the conversation
    let userRight = isInOrga.length === 0 ? conversation.sharedWithUsers : conversation.organization.customRights
    let isAdded = false
    if (req.body.right === 0 && isInOrga.length === 0) {
      userRight = userRight.filter(usr => usr.userId !== req.params.userId.toString())
      isAdded = true

      const mail_result = await Mailing.conversationUnshare(user.email, req, conversation.name)
      if (!mail_result) debug('Error when sending mail')

    } else {
      const userIndex = userRight.findIndex(usr => usr.userId === req.params.userId.toString())
      if (userIndex >= 0) {
        isAdded = true
        userRight[userIndex].right = req.body.right
        userRight[userIndex].sharedBy = req.payload.data.userId

        // mail already in the database but not validate
        if (!user.emailIsVerified) {
          let sharedBy = await model.users.getById(req.payload.data.userId)
          if (sharedBy.length !== 1) throw new UserNotFound()
          sharedBy = sharedBy[0]

          const updatedUser = await model.users.generateMagicLink(user)
          const mail_result = await Mailing.conversationSharedExternal(user.email, req, updatedUser.data.magicId, sharedBy.email)
          if (!mail_result) debug('Error when sending mail')
        }
      }
    }

    if (!isAdded) {
      let sharedBy = await model.users.getById(req.payload.data.userId)
      if (sharedBy.length !== 1) throw new UserNotFound()
      sharedBy = sharedBy[0]
      const userNotif = user.emailNotifications.conversations.sharing

      // Get last verified Email
      let userEmail = user.email
      let emailFound = false
      if (user.emailIsVerified) {
        emailFound = true
      }
      if (!user.emailIsVerified && user.verifiedEmail.length > 0) {
        userEmail = user.verifiedEmail[user.verifiedEmail.length - 1]
        emailFound = true
      }

      // Send Mail
      if (userNotif && emailFound) {
        const mail_result = await Mailing.conversationShared(userEmail, req, sharedBy.email, req.params.conversationId)
        if (!mail_result) debug('Error when sending mail')
      }
      userRight.push({ userId: req.params.userId.toString(), right: req.body.right, sharedBy: req.payload.data.userId })
    }

    isInOrga.length === 0 ? conversation.sharedWithUsers = userRight : conversation.organization.customRights = userRight

    const result = await model.conversations.update(conversation)
    if (result.matchedCount === 0) throw new ConversationError()

    res.status(200).send({
      message: 'Conversation updated'
    })
  } catch (err) {
    next(err)
  }
}

async function inviteNewUser(req, res, next) {
  try {
    const email = req.body.email
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

      // Share converation to created user
      const sharedBy = await model.users.getById(req.payload.data.userId)
      if (sharedBy.length !== 1) throw new UserNotFound()

      let mail_result = await Mailing.conversationSharedExternal(email, req, magicId, sharedBy[0].email)
      if (!mail_result) debug('Error when sending mail')

      await model.conversations.addSharedUser(req.params.conversationId, { userId, sharedBy: req.payload.data.userId, right: 1 })
    }

    res.status(200).send({
      message: 'Invitation send'
    })

  } catch (err) {
    next(err)
  }
}

async function inviteUserByEmail(req, res, next) {
  const email = req.body.email
  const user = await model.users.getByEmail(email)
  if (user.length === 1) {  // Share to an internal user
    req.params.userId = user[0]._id
    req.body.right = 1
    updateConversationRights(req, res, next)
  }
  else {  // Share to an external user
    inviteNewUser(req, res, next)
  }
}

async function listSharedConversation(req, res, next) {
  try {
    const userId = req.payload.data.userId
    let sharedConversation = (await model.conversations.getByShare(userId, req.query))[0]

    const totalCount = sharedConversation.totalCount[0]
    sharedConversation = sharedConversation.paginatedResult
    sharedConversation = await conversationUtility.getUserRightByShare(userId, sharedConversation)

    let shareBy = {} // used to not spam mongo

    for (let conv of sharedConversation) {
      for (let user of conv.sharedWithUsers) {
        if (user.userId === userId) {
          if (shareBy[user.sharedBy] === undefined) {
            const sharedBy = await model.users.getById(user.sharedBy)
            shareBy[user.sharedBy] = sharedBy[0]
          }
          conv.sharedBy = shareBy[user.sharedBy]
          break
        }
      }
      delete conv.organization
      delete conv.sharedWithUsers
    }

    if (sharedConversation.length === 0) res.status(204).send()
    else {
      res.status(200).send({
        ...totalCount,
        conversations: sharedConversation
      })
    }
  } catch (err) {
    next(err)
  }
}



module.exports = {
  getRightsByConversation,
  updateConversationRights,
  inviteUserByEmail,
  listSharedConversation
}