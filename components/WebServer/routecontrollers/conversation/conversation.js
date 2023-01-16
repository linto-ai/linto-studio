const { copyFile } = require('fs')
const { get } = require('http')

const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)
const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const userUtility = require(`${process.cwd()}/components/WebServer/controllers/user/utility`)

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const { deleteFile, getStorageFolder } = require(`${process.cwd()}/components/WebServer/controllers/files/store`)
const { sendMail } = require(`${process.cwd()}/lib/nodemailer`)
const { NodemailerError } = require(`${process.cwd()}/components/WebServer/error/exception/nodemailer`)
const {
    ConversationIdRequire,
    ConversationNotFound,
    ConversationMetadataRequire,
    ConversationUnsupportedMediaType,
    ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const { UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/users`)
async function deleteConversation(req, res, next) {
    try {

        if (!req.params.conversationId) throw new ConversationIdRequire()
        let conversationId = req.params.conversationId
        const conversation = await conversationModel.getConvoById(conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()
        const result = await conversationModel.deleteById(conversationId)
        if (result.deletedCount !== 1) throw new ConversationError('Error when deleting conversation')

        deleteFile(`${getStorageFolder()}/${conversation[0].metadata.audio.filepath}`)

        res.status(200).send({
            message: 'Conversation has been deleted'
        })
    } catch (err) {
        next(err)
    }
}


async function updateConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const conv = {
            _id: req.params.conversationId,
            ...req.body
        }

        const result = await conversationModel.update(conv)
        if (result.matchedCount === 0) throw new ConversationError()

        res.status(200).send({
            message: 'Conversation updated'
        })
    } catch (err) {
        next(err)
    }
}

async function getConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()

        let conversation
        if (req?.query?.key) {
            let filter = ['name', 'owner', 'organization', 'sharedWithUsers']

            if (typeof req.query.key === 'string') filter.push(req.query.key)
            else filter.push(...req.query.key)

            conversation = await conversationModel.getConvoById(req.params.conversationId, filter)

        } else {
            conversation = await conversationModel.getConvoById(req.params.conversationId)
        }
        if (conversation.length !== 1) throw new ConversationNotFound()

        if (!orgaUtility.canReadOrganization(conversation[0].organization.organizationId, req.payload.data.userId)) {
            delete conversation.organization
            delete conversation.sharedWithUsers
        }

        const data = await conversationUtility.getUserRightFromConversation(req.payload.data.userId, conversation[0])

        res.status(200).send({
            ...conversation[0],
            userAccess: data.access,
            personal: data.personal
        })
    } catch (err) {
        next(err)
    }
}


async function downloadConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.params.format) throw new ConversationMetadataRequire('format is required')

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let output = ""
        if (req.params.format === 'json') {
            output = conversation[0].text
        }

        else if (req.params.format === 'text') {
            if (!conversation[0].text) throw new ConversationError('Conversation has no text')
            conversation[0].text.map(text => {
                output += text.segment + ""
            })
        }

        else throw new ConversationMetadataRequire('Format not supported')

        res.status(200).send(output)
    } catch (err) {
        next(err)
    }
}

async function listConversation(req, res, next) {
    try {
        const userId = req.payload.data.userId
        const convList = await conversationUtility.getUserConversation(userId)
        convList = await conversationUtility.getUserRightFromConversationList(userId, convList)

        res.status(200).send({
            conversations: convList
        })
    } catch (err) {
        next(err)
    }
}

async function listSharedConversation(req, res, next) {
    try {
        const userId = req.payload.data.userId
        let convList = await conversationModel.getConvoByShare(userId)
        convList = await conversationUtility.getUserRightFromConversationList(userId, convList)

        for (let conv of convList) {
            for (let user of conv.sharedWithUsers) {
                if (user.userId === userId) {
                    const sharedBy = await userModel.getUserById(user.sharedBy)
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
async function searchConversation(req, res, next) {
    try {
        if (!req.body.searchType) throw new ConversationUnsupportedMediaType('searchType is required')

        const searchType = req.body.searchType
        const searchText = req.body.text.toLowerCase()
        const organizationId = req.body.organizationId || ''
        const userId = req.payload.data.userId

        const convUserList = await conversationUtility.getUserConversation(userId)

        let filteredConv = [] // conversations filtered by organization

        if (organizationId === '') {
            filteredConv = convUserList
        } else {
            const organization = await orgaUtility.getOrganization(organizationId)
            const isOrgaPersonnal = organization.personal
            const organizationConvos = convUserList.filter(conv => conv.organization.organizationId === organizationId)

            filteredConv = organizationConvos
            if (isOrgaPersonnal) {
                let sharedConv = await conversationModel.getConvoByShare(userId)
                filteredConv = [...organizationConvos, ...sharedConv]
            }
        }

        let convSearch = []
        let convInArray = []
        for (const conv of filteredConv) {
            let addConv = false
            const textInConv = await conversationUtility.textInConversation(req.body.text, conv._id)
            // check if text is in conversation title
            if (!convInArray[conv._id]) {
                if (searchType.includes('title') && conv.name.toLowerCase().includes(searchText)) {
                    addConv = true
                }
                // check if text is in conversation description
                if (conv.description && searchType.includes('description') && conv.description.toLowerCase().includes(searchText)) {
                    addConv = true
                }
                // check if text is in conversation text
                if (searchType.includes('text') && textInConv) {
                    addConv = true
                }

                if (addConv) {
                    convInArray[conv._id] = true
                    convSearch.push(conv)
                }
            }

        }

        convSearch = await conversationUtility.getUserRightFromConversationList(userId, convSearch)

        res.status(200).send({
            searchType,
            conversations: convSearch
        })
    } catch (err) {
        next(err)
    }
}

async function updateConversationRights(req, res, next) {
  try {
      // Get request origin
      let reqOrigin = null
      if(!!req.headers['x-forwarded-host'] && req.headers ['x-forwarded-proto']) {
        reqOrigin = `${req.headers ['x-forwarded-proto']}://${req.headers ['x-forwarded-host']}`
      }
        
      if (!req.params.conversationId) throw new ConversationIdRequire()
      if (req.body.right === undefined || !req.params.userId) throw new ConversationMetadataRequire("rights or userId are require")

      const user = await userModel.getUserById(req.params.userId)
      if(user.length !== 1) throw new UserNotFound()

      const conversation = await conversationModel.getConvoById(req.params.conversationId)
      if (conversation.length !== 1) throw new ConversationNotFound()

      const organization = await organizationModel.getOrganizationById(conversation[0].organization.organizationId)
      if (organization.length !== 1) throw new OrganizationNotFound()

      const isInOrga = organization[0].users.filter(usr => usr.userId === req.params.userId)

      // Select user right in the conversation
      let userRight = isInOrga.length === 0 ? conversation[0].sharedWithUsers : conversation[0].organization.customRights

      let isAdded = false
      if (req.body.right === 0 && isInOrga.length === 0) {
          userRight = userRight.filter(usr => usr.userId !== req.params.userId)
          isAdded = true
          if(reqOrigin !== null) {
            // Sendmail unsharing
            const emailPayload = {
              email: user[0].email,
              type:"send_unshare_conversation",
              subject: `Révocation de vos droit sur la conversation "${conversation[0].name}"`,
              reqOrigin
            }
            let sendmail = await sendMail(emailPayload)
            if(!sendmail === 'mailSend') throw new NodemailerError()
          }
      } else {
          const userIndex = userRight.findIndex(usr => usr.userId === req.params.userId)
          if (userIndex >= 0) {
              isAdded = true
              userRight[userIndex].right = req.body.right
              userRight[userIndex].sharedBy = req.payload.data.userId
          }
      }

      if (!isAdded) {
        const sharedByUser = await userModel.getUserById(req.payload.data.userId)
        if(sharedByUser.length !== 1) throw new UserNotFound()
        const sharedByName = sharedByUser[0].firstname + ' ' + sharedByUser[0].lastname
        const sharedByEmail = sharedByUser[0].email
        const userNotif = user[0].emailNotifications.conversations.sharing
          // Send Mail
          if(userNotif && user[0].accountActivated && reqOrigin !== null) {
            const emailPayload = {
              email: user[0].email,
              type:"send_share_conversation",
              subject: "Partage d'une conversation",
              magicId: user[0].authLink.magicId,
              conversationId: req.params.conversationId,
              sharedByName,
              sharedByEmail,
              reqOrigin
            }
            let sendmail = await sendMail(emailPayload)
            if(!sendmail === 'mailSend') throw new NodemailerError()
          }
          userRight.push({ userId: req.params.userId.toString(), right: req.body.right, sharedBy: req.payload.data.userId })
      }

      isInOrga.length === 0 ? conversation[0].sharedWithUsers = userRight : conversation[0].organization.customRights = userRight

      const conv = {
          _id: req.params.conversationId,
          ...conversation[0]
      }

      const result = await conversationModel.update(conv)
      if (result.matchedCount === 0) throw new ConversationError()

      res.status(200).send({
          message: 'Conversation updated'
      })
  } catch (err) {
      next(err)
  }
}

