const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:taxonomy:taxonomy')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  OrganizationError
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function searchCategory(req, res, next) {
  try {
    const category = await model.search.categories.getByOrgaIdAndName(req.params.organizationId, req.body.name)

    if (category.length === 0) res.status(204).send()
    else res.status(200).send(category)

  } catch (err) {
    next(err)
  }
}

async function searchCommonTagFromCategory(req, res, next) {
  try {

    const categoryTags = await model.search.tags.getByCategory(req.params.categoryId)

    const userConversationsIds = (await organizationUtility
      .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
      .map(conv => conv._id)

    // Search for conversations based on tags and conversation access
    const conversationsTags = (await model.search.conversations.getByIdsAndTag(userConversationsIds, req.body.tags.split(','))).flatMap(conv => conv.tags)

    let searchResult = []
    for (let tag of categoryTags) {
      if (conversationsTags.includes(tag._id.toString())) {
        searchResult.push(tag)
      }
    }
    if (searchResult.length === 0) res.status(204).send()
    else res.status(200).send(searchResult)

  } catch (err) {
    next(err)
  }
}

async function searchTaxonomy(req, res, next) {
  try {
    // Check if tags are provided

    if (!req.body.tags) throw new OrganizationError('Tags are required')

    const userConversationsIds = (await organizationUtility
      .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
      .map(conv => conv._id)

    // Search for conversations based on tags and access
    const conversations = await model.search.conversations.getByIdsAndTag(userConversationsIds, req.body.tags.split(','))
    const tagIds = conversations.flatMap(conv => conv.tags)

    const tagCount = tagIds.reduce(function (prev, cur) {
      prev[cur] = (prev[cur] || 0) + 1
      return prev
    }, {})

    const uniqueTagIds = [...new Set([...req.body.tags.split(','), ...tagIds])] // add searched tag at the start of the list
    // Generate category list based on tags
    let categories = {}

    for (const tagId of uniqueTagIds) {
      const tag = {
        ...(await model.tags.getById(tagId))[0],
        count: tagCount[tagId]
      }
      const categoryId = tag.categoryId

      if (!categories[categoryId]) {
        let category = (await model.categories.getById(categoryId))[0]
        category.tags = []
        category.searchedTag = false
        categories[categoryId] = category
      }

      if (req.body.categories && req.body.categories.includes(categoryId)) {
        categories[categoryId].tags.push(tag)
      } else if (req.body.tags.includes(tagId)) {
        categories[categoryId].searchedTag = true
        categories[categoryId].tags.push(tag)
      } else if (categories[tag.categoryId] && categories[tag.categoryId].searchedTag) {
        categories[categoryId].tags.push(tag)
      }
    }

    let searchResult = []
    for (const categoryId in categories) {
      delete categories[categoryId].searchedTag
      searchResult.push(categories[categoryId])
    }

    if (searchResult.length === 0) res.status(204).send()
    else res.status(200).send(searchResult)

  } catch (err) {
    next(err);
  }
}

async function searchConversationByTag(req, res, next) {
  try {
    const userConversationsIds = (await organizationUtility
      .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
      .map(conv => conv._id)

    // Search for conversations based on tags and access
    let convsId = (await model.search.conversations
      .getByIdsAndTag(userConversationsIds, req.body.tags.split(',')))
      .map(conv => conv._id)

    let searchResult = await model.search.conversations.searchBy(convsId, req.body)

    if (searchResult.length === 0) res.status(204).send()
    else res.status(200).send(searchResult)

  } catch (err) {
    next(err)
  }
}

module.exports = {
  searchTaxonomy,
  searchCategory,
  searchCommonTagFromCategory,
  searchConversationByTag
}

