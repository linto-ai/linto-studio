const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

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

async function listSharedConversation(req, res, next) {
  try {
    const userId = req.payload.data.userId
    let convList = await model.conversation.getByShare(userId)
    convList = await conversationUtility.getUserRightFromConversationList(userId, convList)

    for (let conv of convList) {
      for (let user of conv.sharedWithUsers) {
        if (user.userId === userId) {
          const sharedBy = await model.user.getById(user.sharedBy)
          conv.sharedBy = sharedBy[0]
          break
        }
      }
      delete conv.organization
      delete conv.sharedWithUsers
    }

    res.status(200).send({
      conversations: convList
    })
  } catch (err) {
    next(err)
  }
}

async function getRightsByConversation(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const conversation = await model.conversation.getById(req.params.conversationId)
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

    let user = await model.user.getById(req.params.userId, true)
    if (user.length !== 1) throw new UserNotFound()
    user = user[0]

    let conversation = await model.conversation.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()
    conversation = conversation[0]

    const organization = await model.organization.getById(conversation.organization.organizationId)
    if (organization.length !== 1) throw new OrganizationNotFound()

    const isInOrga = organization[0].users.filter(usr => usr.userId === req.params.userId)

    // Select user right in the conversation
    let userRight = isInOrga.length === 0 ? conversation.sharedWithUsers : conversation.organization.customRights
    let isAdded = false
    if (req.body.right === 0 && isInOrga.length === 0) {
      userRight = userRight.filter(usr => usr.userId !== req.params.userId)
      isAdded = true

      const mail_result = await Mailing.conversationUnshare(user.email, req, conversation.name)
      if (!mail_result) debug('Error when sending mail')

    } else {
      const userIndex = userRight.findIndex(usr => usr.userId === req.params.userId)
      if (userIndex >= 0) {
        isAdded = true
        userRight[userIndex].right = req.body.right
        userRight[userIndex].sharedBy = req.payload.data.userId
      }
    }

    if (!isAdded) {
      let sharedBy = await model.user.getById(req.payload.data.userId)
      if (sharedBy.length !== 1) throw new UserNotFound()
      sharedBy = sharedBy[0]
      const userNotif = user.emailNotifications.conversations.sharing

      // Send Mail
      if (userNotif) {
        const mail_result = await Mailing.conversationShared(user.email, req, sharedBy.email, req.params.conversationId)
        if (!mail_result) debug('Error when sending mail')
      }
      userRight.push({ userId: req.params.userId.toString(), right: req.body.right, sharedBy: req.payload.data.userId })
    }

    isInOrga.length === 0 ? conversation.sharedWithUsers = userRight : conversation.organization.customRights = userRight

    const result = await model.conversation.update(conversation)
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
    const createdUser = await model.user.createExternal({ email })

    // Create new user personal organization
    if (createdUser.insertedCount !== 1) throw new UserError()
    const userId = createdUser.insertedId.toString()
    const magicId = createdUser.ops[0].authLink.magicId

    const createOrganization = await model.organization.createDefault(userId, email + '\'s Organization', {})
    if (createOrganization.insertedCount !== 1) {
      model.user.deleteById(userId)
      throw new UserError()
    }

    // Share converation to created user
    if (!magicId) {
      const sharedBy = await model.user.getById(req.payload.data.userId)
      if (sharedBy.length !== 1) throw new UserNotFound()

      const mail_result = await Mailing.conversationSharedExternal(email, req, magicId, sharedBy[0].email)
      if (!mail_result) debug('Error when sending mail')
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
  const user = await model.user.getByEmail(email)
  if (user.length === 1) {  // Share to an internal user
    req.params.userId = user[0]._id
    req.body.right = 1
    updateConversationRights(req, res, next)
  }
  else {  // Share to an external user
    inviteNewUser(req, res, next)
  }
}


module.exports = {
  getRightsByConversation,
  listSharedConversation,
  updateConversationRights,
  inviteUserByEmail
}