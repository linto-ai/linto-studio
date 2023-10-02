
const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

async function getOrganizationTags(req, res, next) {
  try {
    const organizationId = await organizationUtility.getOrgaIdFromReq(req)

    let expand = req.query.expand
    delete req.query.expand

    let tags = await model.tags.getByOrgaId(organizationId, req.query)
    if (tags.length === 0) res.status(204).send()
    else if (expand === 'true') {
      let ignoredList = []
      let categoriesList = {}

      for (let tag of tags) {
        if (ignoredList.includes(tag.categoryId)) continue // should skip if the category has already been ignored

        if (!categoriesList[tag.categoryId]) {
          let category = (await model.categories.getById(tag.categoryId))[0]
          categoriesList[tag.categoryId] = { ...category, tags: [] }
        }
        categoriesList[tag.categoryId].tags.push(tag)
      }
      let searchResult = []
      for (let categoryId in categoriesList) {
        searchResult.push(categoriesList[categoryId])
      }
      res.status(200).send(searchResult)
    }
    else res.status(200).send(tags)

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