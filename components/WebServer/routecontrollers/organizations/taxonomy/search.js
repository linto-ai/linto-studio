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

    let tags = []
    for (let tag of categoryTags) {
      if (conversationsTags.includes(tag._id.toString())) {
        tags.push(tag)
      }
    }
    res.status(200).send(tags)
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

    let flatResult = []
    for (const categoryId in categories) {
      delete categories[categoryId].searchedTag
      flatResult.push(categories[categoryId])
    }
    res.status(200).send(flatResult)
  } catch (err) {
    next(err);
  }
}

async function searchConversation(req, res, next) {
  try {
    let conversation = []
    let convAccess = (await organizationUtility
      .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
      .map(conv => conv._id)

    if (!req.body.tags) throw new OrganizationError('Tags are required')
    let convTag = (await model.search.conversations.getByIdsAndTag(convAccess, req.body.tags.split(','))).map(conv => conv._id)

    if (req.body.title) {
      conversation = await model.search.conversations.getByIdsAndTitle(convTag, req.body.title)
    } else if (req.body.text) {
      conversation = await model.search.conversations.getByIdsAndText(convTag, req.body.text)
    }

    //TODO: add tag and category listing with conversation

    res.status(200).send(conversation)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  searchTaxonomy,
  searchCategory,
  searchCommonTagFromCategory,
  searchConversation
}

