const debug = require("debug")(
  "linto:conversation-manager:models:mongodb:models:sessionData",
)
const MongoModel = require(`../model`)

class SessionData extends MongoModel {
  constructor() {
    super("sessionData") // define name of 'users' collection elsewhere?
  }

  async create(payload) {
    try {
      if (!payload.sessionId || !payload.organizationId) {
        throw new Error("Missing required fields: sessionId, organizationId")
      }

      if (!payload.name && !payload.password) {
        throw new Error("Either name or password must be provided")
      }

      return await this.mongoInsert(payload)
    } catch (error) {
      debug("Error creating session alias:", error)
      throw error
    }
  }

  async getAll() {
    try {
      return await this.mongoRequest({})
    } catch (error) {
      debug("Error getting all session names:", error)
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
    try {
      return this.getByField({ _id: id })
    } catch (error) {
      throw error
    }
  }

  async getBySessionId(sessionId) {
    try {
      return this.getByField({ sessionId })
    } catch (error) {
      throw error
    }
  }

  async getByName(name) {
    try {
      return this.getByField({ name }, false)
    } catch (error) {
      throw error
    }
  }

  async getByOrganizationAndName(organizationId, name) {
    try {
      return this.getByField({ organizationId, name })
    } catch (error) {
      throw error
    }
  }

  async getByOrganizationAndId(organizationId, id) {
    try {
      return this.getByField({ organizationId, _id: id })
    } catch (error) {
      throw error
    }
  }

  async getByOrganization(organizationId, query) {
    try {
      let customQuery = {}
      if (query.sessionId) customQuery.sessionId = query.sessionId
      if (query.name) customQuery.name = query.name

      return this.getByField({ organizationId, ...customQuery })
    } catch (error) {
      throw error
    }
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

module.exports = new SessionData()
