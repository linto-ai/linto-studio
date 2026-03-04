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
        sort: { name: 1, created: 1 },
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
        sort: { name: 1, created: 1 },
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
          $sort: { name: 1, created: 1 },
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

      const MongoDriver = require("../driver")
      const result = await MongoDriver.constructor.db
        .collection("conversations")
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

  async updateDescendantsVisibility(descendantIds, visibility, owner, members) {
    try {
      const objectIds = descendantIds.map((id) =>
        typeof id === "string" ? this.getObjectId(id) : id,
      )
      const query = {
        _id: { $in: objectIds },
      }
      return await this.mongoUpdateMany(query, "$set", {
        visibility,
        owner,
        members,
        last_update: moment().format(),
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getAncestors(folderId, organizationId) {
    try {
      const ancestors = []
      const current = await this.getById(folderId)
      if (current.length === 0) return []

      let parentId = current[0].parentId
      while (parentId) {
        const parent = await this.getById(parentId)
        if (parent.length === 0) break
        if (parent[0].organizationId !== organizationId) break
        ancestors.push(parent[0])
        parentId = parent[0].parentId
        if (ancestors.length > 10) break
      }

      return ancestors
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getSubtreeDepth(folderId, organizationId) {
    try {
      const descendants = await this.getDescendants(folderId, organizationId)
      if (descendants.length === 0) return 0

      // BFS to compute max depth from folderId
      const childrenMap = {}
      for (const d of descendants) {
        const parent = d.parentId || null
        if (!childrenMap[parent]) childrenMap[parent] = []
        childrenMap[parent].push(d._id.toString())
      }

      let maxDepth = 0
      const queue = [{ id: folderId, depth: 0 }]
      while (queue.length > 0) {
        const { id, depth } = queue.shift()
        const children = childrenMap[id] || []
        for (const childId of children) {
          const childDepth = depth + 1
          if (childDepth > maxDepth) maxDepth = childDepth
          queue.push({ id: childId, depth: childDepth })
        }
      }

      return maxDepth
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
