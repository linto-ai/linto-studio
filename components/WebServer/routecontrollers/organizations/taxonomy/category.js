const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:tag:category')
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const {
  CategoryError,
  CategoryTypeNotDefined,
  CategoryTypeNotValid,
  CategoryUnsupportedMediaType,
  CategoryConflict
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)


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

async function listCategory(req, res, next) {
  try {
    let searchQuery = {}
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        searchQuery[key] = value
      }
    }

    let category = await model.categories.getByOrgaId(req.params.organizationId, searchQuery)
    if (category.length === 0) res.status(204)
    res.status(200).send(category)
  } catch (err) {
    next(err)
  }
}

async function createCategory(req, res, next) {
  try {
    let category = await model.categories.getByOrgaId(req.params.organizationId, { name: req.body.name })
    if (category.length > 0) throw new CategoryConflict()

    if (!req.body.color) req.body.color = '#FFFFFF'
    if (!req.body.type) throw new CategoryTypeNotDefined()
    else if (TYPE.checkValue(req.body.type) === false) throw new CategoryUnsupportedMediaType('Type not supported')
    req.body.organizationId = req.params.organizationId

    const result = await model.categories.create(req.body)
    if (result.insertedCount !== 1) throw new CategoryError('Error during the creation of the category')

    res.status(201).send({ message: 'Category created', id: result.insertedId.toString() })
  } catch (err) {
    next(err)
  }
}

async function updateCategory(req, res, next) {
  try {
    let category = await model.categories.getById(req.params.categoryId)
    if (category.length === 0) throw new CategoryError('Category not found')

    if (req.body.name) {
      let searchedCategoryName = await model.categories.getByOrgaId(req.params.organizationId, { name: req.body.name })
      if (searchedCategoryName.length > 0) throw new CategoryConflict(`Conflict with category name ${req.body.name} already exist. Category id ${searchedCategoryName[0]._id}`)
      category[0].name = req.body.name
    }

    if (req.body.color) category[0].color = req.body.color
    if (req.body.type) {
      if (TYPE.checkValue(req.body.type) === false) throw new CategoryTypeNotValid()
      category[0].type = req.body.type
    }

    const result = await model.categories.update(category[0])
    if (result.modifiedCount === 0) res.status(304).send('Nothing to update')
    else res.status(200).send({ message: 'Category updated' })
  } catch (err) {
    next(err)
  }
}

async function deleteCategory(req, res, next) {
  try {
    let category = await model.categories.getById(req.params.categoryId)
    if (category.length === 0) throw new CategoryError('Category not found')

    //delete all tag with this categoryId
    let tags = await model.tags.getByOrgaId(req.params.organizationId, { categoryId: req.params.categoryId })
    for (let tag of tags) {
      const result = await model.tags.delete(tag._id)
      if (result.deletedCount !== 1) throw new CategoryError('Error during the deletion of the tag')
    }

    const result = await model.categories.delete(req.params.categoryId)
    if (result.deletedCount !== 1) throw new CategoryError('Error during the deletion of the category')


    res.status(204).send()
  } catch (err) {
    next(err)
  }
}


module.exports = {
  getCategory,
  listCategory,
  createCategory,
  updateCategory,
  deleteCategory
}
