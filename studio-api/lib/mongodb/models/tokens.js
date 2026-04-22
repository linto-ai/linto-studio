const debug = require("debug")("linto:lib:mongodb:models:tokens")
const MongoModel = require(`../model`)
const ms = require("ms")

function getExpiresIn(defaultValue = "14d") {
  try {
    return ms(process.env.REFRESH_TOKEN_DAYS_TIME || defaultValue)
  } catch {
    return ms(defaultValue)
  }
}

class TokenModel extends MongoModel {
  constructor() {
    super("tokens")
  }

  async insert(user_id, salt, expires_in) {
    if (!expires_in) {
      expires_in = getExpiresIn()
    }
    const payload = {
      userId: user_id.toString(),
      salt,
      createdAt: new Date(Date.now()),
      expiresIn: expires_in,
      expiresAt: new Date(Date.now() + expires_in),
    }
    return await this.mongoInsert(payload)
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }

  async getTokenByUser(userId) {
    return await this.mongoRequest({ userId })
  }

  async getTokenById(id, userId) {
    return await this.mongoRequest({
      _id: this.getObjectId(id),
      userId,
    })
  }

  async deleteAllUserTokens(userId) {
    return await this.mongoDeleteMany({ userId }, true)
  }

  // Should only return the createdAt and expiresAt fields
  async getTokenByList(ids) {
    return await this.mongoRequest(
      { userId: { $in: ids } },
      {
        userId: 1,
        createdAt: 1,
        expiresAt: 1,
        expiresIn: 1,
        _id: 0,
      },
    )
  }
}

module.exports = new TokenModel()
