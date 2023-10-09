const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:categories`)

const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  ConversationUnsupportedMediaType,
  ConversationNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function listConvCategoryByHighlight(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationUnsupportedMediaType('Conversation id is required')
    const conversationId = req.params.conversationId

    const conversation = await model.conversations.getById(conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()
    const organizationId = conversation[0].organization.organizationId

    let categories = await model.categories.getByOrgaIdAndType(organizationId, TYPE.HIGHLIGHT)
    if (categories.length <= 1) res.status(204).send()
    
    categories = categories.filter(cat => cat.name !== 'keyword')
    res.status(200).json(categories)

  } catch (err) {
    next(err)
  }
}



module.exports = {
  listConvCategoryByHighlight,
}
