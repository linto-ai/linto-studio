const MongoModel = require("../model")

class MetricsModel extends MongoModel {
  constructor() {
    super("websocketMetrics")
  }

  async getBySocketId(socketId) {
    const query = { socketId: socketId.toString() }
    return this.mongoRequest(query)
  }

  async startConnection(payload) {
    payload.startTime = new Date().toISOString()
    payload.endTime = null
    return this.mongoInsert(payload)
  }

  async endConnection(socketId) {
    const query = { socketId: socketId }

    await this.mongoUpdateOne(query, "$set", {
      endTime: new Date().toISOString(),
    })

    return await this.mongoUpdateOne(query, "$unset", {
      socketId: "",
    })
  }

  async getByOrganization(organizationId) {
    const query = { organizationId: organizationId.toString() }
    return this.mongoRequest(query)
  }

  async getBySession(sessionId) {
    const query = { sessionId: sessionId.toString() }
    return this.mongoRequest(query)
  }
}

module.exports = new MetricsModel()
