const debug = require("debug")(
  "linto:lib:mongodb:models:search:tags",
)
const MongoModel = require(`../../model`)

class TagModel extends MongoModel {
  constructor() {
    super("tags") // define name of 'users' collection elsewhere?
  }

  async getByCategory(id) {
    try {
      const query = {
        categoryId: id,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async searchTagByCategory(categoryList, name = ".") {
    try {
      const query = {
        categoryId: {
          $in: categoryList,
        },
        name: {
          $regex: name,
          $options: "i",
        },
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async searchTag(idList, name = ".") {
    try {
      idList = idList.map((id) => {
        if (typeof id === "string") return this.getObjectId(id)
        else return
      })
      const query = {
        _id: {
          $in: idList,
        },
        name: {
          $regex: name,
          $options: "i",
        },
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new TagModel()
