const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:tag`)

const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const {
  ConversationUnsupportedMediaType,
  ConversationNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const {
  CategoryNotFound,
  CategoryError
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)

const {
  TagNotFound,
  TagError,
  TagConflict
} = require(`${process.cwd()}/components/WebServer/error/exception/tag`)

async function addTag(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationUnsupportedMediaType('Conversation id is required')
    if (!req.params.tagId) throw new ConversationUnsupportedMediaType('Tag id is required')

    const conversationId = req.params.conversationId
    const tagId = req.params.tagId

    const conversation = await model.conversations.getById(conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const tag = await model.tags.getById(tagId)
    if (tag.length !== 1) throw new TagNotFound()

    //check if organizationId from the tag is the same as the conversation
    if (tag[0].organizationId !== conversation[0].organization.organizationId) throw new TagNotFound()

    //check if tag is already in the conversation
    if (conversation[0].tags.includes(tagId)) {
      res.status(304).send('Nothing to update')
    } else {
      let tagsList = [...conversation[0].tags, tagId]

      //add tag to conversation
      await model.conversations.updateTag(conversationId, tagsList)
      res.status(200).json({ message: 'Tag added to conversation' })
    }
  } catch (err) {
    next(err)
  }
}

async function deleteTag(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationUnsupportedMediaType('Conversation id is required')
    if (!req.params.tagId) throw new ConversationUnsupportedMediaType('Tag id is required')

    const conversationId = req.params.conversationId
    const tagId = req.params.tagId

    const conversation = await model.conversations.getById(conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const tag = await model.tags.getById(tagId)
    if (tag.length !== 1) throw new TagNotFound()

    //check if organizationId from the tag is the same as the conversation
    if (tag[0].organizationId !== conversation[0].organization.organizationId) throw new TagNotInOrganization()

    //check if tag is already in the conversation
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

async function addHighlight(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const conversation = await model.conversations.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const organizationId = conversation[0].organization.organizationId
    let tagId = req.body.tagId

    if (tagId) {
      const tag = await model.tags.getById(tagId)
      if (tag.length === 0) throw new TagNotFound()

    } else if (req.body.tagName && req.body.categoryId) {
      const tag = await model.tags.getByOrgaId(organizationId, { name: req.body.tagName, categoryId: req.body.categoryId })

      if (tag.length === 0) {
        const result = await model.tags.create({ name: req.body.tagName, organizationId, categoryId: req.body.categoryId })
        tagId = result.insertedId.toString()

      } else tagId = tag[0]._id.toString()
    } else throw new TagError('No tag requested')

    const updateTurn = conversation[0].text.find((turn) => turn.turn_id === req.params.turnId)
    if (updateTurn.length === 0) res.status(204).send()

    const wordsArray = req.body.wordId.split(',')
    updateTurn.words.forEach((word) => {
      if (wordsArray.includes(word.wid.toString())) word.highlight = tagId
    })

    if (!conversation[0].tags.includes(tagId)) {
      let tagsList = [...conversation[0].tags, tagId]
      await model.conversations.updateTag(req.params.conversationId, tagsList)
    }
    const result = await model.conversations.updateTurn(req.params.conversationId, [updateTurn])

    if (result.insertedCount !== 1) res.status(204).send()
    res.status(200).send()

  } catch (err) {
    next(err)
  }
}

module.exports = {
  addTag,
  deleteTag,
  addHighlight
}
