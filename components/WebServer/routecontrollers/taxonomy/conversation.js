
const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  ConversationIdRequire,
  ConversationNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const {
  TagError,
  TagNotFound,
  TagUnsupportedMediaType
} = require(`${process.cwd()}/components/WebServer/error/exception/tag`)

async function deleteTagFromConversation(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire('Conversation id is required')
    if (!req.params.tagId) throw new TagUnsupportedMediaType('Tag id is required')

    const conversationId = req.params.conversationId
    const tagId = req.params.tagId

    const conversation = await model.conversations.getById(conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    if (!conversation[0].tags.includes(tagId)) {
      res.status(304).send('Nothing to update')
    } else {
      let tagsList = conversation[0].tags.filter(tag => tag !== tagId)

      //add tag to conversation
      await model.conversations.updateTag(conversationId, tagsList)
      res.status(200).json({ message: 'Tag deleted from conversation' })
    }
  } catch (err) {
    next(err)
  }
}

async function createTag(req, organizationId, next) {
  try {
    if (!req.body.name) throw new TagUnsupportedMediaType('name is required')
    if (!req.body.categoryId) throw new TagUnsupportedMediaType('categoryId is required')

    let tag = await model.tags.getByOrgaId(organizationId, { name: req.body.name })
    if (tag.length > 0) return tag[0]._id.toString()
    debug(tag)

    let category = await model.categories.getById(req.body.categoryId)
    if (category.length === 0 || category.length === undefined) throw new TagError('categoryId not found')


    req.body.organizationId = organizationId
    const result = await model.tags.create(req.body)
    if (result.insertedCount !== 1) throw new TagError('Error during the creation of the tag')

    return result.insertedId.toString()
  } catch (err) {
    next(err)
  }
}

async function addTagToConversation(req, res, next) {
  try {

    if (!req.params.conversationId) throw new ConversationIdRequire('Conversation id is required')
    const organizationId = await organizationUtility.getOrgaIdFromReq(req)

    const conversation = await model.conversations.getById(req.params.conversationId)

    let tagId = req.params.tagId

    if (req.body.name) {
      tagId = await createTag(req, organizationId, next)
      if(!tagId) throw new TagError('Error during the creation of the tag')
    } else if (req.params.tagId) {
      const tag = await model.tags.getById(tagId)
      if (tag.length !== 1 || tag[0].organizationId !== conversation[0].organization.organizationId) throw new TagNotFound()
    } else throw new TagUnsupportedMediaType('Tag id or TagName is required')

    if (conversation[0].tags.includes(tagId)) {
      res.status(304).send('Nothing to update')
    } else {
      let tagsList = [...conversation[0].tags, tagId]
      await model.conversations.updateTag(req.params.conversationId, tagsList)
      res.status(200).json({ message: 'Tag added to conversation' })
    }

  } catch (err) {
    next(err)
  }
}

module.exports = {
  addTagToConversation,
  deleteTagFromConversation,
}