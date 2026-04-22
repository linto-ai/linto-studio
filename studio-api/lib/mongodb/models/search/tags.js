const debug = require("debug")("linto:lib:mongodb:models:search:tags")
const MongoModel = require(`../../model`)
const { escapeRegex } = require("../../queryBuilders/filters")

class TagModel extends MongoModel {
  constructor() {
    super("tags")
  }

  async getByCategory(id) {
    return await this.mongoRequest({ categoryId: id })
  }

  async searchTagByCategory(categoryList, name) {
    const query = { categoryId: { $in: categoryList } }
    if (name) {
      query.name = { $regex: escapeRegex(name), $options: "i" }
    }
    return await this.mongoRequest(query)
  }

  async searchTag(idList, name) {
    idList = idList.map((id) => {
      if (typeof id === "string") return this.getObjectId(id)
      else return
    })
    const query = { _id: { $in: idList } }
    if (name) {
      query.name = { $regex: escapeRegex(name), $options: "i" }
    }
    return await this.mongoRequest(query)
  }
}

module.exports = new TagModel()
