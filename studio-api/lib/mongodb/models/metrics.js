const MongoModel = require("../model")

class MetricsModel extends MongoModel {
  constructor() {
    super("websocketConnections")
  }

  async startConnection(payload) {
    payload.startTime = new Date().toISOString()
    payload.endTime = null
    return this.mongoInsert(payload)
  }

  async endConnection(id) {
    const query = { _id: this.getObjectId(id) }
    const operator = "$set"
    const values = { endTime: new Date().toISOString() }
    return this.mongoUpdateOne(query, operator, values)
  }

  async getByOrganization(organizationId) {
    const query = { organizationId: organizationId.toString() }
    return this.mongoRequest(query)
  }
}

module.exports = new MetricsModel()