async function getUsersByConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let organization = await organizationModel.getOrganizationById(conversation[0].organization.organizationId)
        if (organization.length !== 1) throw new OrganizationNotFound()

        const userId = req.payload.data.userId
        const conversationUsers = await userUtility.getUsersListByConversation(userId, conversation[0], organization[0])
        res.status(200).send({
            conversationUsers
        })
    } catch (err) {
        next(err)
    }
}

async function getRightsByConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()

        const conversation = await conversationModel.getConvoById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        const data = await conversationUtility.getUserRightFromConversation(req.payload.data.userId, conversation[0])

        res.status(200).send({
            ...data.access,
            personal: data.personal
        })
    } catch (err) {
        next(err)
    }
}

async function inviteUserByEmail(req, res, next) {
    const email = req.body.email
    const user = await userModel.getUserByEmail(email)
    // Share to an internal user
    if(user.length > 0) {
      req.params.userId = user[0]._id
      updateConversationRights(req,res,next)
    } 
    // Share to an external user
    else {
      inviteNewUser(req, res, next)
    }
}

async function inviteNewUser(req, res, next) {
  try {
    const email = req.body.email
    // Create new user in database
    const createdUser = await userModel.createExternalUser({email})
    let magicId = null
    let userId = null
    // Create new user personal organization
    if (createdUser.insertedCount !== 1) throw new UserError()
    const createOrganization = await organizationModel.createDefaultOrganization(createdUser.insertedId.toString(), {email, type:'private'})
    if (createOrganization.insertedCount !== 1) {
        userModel.deleteById(createdUser.insertedId.toString())
        throw new UserError()
    }
    if(createdUser?.ops && createdUser?.ops.length > 0) {
      magicId = createdUser.ops[0].authLink.magicId
      userId = createdUser.ops[0]._id
    }
    // Share converation to created user
    if(magicId !== null) {
      // Send Mail
      const sharedByUser = await userModel.getUserById(req.payload.data.userId)
      if(sharedByUser.length !== 1) throw new UserNotFound()
      const sharedByName = sharedByUser[0].firstname + ' ' + sharedByUser[0].lastname
      const sharedByEmail = sharedByUser[0].email
      let sendmail = await sendMail({
        email,
        type:"send_share_external_link",
        subject: "Partage d'une conversation",
        conversationId: req.params.conversationId,
        sharedByName,
        sharedByEmail,
        magicId,
        reqOrigin: req.headers.origin
      }) 
      
      if(sendmail !== 'mailSend') throw new NodemailerError()
    }

    if(userId !== null && userId !== undefined) {
      req.params.userId = userId.toString()
      req.body.right = 1
      updateConversationRights(req,res,next)
    } else {
      throw 'user not found'
    }
  } catch (err) {
    next(err)
  }
  
}

module.exports = {
    deleteConversation,
    downloadConversation,
    getConversation,
    getUsersByConversation,
    getRightsByConversation,
    listConversation,
    listSharedConversation,
    searchConversation,
    updateConversation,
    updateConversationRights,
    inviteUserByEmail
}