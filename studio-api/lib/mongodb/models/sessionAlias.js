const debug = require("debug")(
  "linto:conversation-manager:models:mongodb:models:sessionAlias",
)
const MongoModel = require(`../model`)

class SessionAlias extends MongoModel {
  constructor() {
    super("sessionAlias") // define name of 'users' collection elsewhere?
  }

  async create(payload) {
    try {
      if (!payload.sessionId || !payload.name || !payload.organizationId) {
        throw new Error(
          "Missing required fields: sessionId, name, organizationId",
        )
      }
      return await this.mongoInsert(payload)
    } catch (error) {
      debug("Error creating session name:", error)
      throw error
    }
  }

  async getByField(fields, queryMatching = true) {
    try {
      let query = { ...fields }

      if (query._id || query.id) {
        query._id = this.getObjectId(query._id || query.id)
        delete query.id
      }
      if (query.name && queryMatching) {
        query.name = { $regex: query.name, $options: "i" }
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getById(id) {
    return this.getByField({ _id: id })
  }

  async getBySessionId(sessionId) {
    return this.getByField({ sessionId })
  }

  async getByName(name) {
    return this.getByField({ name }, false)
  }

  async getByOrganizationAndName(organizationId, name) {
    return this.getByField({ organizationId, name })
  }

  async getByOrganizationAndId(organizationId, id) {
    return this.getByField({ organizationId, _id: id })
  }

  async getByOrganization(organizationId, query) {
    return this.getByField({ organizationId, ...query })
  }

  async update(id, payload) {
    try {
      const operator = "$set"
      if (!id) throw new Error("Missing _id in payload")
      const query = { _id: this.getObjectId(id) }

      return await this.mongoUpdateOne(query, operator, payload)
    } catch (error) {
      debug("Error updating session name:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const query = { _id: this.getObjectId(id) }
      return await this.mongoDelete(query)
    } catch (error) {
      debug("Error deleting session name:", error)
      throw error
    }
  }

  async deleteByOrganizationAndSession(organizationId, sessionId) {
    try {
      const query = { organizationId, sessionId }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      debug(
        "Error deleting session links by organizationId and sessionId:",
        error,
      )
      throw error
    }
  }
}

module.exports = new SessionAlias()
