const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:taxonomy:categories:search')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const tagsUtility = require(`${process.cwd()}/components/WebServer/controllers/taxonomy/tags`)

const SEARCH_TYPE = ['explore', 'info', 'category', 'notags']

const {
  OrganizationError,
  OrganizationForbidden
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

// OK http://dev.linto.local:8001/api/conversations/65cf830bd3729d7ba7301820/categories/search?type=info&tags=65cf29f54085a42485e41f72,65cf2e9d3ee51a278d870243,65cf8345d3729d7ba7301822
// KO http://dev.linto.local:8001/api/conversations/65cf830bd3729d7ba7301820/categories/search?type=info&tags=65cf29f54085a42485e41f72,65cf2e9d3ee51a278d870243,65cf8345d3729d7ba7301822


async function searchCategory(req, res, next) {
  try {
    const scopeId = await organizationUtility.getOrgaIdFromReq(req)
    let categoryList = []
    if (!req.query.type && !SEARCH_TYPE.includes(req.query.type)) {
      throw new OrganizationError('Search type must be explore, info, search or notags')
    } else if (req.query.type === 'explore') {
      if (req.params.conversationId !== undefined) throw new OrganizationForbidden('Explore search is disable for shared conversation')


      if (req.query.tags === undefined) {
        category = await model.categories.getByScope(scopeId)
        //We want all category ID in an array 
        let categoryId = category.map(cat => cat._id.toString())
        categoryList = await search(req, categoryId)
      } else {
        const tagsId = await explore(req, scopeId)
        categoryList = await generateCategoryFromTagList(tagsId, req.query)
      }
      //  Retrieve information for all desired tags with their category information (tags, name)
    } else if (req.query.type === 'info') { // Get a list of tags (and their category) with their linked tags from any conversation
      const tagsId = info(req)
      categoryList = await generateCategoryFromTagList(tagsId, req.query)
    } else if (req.query.type === 'category') {
      if (req.query.name === undefined) throw new OrganizationError('name is required for category search')
      else categoryList = await model.categories.searchByScopeAndName(scopeId, req.query.name)
    }
    else if (req.query.type === 'notags') {
      categoryList = await model.categories.getByScope(scopeId)
    }


    if (req.query.expand === 'true') {
      for (let i = 0; i < categoryList.length; i++) {
        const tags = await model.search.tags.getByCategory(categoryList[i]._id.toString())
        categoryList[i].tags = tags
      }
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

async function notags(organizationId) {
  const tagsList = await model.tags.getByOrgaId(organizationId) // Get all tag from an organisation
  let categoryTags = [...new Set(tagsList.map(tag => tag.categoryId))]  // Fetch category
  const objectIds = categoryTags.map(stringId => model.tags.getObjectId(stringId))
  return await model.categories.getByOrgaId(organizationId, { _id: { $nin: objectIds } })
}

async function search(req, categoryList) {

  if (req.query.name === undefined) throw new OrganizationError('name or tags is required')
  else {
    let tags = []
    tags = await model.search.tags.searchTagByCategory(categoryList, req.query.name)
    return await tagsUtility.fetchTagData(tags, req.query)
  }
}

async function explore(req, organizationId) {
  if (!req.query.tags) throw new OrganizationError('Tags is required')
  const tagsId = (await model.conversations.getTagByOrga(organizationId, req.query.tags)).flatMap(conv => conv.tags)
  return tagsId
}

// search can be empty or can contains an array of categories / tags id
async function generateCategoryFromTagList(tagsId, search = {}) {
  let uniqueTagIds = [...new Set(...tagsId)]
  if (search.tags !== undefined) {
    uniqueTagIds = [...new Set([...search.tags.split(','), ...tagsId])]
  }

  const tags = await model.search.tags.searchTag(uniqueTagIds, search.name)
  return await tagsUtility.fetchTagData(tags, search)
}

module.exports = {
  searchCategory
}

