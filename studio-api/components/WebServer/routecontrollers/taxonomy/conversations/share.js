const { DocumentAttributes } = require('docx')
const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation:share`)

const model = require(`${process.cwd()}/lib/mongodb/models`)


async function listShareTags(req, res, next) {
    try {
        const userId = req.payload.data.userId

        const sharedConversation = await model.conversations.getByShare(userId, req.query)
        let tags = []
        let categories = {}

        sharedConversation.list.map(conv => conv.tags.map(tag => (tags.indexOf(tag) === -1) ? tags.push(tag) : undefined))
        let tags_list = await model.tags.getByIdList(tags)

        for (const tag of tags_list) {
            const categoryId = tag.categoryId

            if (!categories[categoryId]) {
                const category = (await model.categories.getById(categoryId))[0]
                if (category === undefined) continue
                categories[categoryId] = {
                    ...category,
                    tags: []
                }
            }
            categories[categoryId].tags.push(tag)
        }

        let searchResult = []
        for (const categoryId in categories) {
            searchResult.push(categories[categoryId])
        }

        if (searchResult.length === 0) res.status(204).send()
        else res.status(200).send(searchResult)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    listShareTags
}