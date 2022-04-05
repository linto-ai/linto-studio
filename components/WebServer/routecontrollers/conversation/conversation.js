const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)
const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function getOwnerConversation(req, res, next){
  try {
    const conversationList = await conversationModel.getAllConvos()
    const conversations = conversationList.filter(conversation => conversation.owner === req.payload.data.userId)

    res.json({
      conversations
    })
  }catch(err){
    res.status(err.status).send({ message: err.message })

  }
}

async function updateConversation(req, res, next){
  try {
    if(!req.params.conversationId) throw new ConversationIdRequire()
    const conversation = await conversationModel.getConvoById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const conv = {
      _id : req.params.conversationId,
      ...req.body
    }

    const result = await conversationModel.update(conv)
    if (result !== 'success') throw new ConversationError()
    res.status(200).send({
      msg: 'Organization updated'
    })
  }catch(err){
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
    const convList = await conversationUtility.getUserConversation(userId)

    res.status(200).send({
      conversartions : convList
    })
  } catch (err) {
    res.status(err.status).send({ message: err.message })
  }
}

async function searchText(req, res, next) {
  try {
    const userId = req.payload.data.userId
    const convList = await conversationUtility.getUserConversation(userId)
    let convText = []
    convList.map(conversation => {
      for(const text of conversation.text){
        if(text.raw_segment.toLowerCase().includes(req.body.text.toLowerCase())){
          convText.push(conversation)
          break
        }
      }
    })

    res.status(200).send({
      search_text : req.body.text,
      conversartions : convText
    })
  } catch (err) {
    res.status(err.status).send({ message: err.message })
  }
}

module.exports = {
  getOwnerConversation,
  getConversation,
  listConversation,
  updateConversation,
  searchText
}