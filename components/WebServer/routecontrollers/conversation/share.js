const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const Mailing = require(`${process.cwd()}/lib/mailer/mailing`)
const { sendMail } = require(`${process.cwd()}/lib/nodemailer`)
const { NodemailerError } = require(`${process.cwd()}/components/WebServer/error/exception/nodemailer`)
const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationMetadataRequire,
  ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const { UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/users`)

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

    const result = await conversationModel.update(conversation)
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
    // Create new user in database
    const createdUser = await userModel.createExternalUser({ email })
    let magicId = null
    let userId = null
    // Create new user personal organization
    if (createdUser.insertedCount !== 1) throw new UserError()
    const createOrganization = await organizationModel.create(createdUser.insertedId.toString(), email + '\'s Organization')

    if (createOrganization.insertedCount !== 1) {
      userModel.deleteById(createdUser.insertedId.toString())
      throw new UserError()
    }
    if (createdUser?.ops && createdUser?.ops.length > 0) {
      magicId = createdUser.ops[0].authLink.magicId
      userId = createdUser.ops[0]._id
    }
    // Share converation to created user
    if (magicId !== null) {
      // Send Mail
      const sharedByUser = await userModel.getUserById(req.payload.data.userId)
      if (sharedByUser.length !== 1) throw new UserNotFound()
      const sharedByName = sharedByUser[0].firstname + ' ' + sharedByUser[0].lastname
      const sharedByEmail = sharedByUser[0].email
      let sendmail = await sendMail({
        email,
        type: "send_share_external_link",
        subject: "Partage d'une conversation",
        conversationId: req.params.conversationId,
        sharedByName,
        sharedByEmail,
        magicId,
        reqOrigin: req.headers.origin
      })

      if (sendmail !== 'mailSend') throw new NodemailerError()
    }

    if (userId !== null && userId !== undefined) {
      req.params.userId = userId.toString()
      req.body.right = 1
      updateConversationRights(req, res, next)
    } else {
      throw 'user not found'
    }
  } catch (err) {
    next(err)
  }
}


async function inviteUserByEmail(req, res, next) {
  const email = req.body.email
  const user = await userModel.getUserByEmail(email)
  // Share to an internal user
  if (user.length > 0) {
    req.params.userId = user[0]._id
    updateConversationRights(req, res, next)
  }
  // Share to an external user
  else {
    inviteNewUser(req, res, next)
  }
}


module.exports = {
  getRightsByConversation,
  listSharedConversation,
  updateConversationRights,
  inviteUserByEmail
}