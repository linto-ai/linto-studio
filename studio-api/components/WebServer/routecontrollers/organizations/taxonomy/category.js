const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:tag:category')
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const {
  CategoryError,
  CategoryTypeNotValid,
  CategoryConflict
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)

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

    if (category[0].type === TYPE.HIGHLIGHT)
      throw new CategoryError('Unable to delete a highlight category')

    //delete all tag with this categoryId
    let tags = await model.tags.getByOrgaId(req.params.organizationId, { categoryId: req.params.categoryId })

    for (let tag of tags) {
      const result = await model.tags.delete(tag._id)
      if (result.deletedCount !== 1) throw new CategoryError('Error during the deletion of the tag')
    }
    // Delete tags from conversations
    const tagsId = tags.map(tag => tag._id.toString())
    let conv_del_res = await model.conversations.deleteTag(req.params.organizationId, tagsId)

    const result = await model.categories.delete(req.params.categoryId)
    if (result.deletedCount !== 1) throw new CategoryError('Error during the deletion of the category')

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}


module.exports = {
  updateCategory,
  deleteCategory
}