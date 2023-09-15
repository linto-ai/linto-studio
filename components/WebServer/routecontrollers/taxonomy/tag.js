
const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

async function getOrganizationTags(req, res, next) {
  try {
    const organizationId = await organizationUtility.getOrgaIdFromReq(req)
    let tag = await model.tags.getByOrgaId(organizationId)

    if (tag.length === 0) res.status(204).send()
    else res.status(200).send(tag)

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