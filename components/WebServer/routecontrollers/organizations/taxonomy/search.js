const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:taxonomy:taxonomy')
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  OrganizationError
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function searchCategory(req, res, next) {
  try {
    let categoryList
    if (!req.query.type) throw new OrganizationError('Search type must be define')
    else if (req.query.type !== 'explore' && req.query.type !== 'info' && req.query.type !== 'category') {
      throw new OrganizationError('Search type must be explore, info or search')

      // Get a list of tags (and their category) with their linked tags from any conversation (tags, categories, name, expand)
    } else if (req.query.type === 'explore') {
      if (req.query.tags === undefined) {
        categoryList = await search(req)
      } else {
        const tagsId = await explore(req)
        categoryList = await generateCategoryFromTagList(tagsId, req.params.organizationId, req.query)
      }

      //  Retrieve information for all desired tags with their category information (tags, name)
    } else if (req.query.type === 'info') {
      const tagsId = info(req)
      categoryList = await generateCategoryFromTagList(tagsId, req.params.organizationId, req.query)

      // Search for any category based on the provided name (name)
    } else if (req.query.type === 'category') {
      if (req.query.name === undefined) throw new OrganizationError('name is required for category search')
      else categoryList = await model.search.categories.getByOrgaIdAndName(req.params.organizationId, req.query.name)
    }

    if (categoryList.length === 0) res.status(204).send()
    else res.status(200).send(categoryList)

  } catch (err) {
    next(err)
  }
}

function info(req) {
  if (!req.query.tags) throw new OrganizationError('Tags are required')
  return req.query.tags.split(',')
}

async function search(req) {
  if (req.query.name === undefined) throw new OrganizationError('name or tags is required')
  else {
    let tags = []
    tags = await model.search.tags.searchByName(req.params.organizationId, req.query.name)

    let categoriesList = {}
    let ignoredList = []
    for (let tag of tags) {

      if (ignoredList.includes(tag.categoryId)) continue // should skip if the category has already been ignored

      if (!categoriesList[tag.categoryId]) {
        let category = (await model.categories.getById(tag.categoryId))[0]
        if (!TYPE.desiredType(category.type, req.query.categoryType)) {
          ignoredList.push(tag.categoryId)
          continue  // should skip if the category is not the desired type
        }

        categoriesList[tag.categoryId] = { ...category, tags: [] }
      }
      categoriesList[tag.categoryId].tags.push(tag)
    }

    let searchResult = []
    for (let categoryId in categoriesList) {
      searchResult.push(categoriesList[categoryId])
    }
    return searchResult
  }
}

async function explore(req) {
  if (!req.query.tags) throw new OrganizationError('Tags is required')

  const queryTags = req.query.tags.split(',')

  const tagsId = (await organizationUtility
    // get all the conversations of the user
    .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
    // check if the conversation contains at least one of the tags
    .filter(conv => conv.tags.some(tag => queryTags.includes(tag)))
    // reduce to an array of tag ids
    .flatMap(conv => conv.tags)

  return tagsId
}

// search can be empty or can contains an array of categories / tags id
async function generateCategoryFromTagList(tagsId, organizationId, search = {}) {
  if (search.tags === undefined) search.tags = []
  else search.tags = search.tags.split(',')
  if (search.categories === undefined) search.categories = []

  let categories = {}
  // add searched tag at the start of the list, we want to display them even if they are not in a conversation
  const uniqueTagIds = [...new Set([...search.tags, ...tagsId])]

  const tags_list = await model.search.tags.searchTag(uniqueTagIds, organizationId, search.name)

  let ignoredList = []
  for (const tag of tags_list) {
    const categoryId = tag.categoryId

    if (ignoredList.includes(categoryId)) continue // should skip if the category has already been ignored
    if (!categories[categoryId]) {
      const category = (await model.categories.getById(categoryId))[0]

      if (!TYPE.desiredType(category?.type, search.categoryType)) {
        ignoredList.push(categoryId)
        continue // should skip if the category is ignored
      } else {
        categories[categoryId] = {
          ...category,
          tags: [],
          searchedTag: false
        }
      }
    }

    if (search.categories.includes(categoryId) || search.expand === 'true') {
      categories[categoryId].tags.push(tag)
    } else if (search.tags.includes(tag._id.toString())) {
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
  return searchResult
}

async function searchTag(req, res, next) {
  try {
    if (req.query.categoryId === undefined || req.query.tags === undefined) throw new OrganizationError('categoryId or tags are required')
    const categoryTags = await model.search.tags.getByCategory(req.query.categoryId)

    const userConversationsIds = (await organizationUtility
      .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
      .map(conv => conv._id)

    // Search for conversations based on tags and conversation access
    const conversationsTags = (await model.search.conversations.getByIdsAndTag(userConversationsIds, req.query.tags))/*.flatMap(conv => conv.tags)*/

    let searchResult = []

    for (let tag of categoryTags) {
      if (searchResult.includes(tag)) continue

      for (let conv of conversationsTags) {
        if (conv.tags.includes(tag._id.toString())){
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

module.exports = {
  searchCategory,
  searchTag
}

