const debug = require("debug")("linto:lib:mongodb:models:folders")
const MongoModel = require(`../model`)
const moment = require("moment")

class FolderModel extends MongoModel {
  constructor() {
    super("folders")
  }

  async create(payload) {
    try {
      const dateTime = moment().format()
      payload.created = dateTime
      payload.last_update = dateTime

      return await this.mongoInsert(payload)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getById(id) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByOrganizationId(organizationId) {
    try {
      const query = {
        organizationId: organizationId,
      }
      return await this.mongoRequest(query, {
        sort: { position: 1, created: 1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByParentId(organizationId, parentId) {
    try {
      const query = {
        organizationId: organizationId,
        parentId: parentId,
      }
      return await this.mongoRequest(query, {
        sort: { position: 1, created: 1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getTree(organizationId) {
    try {
      const pipeline = [
        {
          $match: { organizationId: organizationId },
        },
        {
          $graphLookup: {
            from: "folders",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parentId",
            as: "descendants",
            maxDepth: 10,
            restrictSearchWithMatch: { organizationId: organizationId },
          },
        },
        {
          $match: { parentId: null },
        },
        {
          $sort: { position: 1, created: 1 },
        },
      ]
      return await this.mongoAggregate(pipeline)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getDescendants(folderId, organizationId) {
    try {
      const pipeline = [
        {
          $match: { _id: this.getObjectId(folderId) },
        },
        {
          $graphLookup: {
            from: "folders",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parentId",
            as: "descendants",
            maxDepth: 10,
            restrictSearchWithMatch: { organizationId: organizationId },
          },
        },
        {
          $project: {
            descendants: 1,
          },
        },
      ]
      const result = await this.mongoAggregate(pipeline)
      if (result.length === 0) return []
      return result[0].descendants
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async countConversations(folderId) {
    try {
      const pipeline = [
        {
          $match: { _id: this.getObjectId(folderId) },
        },
        {
          $lookup: {
            from: "conversations",
            localField: "_id",
            foreignField: "folderId",
            as: "conversations",
          },
        },
        {
          $project: {
            conversationCount: { $size: "$conversations" },
          },
        },
      ]
      const result = await this.mongoAggregate(pipeline)
      if (result.length === 0) return 0
      return result[0].conversationCount
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async countConversationsByFolderIds(folderIds) {
    try {
      const objectIds = folderIds.map((id) =>
        typeof id === "string" ? this.getObjectId(id) : id,
      )
      const pipeline = [
        {
          $match: {
            folderId: { $in: objectIds.map((id) => id.toString()) },
          },
        },
        {
          $group: {
            _id: "$folderId",
            count: { $sum: 1 },
          },
        },
      ]

      const collection = require("../driver")
      const result = await require("../driver")
        .constructor.db.collection("conversations")
        .aggregate(pipeline)
        .toArray()

      const counts = {}
      result.forEach((r) => {
        counts[r._id] = r.count
      })
      return counts
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  async update(payload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(payload._id),
      }
      const dateTime = moment().format()
      payload.last_update = dateTime

      let mutableElements = { ...payload }
      delete mutableElements._id

      return await this.mongoUpdateOne(query, operator, mutableElements)
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

  async deleteAllFromParent(parentId) {
    try {
      const query = {
        parentId: parentId,
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async reparentChildren(oldParentId, newParentId) {
    try {
      const query = {
        parentId: oldParentId,
      }
      return await this.mongoUpdateMany(query, "$set", {
        parentId: newParentId,
        last_update: moment().format(),
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new FolderModel()
