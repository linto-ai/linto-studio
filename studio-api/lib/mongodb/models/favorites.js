const debug = require("debug")("linto:lib:mongodb:models:favorites")
const MongoModel = require(`../model`)
const {
  USER_FAVORITES_PROJECTION: favorites_projection,
} = require("../queryBuilders/projections")

// Manage user favorites conversations
class UsersModel extends MongoModel {
  constructor() {
    super("users")
  }

  async add(id, convId) {
    return await this.mongoUpdateOne(
      { _id: this.getObjectId(id) },
      "$addToSet",
      { favorites: convId },
    )
  }

  async deleteFav(id, convId) {
    return await this.mongoUpdateOne({ _id: this.getObjectId(id) }, "$pull", {
      favorites: convId,
    })
  }

  async listFav(id) {
    return await this.mongoRequest(
      { _id: this.getObjectId(id) },
      favorites_projection,
    )
  }
}

module.exports = new UsersModel()
