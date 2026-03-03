const debug = require("debug")(
  "linto:lib:mongodb:models:tags",
)
const MongoModel = require(`../model`)
const COLOR = require(`${process.cwd()}/lib/dao/organization/color`)
const DEFAULT_TAGS = require(`${process.cwd()}/config/tags`)

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
    super("tags") // define name of 'users' collection elsewhere?
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
      ...(process.env.DEFAULT_TAGS ? process.env.DEFAULT_TAGS.split(",") : []),
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
    try {
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
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getById(id) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }

      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getTagByCategory(categoryId) {
    try {
      let query = {
        categoryId: categoryId,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getTagByCategoryAndProperties(properties) {
    try {
      let query = {
        categoryId: this.getObjectId(properties.categoryId),
        organizationId: this.getObjectId(properties.organizationId),
      }
      if (properties.name) {
        query.name = {
          $regex: properties.name,
          $options: "i",
        }
      }
      if (properties.color) {
        query.color = properties.color
      }
      if (properties.emoji) {
        query.emoji = properties.emoji
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByOrgAndCategoryId(
    organizationId,
    categoryId,
    withMediaCount = false,
  ) {
    try {
      const query = {
        organizationId: this.getObjectId(organizationId),
        categoryId: this.getObjectId(categoryId),
      }

      const tags = await this.mongoRequest(query)

      if (!withMediaCount || tags.length === 0) {
        return tags
      }

      const tagIdStrings = tags.map((t) => t._id.toString())

      const MongoDriver = require("../driver")
      const counts = await MongoDriver.constructor.db
        .collection("conversations")
        .aggregate([
          {
            $match: {
              "organization.organizationId": organizationId.toString(),
              tags: { $in: tagIdStrings },
            },
          },
          { $unwind: "$tags" },
          {
            $match: {
              tags: { $in: tagIdStrings },
            },
          },
          {
            $group: {
              _id: "$tags",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray()

      const countMap = new Map(counts.map((c) => [c._id, c.count]))

      return tags.map((tag) => ({
        ...tag,
        mediaCount: countMap.get(tag._id.toString()) || 0,
      }))
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getTagByCategoryList(categoryIdList, name = undefined) {
    try {
      let query = {
        categoryId: {
          $in: categoryIdList,
        },
      }
      if (name) {
        query.name = {
          $regex: name,
          $options: "i",
        }
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByIdList(idList, name = undefined) {
    try {
      if (idList.length === 0) return []
      else if (typeof idList[0] === "string") {
        idList = idList.map((id) => this.getObjectId(id))
      }

      let query = {
        _id: {
          $in: idList,
        },
      }
      if (name) {
        query.name = {
          $regex: name,
          $options: "i",
        }
      }

      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getTagByCategoryAndName(categoryId, name) {
    try {
      let query = {
        categoryId: categoryId,
        name: name,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async update(payload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(payload._id),
      }
      const dateTime = moment().format()
      payload.last_update = dateTime

      let mutableElements = payload
      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async delete(id) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }
      return await this.mongoDelete(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllFromCategory(categoryId) {
    try {
      const query = {
        categoryId: categoryId,
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new TagModel()
