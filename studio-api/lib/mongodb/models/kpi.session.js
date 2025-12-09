const MongoModel = require("../model")

class KpiSession extends MongoModel {
  constructor() {
    super("kpi.session")
  }

  async create(payload) {
    try {
      payload.createdAt = new Date()
      return await this.mongoInsert(payload)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getBy(params) {
    try {
      const filterKeys = ["size", "page", "sortField", "sortCriteria"]
      const projection = { skipProjection: true }

      const filter = {}
      const query = {}

      for (const [key, value] of Object.entries(params)) {
        if (key === "userScope") continue

        if (filterKeys.includes(key)) {
          filter[key] = value
        } else if (key === "startDate") {
          query.date = query.date || {}
          query.date.$gte = new Date(value)
        } else if (key === "endDate") {
          query.date = query.date || {}
          query.date.$lte = new Date(value)
        } else {
          query[key] = value
        }
      }
      return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getAll(params) {
    try {
      const filterKeys = ["size", "page", "sortField", "sortCriteria"]
      const projection = { skipProjection: true }

      const filter = {}
      const query = {}

      for (const [key, value] of Object.entries(params)) {
        if (key === "userScope") continue

        if (filterKeys.includes(key)) filter[key] = value
        else query[key] = value
      }
      return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getBySessionId(sessionId) {
    try {
      const query = {
        sessionId: sessionId,
      }
      console.log(query)
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getBySessions(sessionIds) {
    try {
      return await this.mongoDistinct("sessionId", {
        sessionId: { $in: sessionIds },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new KpiSession()
