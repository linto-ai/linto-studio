const MongoModel = require("../model")

class KpiMontlhy extends MongoModel {
  constructor() {
    super("kpi.monthly")
  }

  async createOrUpdate(payload) {
    try {
      const { date, organizationId } = payload
      if (!/^\d{4}-\d{2}$/.test(date)) {
        throw new Error("month must be in YYYY-MM format")
      }
      payload.createdAt = new Date()

      const query = { organizationId, date }
      const options = { upsert: true }
      await this.mongoUpdateOne(query, "$set", payload, options)

      // Keep last 12 months
      const lastTwelve = await this.mongoRequest(
        { organizationId },
        { date: -1 },
        12,
      )

      const keepIds = lastTwelve.map((d) => d._id)

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
          if (/^\d{4}-\d{2}$/.test(value)) {
            query.date.$gte = value
          } else {
            query.date.$gte = new Date(value)
          }
        } else if (key === "endDate") {
          query.date = query.date || {}
          if (/^\d{4}-\d{2}$/.test(value)) {
            query.date.$lte = value
          } else {
            query.date.$lte = new Date(value)
          }
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

module.exports = new KpiMontlhy()
