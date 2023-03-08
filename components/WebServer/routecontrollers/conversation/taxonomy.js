const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:turn`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const {
  ConversationUnsupportedMediaType,
  ConversationNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const {
  TagNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/tag`)

const {
  CategoryNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)


async function addTag(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationUnsupportedMediaType('Conversation id is required')
    if (!req.params.tagId) throw new ConversationUnsupportedMediaType('Tag id is required')

    const conversationId = req.params.conversationId
    const tagId = req.params.tagId

    const conversation = await model.conversation.getById(conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const tag = await model.tag.getById(tagId)
    if (tag.length !== 1) throw new TagNotFound()

    //check if organizationId from the tag is the same as the conversation
    if (tag[0].organizationId !== conversation[0].organization.organizationId) throw new TagNotFound()

    //check if tag is already in the conversation
    if (conversation[0].tags.includes(tagId)) {
      res.status(304).send('Nothing to update')
    } else {
      let tagsList = [...conversation[0].tags, tagId]

      //add tag to conversation
      await model.conversation.updateTag(conversationId, tagsList)
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

    const conversation = await model.conversation.getById(conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const tag = await model.tag.getById(tagId)
    if (tag.length !== 1) throw new TagNotFound()

    //check if organizationId from the tag is the same as the conversation
    if (tag[0].organizationId !== conversation[0].organization.organizationId) throw new TagNotInOrganization()

    //check if tag is already in the conversation
    if (!conversation[0].tags.includes(tagId)) {
      res.status(304).send('Nothing to update')
    } else {
      let tagsList = conversation[0].tags.filter(tag => tag !== tagId)

      //add tag to conversation
      await model.conversation.updateTag(conversationId, tagsList)
      res.status(200).json({ message: 'Tag deleted from conversation' })
    }
  } catch (err) {
    next(err)
  }
}

async function addCategory(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationUnsupportedMediaType('Conversation id is required')
    if (!req.params.categoryId) throw new ConversationUnsupportedMediaType('Category id is required')

    const conversationId = req.params.conversationId
    const categoryId = req.params.categoryId

    const conversation = await model.conversation.getById(conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const category = await model.category.getById(categoryId)
    if (category.length !== 1) throw new CategoryNotFound()

    //check if organizationId from the category is the same as the conversation
    if (category[0].organizationId !== conversation[0].organization.organizationId) throw new CategoryNotFound()

    //check if category is already in the conversation
    if (conversation[0].category.includes(categoryId)) {
      res.status(304).send('Nothing to update')
    } else {
      let categoryList = [...conversation[0].category, categoryId]

      //add category to conversation
      await model.conversation.updateCategory(conversationId, categoryList)
      res.status(200).json({ message: 'Category added to conversation' })
    }
  } catch (err) {
    next(err)
  }
}

async function deleteCategory(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationUnsupportedMediaType('Conversation id is required')
    if (!req.params.categoryId) throw new ConversationUnsupportedMediaType('Category id is required')

    const conversationId = req.params.conversationId
    const categoryId = req.params.categoryId

    const conversation = await model.conversation.getById(conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const category = await model.category.getById(categoryId)
    if (category.length !== 1) throw new CategoryNotFound()

    //check if organizationId from the category is the same as the conversation
    if (category[0].organizationId !== conversation[0].organization.organizationId) throw new CategoryNotFound()

    //check if category is already in the conversation
    if (!conversation[0].category.includes(categoryId)) {
      res.status(304).send('Nothing to update')
    } else {
      let categoryList = conversation[0].category.filter(category => category !== categoryId)

      //add category to conversation
      await model.conversation.updateCategory(conversationId, categoryList)
      res.status(200).json({ message: 'Category deleted from conversation' })
    }
  } catch (err) {
    next(err)
  }

}

module.exports = {
  addTag,
  deleteTag,
  addCategory,
  deleteCategory,
}
