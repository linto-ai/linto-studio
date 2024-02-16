const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation`
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  CategoryTypeNotDefined,
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)


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



module.exports = {
  getOrganizationCategory,
}
