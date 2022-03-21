const debug = require('debug')(`app:conversation-manager:components:WebServer:routeControllers:conversation`)
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

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


module.exports = {
  getOwnerConversation,
  getConversation
}