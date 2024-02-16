const debug = require("debug")(
    `linto:conversation-manager:components:WebServer:routeControllers:conversation`
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const DEFAULT_COLOT = 'white'

const {
    TagUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/tag`)

const {
    CategoryUnsupportedMediaTypepeNotDefined,
    CategoryConflict,
    CategoryError,
} = require(`${process.cwd()}/components/WebServer/error/exception/category`)

async function getOrganizationCategory(req, res, next) {
    try {
        const scopeId = /*req.params.conversationId || */req.params.organizationId
        let category = await model.categories.getByScope(scopeId)

        // With the scope id of an organization, we only got a list of categories of label type
        if (category.length === 0) return res.status(204).send()

        // let metadata = []
        // if (req.query.expand === "true")
        //     metadata = await model.metadata.getMetadata(req.params.conversationId)

        // let tag_filter
        // if (req.query.expand === "true") {
        //     if (req.query.possess === "true") {
        //         const conversation = await model.conversations.getById(
        //             req.params.conversationId
        //         )
        //         tag_filter = conversation[0].tags
        //     }

        //     for (let i = 0; i < category.length; i++) {
        //         const tags = await model.search.tags.getByCategory(
        //             category[i]._id.toString()
        //         )
        //         if (tags.length > 0 && req.query.possess === "true") {
        //             let tags_filtered = tags.filter((tag) =>
        //                 tag_filter.includes(tag._id.toString())
        //             )
        //             category[i].tags = tags_filtered
        //         } else category[i].tags = tags

        //         if (metadata.length > 0) {
        //             category[i].tags.map(tag => {

        //                 const matchingMetadata = metadata
        //                     .filter(meta => meta.tagId === tag._id.toString())
        //                     .map(({ _id, schema, value }) => ({ _id, schema, value }))
        //                 tag.metadata = matchingMetadata


        //                 return tag
        //             })
        //         }
        //     }
        // }
        res.status(200).send(category)
    } catch (err) {
        next(err)
    }
}


module.exports = {

    getOrganizationCategory,
}
