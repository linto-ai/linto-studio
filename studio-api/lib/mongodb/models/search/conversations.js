const MongoModel = require(`../../model`)
const debug = require("debug")("linto:lib:mongodb:models:search:conversations")

class ConvoModel extends MongoModel {
  constructor() {
    super("conversations")
  }

  async getByIdsAndTag(idList, tagList) {
    idList = idList.map((id) => {
      if (typeof id === "string") return this.getObjectId(id)
      else return id
    })

    const query = { _id: { $in: idList } }
    if (tagList) query.tags = { $all: tagList.split(",") }

    return await this.mongoRequest(query)
  }
}

module.exports = new ConvoModel()
