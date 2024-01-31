const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation`
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  TagUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/tag`)

const {
  CategoryTypeNotDefined,
  CategoryConflict,
  CategoryError,
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)

async function createCategory(req, res, next) {
  try {
    let organizationId = await organizationUtility.getOrgaIdFromReq(req)

    let category = await model.categories.getByOrgaId(organizationId, {
      name: req.body.name,
    })

    if (category.length > 0)
      throw new CategoryConflict(
        `Conflict with category name ${req.body.name} already exist. Category id ${category[0]._id}`
      )
    if (!req.body.color) req.body.color = "white"
    if (!req.body.type) throw new CategoryTypeNotDefined()
    else if (TYPE.checkValue(req.body.type) === false)
      throw new TagUnsupportedMediaType("Type not supported")
    req.body.organizationId = organizationId

    const result = await model.categories.create(req.body)
    if (result.insertedCount !== 1)
      throw new CategoryError("Error during the creation of the category")

    const category_created = await model.categories.getById(
      result.insertedId.toString()
    )
    return res.status(201).send(category_created[0])
  } catch (err) {
    next(err)
  }
}

async function getOrganizationCategory(req, res, next) {
  try {
    const organizationId = await organizationUtility.getOrgaIdFromReq(req)

    let category = await model.categories.getByOrgaId(organizationId)

    if (req.query.type) {
      if (TYPE.checkValue(req.query.type))
        category = category.filter((cat) => cat.type === req.query.type)
      else throw new CategoryTypeNotDefined()
    }

    let metadata = []
    if (req.query.expand === "true")
      metadata = await model.metadata.getMetadata(req.params.conversationId)

    if (category.length === 0) res.status(204).send()
    else {
      let tag_filter
      if (req.query.expand === "true") {
        if (req.query.possess === "true") {
          const conversation = await model.conversations.getById(
            req.params.conversationId
          )
          tag_filter = conversation[0].tags
        }

        for (let i = 0; i < category.length; i++) {
          const tags = await model.search.tags.getByCategory(
            category[i]._id.toString()
          )
          if (tags.length > 0 && req.query.possess === "true") {
            let tags_filtered = tags.filter((tag) =>
              tag_filter.includes(tag._id.toString())
            )
            category[i].tags = tags_filtered
          } else category[i].tags = tags

          if (metadata.length > 0) {
            category[i].tags.map(tag => {

              const matchingMetadata = metadata
                .filter(meta => meta.tagId === tag._id.toString())
                .map(({ _id, schema, value }) => ({ _id, schema, value }))
              tag.metadata = matchingMetadata


              return tag
            })
          }
        }
      }
      res.status(200).send(category)
    }
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
  getOrganizationCategory,
}
