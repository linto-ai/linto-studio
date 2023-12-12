const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:taxonomy:taxonomy')
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const tagsUtility = require(`${process.cwd()}/components/WebServer/controllers/taxonomy/tags`)


const {
  OrganizationError,
  OrganizationForbidden
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function searchCategory(req, res, next) {
  try {
    const organizationId = await organizationUtility.getOrgaIdFromReq(req)

    let categoryList
    if (!req.query.type) throw new OrganizationError('Search type must be define')
    const validTypes = ['explore', 'info', 'category', 'notags']
    if (!validTypes.includes(req.query.type)) {
      throw new OrganizationError('Search type must be explore, info, search or notags')

      // Get a list of tags (and their category) with their linked tags from any conversation (tags, categories, name, expand)
    } else if (req.query.type === 'explore') {
      if (req.params.conversationId !== undefined) throw new OrganizationForbidden('Explore search is disable for shared conversation')


      if (req.query.tags === undefined) {
        categoryList = await search(req, organizationId)
      } else {
        const tagsId = await explore(req, organizationId)
        categoryList = await generateCategoryFromTagList(tagsId, organizationId, req.query)
      }

      //  Retrieve information for all desired tags with their category information (tags, name)
    } else if (req.query.type === 'info') {
      const tagsId = info(req)
      categoryList = await generateCategoryFromTagList(tagsId, organizationId, req.query)

      // Search for any category based on the provided name (name)
    } else if (req.query.type === 'category') {
      if (req.query.name === undefined) throw new OrganizationError('name is required for category search')
      else categoryList = await model.search.categories.getByOrgaIdAndName(organizationId, req.query.name)
    } else if (req.query.type === 'notags') {
      categoryList = await notags(organizationId)
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

async function search(req, organizationId) {

  if (req.query.name === undefined) throw new OrganizationError('name or tags is required')
  else {
    let tags = []
    tags = await model.search.tags.searchByName(organizationId, req.query.name)

    return await tagsUtility.fetchTagData(tags, req.query)
  }
}

async function explore(req, organizationId) {
  if (!req.query.tags) throw new OrganizationError('Tags is required')
  const tagsId = (await model.conversations.getTagByOrga(organizationId, req.query.tags)).flatMap(conv => conv.tags)
  return tagsId
}

// search can be empty or can contains an array of categories / tags id
async function generateCategoryFromTagList(tagsId, organizationId, search = {}) {
  let uniqueTagIds = [...new Set(...tagsId)]
  if (search.tags !== undefined) {
    uniqueTagIds = [...new Set([...search.tags.split(','), ...tagsId])]
  }

  const tags = await model.search.tags.searchTag(uniqueTagIds, organizationId, search.name)
  return await tagsUtility.fetchTagData(tags, search)
}

module.exports = {
  searchCategory
}

