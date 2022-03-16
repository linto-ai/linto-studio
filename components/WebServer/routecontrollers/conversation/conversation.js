const debug = require('debug')(`app:conversation-manager:components:WebServer:routeControllers:conversation`)
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

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

module.exports = {
  getOwnerConversation,
}