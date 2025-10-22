const MongoModel = require("../model")

class ActivityLog extends MongoModel {
  constructor() {
    super("activityLog")
  }

  async create(payload) {
    try {
      // const dateTime = moment().format()
      // payload.created = dateTime
      // payload.last_update = dateTime

      return await this.mongoInsert(payload)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ActivityLog()
