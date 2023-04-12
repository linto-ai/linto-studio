const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:tag:tag')
const model = require(`${process.cwd()}/lib/mongodb/models`)

const organizationUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const {
  TagError,
  TagConflict,
  TagUnsupportedMediaType
} = require(`${process.cwd()}/components/WebServer/error/exception/tag`)

async function getTag(req, res, next) {
  try {
    let tag = await model.tags.getById(req.params.tagId)
    if (tag.length === 0) res.status(204).send()
    else res.status(200).send(tag[0])
  } catch (err) {
    next(err)
  }
}

async function getTagByOrganization(req, res, next) {
  try {
    let tag = await model.tags.getByOrgaId(req.params.organizationId)

    if (tag.length === 0) res.status(204).send()
    else res.status(200).send(tag)

  } catch (err) {
    next(err)
  }
}

async function createTag(req, res, next) {
  try {
    if (!req.body.name) throw new TagUnsupportedMediaType('name is required')

    let tag = await model.tags.getByOrgaId(req.params.organizationId, { name: req.body.name })
    if (tag.length > 0) throw new TagConflict()

    req.body.organizationId = req.params.organizationId

    let category = await model.categories.getById(req.body.categoryId)
    if (category.length === 0) throw new TagError('categoryId not found')

    const result = await model.tags.create(req.body)
    if (result.insertedCount !== 1) throw new TagError('Error during the creation of the tag')

    res.status(201).send('Tag created')
  } catch (err) {
    next(err)
  }
}

async function updateTag(req, res, next) {
  try {
    let tag = await model.tags.getById(req.params.tagId)
    if (tag.length === 0) throw new TagError('Tag not found')

    let tag_name = await model.tags.getByOrgaId(req.params.organizationId, { name: req.body.name })
    if (tag_name.length === 1 && tag[0]._id !== tag_name[0]._id) throw new TagConflict()

    if (req.body.name) tag[0].name = req.body.name

    const result = await model.tags.update(tag[0])
    if (result.modifiedCount === 0) res.status(304).send('Nothing to update')
    else res.status(200).send('Tag updated')

  } catch (err) {
    next(err)
  }
}

async function deleteTag(req, res, next) {
  try {
    let tag = await model.tags.getById(req.params.tagId)
    if (tag.length === 0) throw new TagError('Tag not found')

    const result = await model.tags.delete(req.params.tagId)
    if (result.deletedCount !== 1) throw new TagError('Error during the deletion of the tag')

    res.status(200).send('Tag deleted')
  } catch (err) {
    next(err)
  }
}


async function searchTag(req, res, next) {
  try {
    if (req.body.name === undefined && req.body.tags === undefined) throw new TagUnsupportedMediaType('name or tags is required')

    let tags = []

    if (req.body.tags) {
      const userConversationsIds = (await organizationUtility
        .getUserConversationFromOrganization(req.payload.data.userId, req.params.organizationId))
        .map(conv => conv._id)

      const conversationsTags = (await model.search.conversations
        .getByIdsAndTag(userConversationsIds, req.body.tags.split(',')))
        .flatMap(conv => conv.tags)

      const uniqueTagIds = [...new Set([...conversationsTags])]
      tags = await model.search.tags.searchTag(uniqueTagIds, req.params.organizationId, req.body.name)

    } else {
      tags = await model.search.tags.searchByName(req.params.organizationId, req.body.name)
    }

    if (tags.length === 0) res.status(204).send()
    else {
      let categoriesList = {}
      for (let tag of tags) {
        if (!categoriesList[tag.categoryId]) {
          let category = await model.categories.getById(tag.categoryId)
          categoriesList[tag.categoryId] = { ...category[0], tags: [] }
        }
        categoriesList[tag.categoryId].tags.push(tag)
      }

      let searchResult = []
      for (let categoryId in categoriesList) {
        searchResult.push(categoriesList[categoryId])
      }
      res.status(200).send(searchResult)
    }

  } catch (err) {
    next(err)
  }
}

//get all tags by tagsId
async function getTagInfo(req, res, next) {
  try {
    if (req.body.tags === undefined) throw new TagUnsupportedMediaType('tags is required')
    let tags = await model.search.tags.getByIds(req.body.tags.split(','), req.params.organizationId)
    if (tags.length === 0) res.status(204).send()
    else {
      let categoriesList = {}
      for (let tag of tags) {
        if (!categoriesList[tag.categoryId]) {
          let category = await model.categories.getById(tag.categoryId)
          categoriesList[tag.categoryId] = { ...category[0], tags: [] }
        }
        categoriesList[tag.categoryId].tags.push(tag)
      }

      let searchResult = []
      for (let categoryId in categoriesList) {
        searchResult.push(categoriesList[categoryId])
      }
      res.status(200).send(searchResult)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getTag,
  getTagInfo,
  getTagByOrganization,
  createTag,
  updateTag,
  deleteTag,
  searchTag
}