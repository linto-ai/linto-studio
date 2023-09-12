
const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)


const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const {
  TagError,
  TagUnsupportedMediaType
} = require(`${process.cwd()}/components/WebServer/error/exception/tag`)

async function getOrganizationTags(req, res, next) {
  try {
    const organizationId = await getOrgaId(req)
    let tag = await model.tags.getByOrgaId(organizationId)

    if (tag.length === 0) res.status(204).send()
    else res.status(200).send(tag)

  } catch (err) {
    next(err)
  }
}

async function getTag(req, res, next) {
  try {
    let tag = await model.tags.getById(req.params.tagId)
    if (tag.length === 0) res.status(204).send()
    else res.status(200).send(tag[0])
  } catch (err) {
    next(err)
  }
}

async function searchTag(req, res, next) {
  try {
    const organizationId = await getOrgaId(req)

    if (req.query.categoryId === undefined && req.query.tags === undefined) throw new ConversationError('categoryId or tags are required')
    const categoryTags = await model.search.tags.getByCategory(req.query.categoryId)

    const userConversationsIds = [req.params.conversationId]

    // Search for conversations based on tags and conversation access
    const conversationsTags = (await model.search.conversations.getByIdsAndTag(userConversationsIds, req.query.tags))/*.flatMap(conv => conv.tags)*/
    let searchResult = []

    for (let tag of categoryTags) {
      if (searchResult.includes(tag)) continue

      for (let conv of conversationsTags) {
        if (conv.tags.includes(tag._id.toString())) {
          searchResult.push(tag)
          break
        }
      }
    }

    if (searchResult.length === 0) res.status(204).send()
    else res.status(200).send(searchResult)
  }
  catch (err) {
    next(err)
  }
}

async function getOrgaId(req) {
  let organizationId = req.params.organizationId

  if (organizationId === undefined) {
    if (!req.params.conversationId) throw new ConversationIdRequire('Conversation id is required')

    const conversation = await model.conversations.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    organizationId = conversation[0].organization.organizationId
  }

  return organizationId
}

module.exports = {
  getOrganizationTags,
  getTag,
  searchTag
}