const debug = require("debug")("linto:lib:mongodb:models:tags")
const MongoModel = require(`../model`)
const COLOR = require(`${process.cwd()}/lib/dao/organization/color`)
const DEFAULT_TAGS = require(`${process.cwd()}/config/tags`)
const { escapeRegex } = require("../queryBuilders/filters")

const moment = require("moment")

const tags_key = [
  "name",
  "organizationId",
  "categoryId",
  "created",
  "last_update",
]

class TagModel extends MongoModel {
  constructor() {
    super("tags")
  }

  /**
   * Create default tags for a given organization and category
   * @param {*} organizationId
   * @param {*} categoryId
   * @returns {Promise<Array<Tag>>}
   *
   * @todo: add default tags to the database (customizable via config)
   */
  async createDefaultTags(organizationId, categoryId) {
    const defaultsTags = [
      ...DEFAULT_TAGS,
      ...(process.env.DEFAULT_TAGS
        ? process.env.DEFAULT_TAGS.split(",").map((name) => ({
            name: name.trim(),
            emoji: null,
          }))
        : []),
    ]

    const tags = defaultsTags.map((tag) => ({
      name: tag.name,
      color: COLOR.getRandomColor(),
      description: "",
      organizationId: this.getObjectId(organizationId),
      categoryId: this.getObjectId(categoryId),
      emoji: tag.emoji,
    }))

    if (tags.length === 0) {
      return
    }

    return await this.mongoInsertMany(tags)
  }

  async create(payload) {
    const dateTime = moment().format()
    return await this.mongoInsert({
      created: dateTime,
      last_update: dateTime,
      name: payload.name,
      description: payload.description,
      color: payload.color,
      emoji: payload.emoji,
      categoryId: this.getObjectId(payload.categoryId),
      organizationId: this.getObjectId(payload.organizationId),
    })
  }

  async getById(id) {
    return await this.mongoRequest({ _id: this.getObjectId(id) })
  }

  async getTagByCategory(categoryId) {
    return await this.mongoRequest({ categoryId })
  }

  async getTagByCategoryAndProperties(properties) {
    const query = {
      categoryId: this.getObjectId(properties.categoryId),
      organizationId: this.getObjectId(properties.organizationId),
    }
    if (properties.name) {
      query.name = { $regex: escapeRegex(properties.name), $options: "i" }
    }
    if (properties.color) {
      query.color = properties.color
    }
    if (properties.emoji) {
      query.emoji = properties.emoji
    }
    return await this.mongoRequest(query)
  }

  async getByOrgAndCategoryId(
    organizationId,
    categoryId,
    withMediaCount = false,
    folderId = undefined,
  ) {
    const query = {
      organizationId: this.getObjectId(organizationId),
      categoryId: this.getObjectId(categoryId),
    }

    const tags = await this.mongoRequest(query)

    if (!withMediaCount || tags.length === 0) {
      return tags
    }

    const tagIdStrings = tags.map((t) => t._id.toString())

    const matchQuery = {
      "organization.organizationId": organizationId.toString(),
      tags: { $in: tagIdStrings },
    }
    if (folderId === "null" || folderId === null) {
      matchQuery.folderId = null
    } else if (folderId) {
      matchQuery.folderId = folderId
    }

    const MongoDriver = require("../driver")
    const counts = await MongoDriver.constructor.db
      .collection("conversations")
      .aggregate([
        { $match: matchQuery },
        { $unwind: "$tags" },
        { $match: { tags: { $in: tagIdStrings } } },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
      ])
      .toArray()

    const countMap = new Map(counts.map((c) => [c._id, c.count]))

    return tags.map((tag) => ({
      ...tag,
      mediaCount: countMap.get(tag._id.toString()) || 0,
    }))
  }

  async getTagByCategoryList(categoryIdList, name = undefined) {
    const query = { categoryId: { $in: categoryIdList } }
    if (name) {
      query.name = { $regex: escapeRegex(name), $options: "i" }
    }
    return await this.mongoRequest(query)
  }

  async getByIdList(idList, name = undefined) {
    if (idList.length === 0) return []
    if (typeof idList[0] === "string") {
      idList = idList.map((id) => this.getObjectId(id))
    }

    const query = { _id: { $in: idList } }
    if (name) {
      query.name = { $regex: escapeRegex(name), $options: "i" }
    }
    return await this.mongoRequest(query)
  }

  async getTagByCategoryAndName(categoryId, name) {
    return await this.mongoRequest({ categoryId, name })
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    payload.last_update = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }

  async deleteAllFromCategory(categoryId) {
    return await this.mongoDeleteMany({ categoryId })
  }
}

module.exports = new TagModel()
