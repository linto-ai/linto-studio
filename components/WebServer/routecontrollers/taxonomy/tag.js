
const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)
const tagsUtility = require(`${process.cwd()}/components/WebServer/controllers/taxonomy/tags`)

async function getOrganizationTags(req, res, next) {
  try {
    const organizationId = await organizationUtility.getOrgaIdFromReq(req)

    let tags = await model.tags.getByOrgaId(organizationId, req.query)
    if (tags.length === 0) {
      res.status(204).send()
    }
    else if (req.query.expand === 'true') {
      res.status(200).send(await tagsUtility.fetchTagData(tags, req.query))
    }
    else {
      res.status(200).send(tags)
    }
  } catch (err) {
    next(err)
  }
}

async function getTag(req, res, next) {
  try {
    let tag = await model.tags.getById(req.params.tagId)
    if (tag.length === 0) res.status(204).send()
    else res.status(200).send(tag[0])
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getOrganizationTags,
  getTag
}