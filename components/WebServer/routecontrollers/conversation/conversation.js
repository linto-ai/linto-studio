const debug = require('debug')(`app:conversation-manager:components:WebServer:routeControllers:conversation`)
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const CONVERSATION_RIGHTS = require(`${process.cwd()}/lib/dao/rights/conversation`)
const ORGANIZATION_ROLES = require(`${process.cwd()}/lib/dao/roles/organization`)

const {
  ConversationIdRequire,
  ConversationNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function getOwnerConversation(req, res, next){
  try {
    const conversationList = await conversationModel.getAllConvos()
    const conversations = conversationList.filter(conversation => conversation.owner === req.payload.data.userId)

    res.json({
      conversations
    })
  }catch(error){
    res.status(err.status).send({ message: err.message })

  }
}

async function getConversation(req, res, next) {
  try{
      if(!req.params.conversationId) throw new ConversationIdRequire()

      const conversation = await conversationModel.getConvoById(req.params.conversationId)
      if (conversation.length !== 1) throw new ConversationNotFound()

      res.status(200).send({
          ...conversation[0]
      })
  }catch(err){
      res.status(err.status).send({ message: err.message })
  }
}

async function listConversation(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const convList = []

    const conversations = await conversationModel.getAllConvos()
    for(let conversation of conversations){
      // User is owner
      if(conversation.owner === userId){        convList.push(conversation)
      }      // User have rights to read
      else if(conversation.sharedWithUsers.filter(user => user.userId === userId &&
                  CONVERSATION_RIGHTS.asRightAccess(user.right, CONVERSATION_RIGHTS.READ)).length !== 0)
      {
            convList.push(conversation)
      }
      // If user have role in organization
      else {
        const organization = await organizationModel.getOrganizationById(conversation.organization.organizationId)

        if(organization[0].users.filter(user => user.userId === userId &&
                ORGANIZATION_ROLES.asRoleAccess(user.role, conversation.organization.role)).length !== 0)
        {
          convList.push(conversation)
        }
      }
    }
    res.status(200).send({
      conversartions : convList
    })
  } catch (err) {
    res.status(err.status).send({ message: err.message })
  }
}

module.exports = {
  getOwnerConversation,
  getConversation,
  listConversation
}