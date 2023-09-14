
const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  TagUnsupportedMediaType
} = require(`${process.cwd()}/components/WebServer/error/exception/tag`)

const {
  CategoryTypeNotDefined,
  CategoryConflict,
  CategoryError
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)

async function createCategory(req, res, next) {
  try {
    let organizationId = await organizationUtility.getOrgaIdFromReq(req)

    let category = await model.categories.getByOrgaId(organizationId, { name: req.body.name })

    if (category.length > 0) throw new CategoryConflict(`Conflict with category name ${req.body.name} already exist. Category id ${category[0]._id}`)
    if (!req.body.color) req.body.color = 'white'
    if (!req.body.type) throw new CategoryTypeNotDefined()
    else if (TYPE.checkValue(req.body.type) === false) throw new TagUnsupportedMediaType('Type not supported')
    req.body.organizationId = organizationId

    const result = await model.categories.create(req.body)
    if (result.insertedCount !== 1) throw new CategoryError('Error during the creation of the category')

    const category_created = await model.categories.getById(result.insertedId.toString())
    return res.status(201).send(category_created[0])
  } catch (err) {
    next(err)
  }
}

async function getOrganizationCategory(req, res, next) {
  try {
    const organizationId = await organizationUtility.getOrgaIdFromReq(req)

    let searchQuery = {}
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        searchQuery[key] = value
      }
    }

    let category = await model.categories.getByOrgaId(organizationId, searchQuery)

    if (category.length === 0) res.status(204)
    res.status(200).send(category)

  } catch (err) {
    next(err)
  }
}

async function getCategory(req, res, next) {
  try {
    let category = await model.categories.getById(req.params.categoryId)
    if (category.length === 0) res.status(204).send()
    else {
      const tags = await model.search.tags.getByCategory(req.params.categoryId)
      category[0].tags = tags

      res.status(200).send(category[0])
    }

  } catch (err) {
    next(err)
  }
}

module.exports = {
  getCategory,
  createCategory,
  getOrganizationCategory
}