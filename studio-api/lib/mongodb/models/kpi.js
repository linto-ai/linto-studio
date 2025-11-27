const MongoModel = require("../model")

class Kpi extends MongoModel {
  constructor() {
    super("kpi")
  }

  async create(payload) {
    try {
      return await this.mongoInsert(payload)
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

      delete payload._id
      return await this.mongoUpdateOne(query, operator, payload)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByOrgaId(orgaId, timestamp) {
    try {
      const query = {
        "organization.id": orgaId,
        ...(timestamp && { timestamp: { $gte: timestamp } }),
      }

      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new Kpi()
