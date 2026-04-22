const debug = require("debug")("linto:lib:mongodb:models:metadata")
const MongoModel = require(`../model`)

const moment = require("moment")

class TagModel extends MongoModel {
  constructor() {
    super("metadata")
  }

  async create(payload) {
    const dateTime = moment().format()
    payload.created = dateTime
    payload.last_update = dateTime
    return await this.mongoInsert(payload)
  }

  async getById(id) {
    return await this.mongoRequest({ _id: this.getObjectId(id) })
  }

  async getMetadata(conversationId, tagId) {
    const query = { conversationId }
    if (tagId) query.tagId = tagId
    return await this.mongoRequest(query)
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    payload.last_update = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }

  async deleteMetadataFromTag(tagId) {
    return await this.mongoDeleteMany({ tagId })
  }
}

module.exports = new TagModel()
