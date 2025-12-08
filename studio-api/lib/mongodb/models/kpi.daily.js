const MongoModel = require("../model")

class KpiDaily extends MongoModel {
  constructor() {
    super("kpi.daily")
  }

  async createOrUpdate(payload) {
    try {
      const { date, organizationId } = payload
      payload.createdAt = new Date()
      payload.date = new Date(date)

      const query = { organizationId, date }
      const operator = "$set"
      const options = { upsert: true }

      await this.mongoUpdateOne(query, operator, payload, options)

      const lastSeven = await this.mongoRequest(
        { organizationId },
        { date: -1 },
        7,
      )

      const keepIds = lastSeven.map((d) => d._id)
      await this.mongoDeleteMany({
        organizationId,
        _id: { $nin: keepIds },
      })

      return { success: true }
    } catch (error) {
      console.error(error)
      return { error }
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
}

module.exports = new KpiDaily()
