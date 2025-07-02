const debug = require("debug")(
  "linto:conversation-manager:models:mongodb:models:tags",
)
const MongoModel = require(`../model`)

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
    try {
      const tags = [].map((tag) => ({
        ...tag,
        organizationId: this.getObjectId(organizationId),
        categoryId: this.getObjectId(categoryId),
      }))
      return await this.mongoInsertMany(tags)
    } catch (error) {
      console.error(error)
      return error
    }
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
      const pipeline = []

      pipeline.push({
        $match: {
          organizationId: this.getObjectId(organizationId),
          categoryId: this.getObjectId(categoryId),
        },
      })

      if (withMediaCount) {
        pipeline.push({
          $lookup: {
            from: "conversations",
            let: { tagId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$organization.organizationId",
                          organizationId.toString(),
                        ],
                      },
                      { $in: ["$$tagId", "$tags"] },
                    ],
                  },
                },
              },
            ],
            as: "media",
          },
        })

        pipeline.push({
          $addFields: { mediaCount: { $size: "$media" } },
        })
        pipeline.push({ $project: { media: 0 } })
      }

      return await this.mongoAggregate(pipeline)
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
