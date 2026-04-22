const MongoModel = require("../model")

class KpiSession extends MongoModel {
  constructor() {
    super("kpi.session")
  }

  async create(payload) {
    payload.timestamp = new Date()
    return await this.mongoInsert(payload)
  }

  async deleteSessions(ids) {
    return await this.mongoDeleteMany({ sessionId: { $in: ids } })
  }

  async getBy(params) {
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
  }

  async getAll(params) {
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
  }

  async getLastKpi() {
    return await this.mongoRequest({}, { sort: { timestamp: -1 }, limit: 1 })
  }

  async getBySessionId(sessionId) {
    return await this.mongoRequest({ sessionId })
  }

  async getBySessions(sessionIds) {
    return await this.mongoDistinct("sessionId", {
      sessionId: { $in: sessionIds },
    })
  }
}

module.exports = new KpiSession()
