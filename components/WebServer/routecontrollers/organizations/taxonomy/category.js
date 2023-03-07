const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:tag:category')
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const {
  CategoryError,
  CategoryTypeNotDefined,
  CategoryTypeNotValid,
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)


async function getCategory(req, res, next) {
  try {
    let category = await model.category.getById(req.params.categoryId)
    if (category.length === 0) res.status(204).send()
    else res.status(200).send(category[0])
  } catch (err) {
    next(err)
  }
}

async function getType(req, res, next) {
  try {
    res.status(200).send(TYPE)
  } catch (err) {
    next(err)
  }
}

async function listCategory(req, res, next) {
  try {
    let searchQuery = {}
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        searchQuery[key] = value
      }
    }

    let category = await model.category.getByOrgaId(req.params.organizationId, searchQuery)
    if (category.length === 0) res.status(204)
    res.status(200).send(category)
  } catch (err) {
    next(err)
  }
}

async function createCategory(req, res, next) {
  try {
    let category = await model.category.getByOrgaId(req.params.organizationId, { name: req.body.name })
    if (category.length > 0) throw new CategoryError('Category already exist')

    if (!req.body.color) req.body.color = '#FFFFFF'
    if (!req.body.type) throw new CategoryTypeNotDefined()
    else if (TYPE.checkValue(req.body.type) === false) throw new CategoryTypeNotValid()
    req.body.organizationId = req.params.organizationId

    const result = await model.category.create(req.body)
    if (result.insertedCount !== 1) throw new CategoryError('Error during the creation of the category')

    res.status(200).send('Category created')
  } catch (err) {
    next(err)
  }
}

async function updateCategory(req, res, next) {
  try {
    let category = await model.category.getById(req.params.categoryId)
    if (category.length === 0) throw new CategoryError('Category not found')

    if (req.body.name) category[0].name = req.body.name
    if (req.body.color) category[0].color = req.body.color
    if (req.body.type) {
      if (TYPE.checkValue(req.body.type) === false) throw new CategoryTypeNotValid()
      category[0].type = req.body.type
    }

    const result = await model.category.update(category[0])
    if (result.modifiedCount === 0) res.status(304).send('Nothing to update')
    else res.status(200).send('Category updated')
  } catch (err) {
    next(err)
  }
}

async function deleteCategory(req, res, next) {
  try {
    let category = await model.category.getById(req.params.categoryId)
    if (category.length === 0) throw new CategoryError('Category not found')

    const result = await model.category.delete(req.params.categoryId)
    if (result.deletedCount !== 1) throw new CategoryError('Error during the deletion of the category')

    res.status(200).send('Category deleted')
  } catch (err) {
    next(err)
  }
}


module.exports = {
  getCategory,
  getType,
  listCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}