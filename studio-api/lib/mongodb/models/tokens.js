const debug = require("debug")(
  "linto:conversation-manager:models:mongodb:models:token",
)
const MongoModel = require(`../model`)

class TokenModel extends MongoModel {
  constructor() {
    super("tokens") // define name of 'users' collection elsewhere?
  }

  async insert(user_id, salt, expires_in) {
    try {
      let payload = {
        userId: user_id.toString(),
        salt: salt,
        createdAt: new Date(Date.now()),
      }
      if (expires_in) {
        payload.expiresIn = expires_in
        payload.expiresAt = new Date(Date.now() + expires_in * 1000)
      }
      return await this.mongoInsert(payload)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async delete(id) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }
      return await this.mongoDelete(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getTokenByUser(userId) {
    try {
      const query = {
        userId: userId,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getTokenById(id, userId) {
    try {
      const query = {
        _id: this.getObjectId(id),
        userId: userId,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllUserTokens(userId) {
    try {
      const query = {
        userId: userId,
      }
      return await this.mongoDeleteMany(query, true)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // Should only return the createdAt and expiresAt fields
  async getTokenByList(ids) {
    try {
      const query = {
        userId: { $in: ids },
      }
      return await this.mongoRequest(query, {
        userId: 1,
        createdAt: 1,
        expiresAt: 1,
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new TokenModel()
