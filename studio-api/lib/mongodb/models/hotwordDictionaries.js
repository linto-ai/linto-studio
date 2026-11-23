const MongoModel = require(`../model`)
const moment = require("moment")
const { escapeRegex } = require(`${process.cwd()}/lib/utility/escapeRegex`)

class HotwordDictionaryModel extends MongoModel {
  constructor() {
    super("hotwordDictionaries")
  }

  async create(payload) {
    try {
      const dateTime = moment().format()
      const doc = {
        created: dateTime,
        last_update: dateTime,
        name: payload.name,
        description: payload.description,
        organizationId: this.getObjectId(payload.organizationId),
        words: payload.words,
      }
      return await this.mongoInsert(doc)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByIdInOrganization(id, organizationId) {
    try {
      const query = {
        _id: this.getObjectId(id),
        organizationId: this.getObjectId(organizationId),
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByOrganizationId(organizationId) {
    try {
      const query = {
        organizationId: this.getObjectId(organizationId),
      }
      return await this.mongoRequest(query, {
        sort: { created: -1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByOrganizationIdAndName(organizationId, name) {
    try {
      const query = {
        organizationId: this.getObjectId(organizationId),
        name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
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
      payload.last_update = moment().format()

      return await this.mongoUpdateOne(query, operator, payload)
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

  async deleteAllFromOrganization(organizationId) {
    try {
      const query = {
        organizationId: this.getObjectId(organizationId),
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new HotwordDictionaryModel()
