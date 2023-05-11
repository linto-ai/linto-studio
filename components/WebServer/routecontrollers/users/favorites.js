const Mail = require('nodemailer/lib/mailer')

const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:users:favorite')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
    UserError,
} = require(`${process.cwd()}/components/WebServer/error/exception/users`)

const conversationUtility = require(`${process.cwd()}/components/WebServer/controllers/conversation/utility`)


async function addFav(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        const result = await model.favorites.add(req.payload.data.userId, req.params.conversationId)

        if (result.modifiedCount === 0) res.status(304).send()
        else res.status(201).send({ message: 'Conversation added to my favorites' })

    } catch (err) {
        next(err)
    }
}

async function deleteFav(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        const result = await model.favorites.deleteFav(req.payload.data.userId, req.params.conversationId)

        if (result.modifiedCount === 0) res.status(304).send()
        else res.status(200).send({ message: 'Conversation deleted from my favorites' })

    } catch (err) {
        next(err)
    }
}

async function listFav(req, res, next) {
    try {
        const userFav = await model.favorites.listFav(req.payload.data.userId)

        if (userFav.length === 0) res.status(204).send()
        else {

            let conv_favorite = []
            for (let favId of userFav[0].favorites) {
                let conv = await conversationUtility.userAccess(req.payload.data.userId, favId)
                // if access to the covnersation have been removed from the user we delete the conversation from the user favorite

                if (req.query.tags) {
                    let tags = req.query.tags.split(',')

                    const containsAll = tags.every(tag => conv.tags.includes(tag))
                    if(containsAll) conv_favorite.push(conv)
                } else if (conv) conv_favorite.push(conv)
                else await model.favorites.deleteFav(req.payload.data.userId, favId)
            }
            let conv_access = await conversationUtility.getUserRightFromConversationList(req.payload.data.userId, conv_favorite)


            res.status(200).send(conv_access)
        }

    } catch (err) {
        next(err)
    }
}

async function listFavTags(req, res, next) {
    try {
        const userFav = await model.favorites.listFav(req.payload.data.userId)

        if (userFav.length === 0) res.status(204).send()
        else {
            let listConv = await model.search.conversations.getByIdsAndTag(userFav[0].favorites, req.query.tags)

            let tags = []
            let categories = {}

            listConv.map(conv => listConv.tags.map(tag => (tags.indexOf(tag) === -1) ? tags.push(tag) : undefined))
            let tags_list = await model.tags.getByIdList(tags)

            for (const tag of tags_list) {
                const categoryId = tag.categoryId

                if (!categories[categoryId]) {
                    const category = (await model.categories.getById(categoryId))[0]
                    if (category === undefined) continue
                    categories[categoryId] = {
                        ...category,
                        tags: [],
                        searchedTag: false
                    }
                }
                categories[categoryId].tags.push(tag)
            }

            let searchResult = []
            for (const categoryId in categories) {
                delete categories[categoryId].searchedTag
                searchResult.push(categories[categoryId])
            }

            if (searchResult.length === 0) res.status(204).send()
            else res.status(200).send(searchResult)
        }
    } catch (err) {
        next(err)
    }
}


module.exports = {
    addFav,
    deleteFav,
    listFav,
    listFavTags
}