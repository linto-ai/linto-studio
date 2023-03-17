const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:taxonomy:taxonomy')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  OrganizationError
} = require(`${process.cwd()}/components/WebServer/error/exception/organization`)

async function searchTaxonomy(req, res, next) {
  try {
    let conversation = []
    let convAccess = (await organizationUtility
      .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
      .map(conv => conv._id)

      debug(convAccess)

    if (!req.body.tags) throw new OrganizationError('Tags are required')
    let convTag = (await model.search.conversation.getByIdsAndTag(convAccess, req.body.tags.split(','))).map(conv => conv.tags)

    debug(convTag)

    res.status(200).send(conversation)
  } catch (err) {
    next(err)
  }
}

async function searchConversation(req, res, next) {
  try {
    let conversation = []
    let convAccess = (await organizationUtility
      .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
      .map(conv => conv._id)

    if (!req.body.tags) throw new OrganizationError('Tags are required')
    let convTag = (await model.search.conversation.getByIdsAndTag(convAccess, req.body.tags.split(','))).map(conv => conv._id)

    if (req.body.title) {
      conversation = await model.search.conversation.getByIdsAndTitle(convTag, req.body.title)
    } else if (req.body.text) {
      conversation = await model.search.conversation.getByIdsAndText(convTag, req.body.text)
    }

    res.status(200).send(conversation)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  searchTaxonomy,
  searchConversation
}

