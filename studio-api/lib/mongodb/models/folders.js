const debug = require("debug")("linto:lib:mongodb:models:folders")
const MongoModel = require(`../model`)
const moment = require("moment")

class FolderModel extends MongoModel {
  constructor() {
    super("folders")
  }

  async create(payload) {
    const dateTime = moment().format()
    payload.created = dateTime
    payload.last_update = dateTime

    return await this.mongoInsert(payload)
  }

  async getById(id) {
    const query = {
      _id: this.getObjectId(id),
    }
    return await this.mongoRequest(query)
  }

  async getByOrganizationId(organizationId) {
    const query = {
      organizationId: organizationId,
    }
    return await this.mongoRequest(query, {
      sort: { name: 1, created: 1 },
    })
  }

  async getByParentId(organizationId, parentId) {
    const query = {
      organizationId: organizationId,
      parentId: parentId,
    }
    return await this.mongoRequest(query, {
      sort: { name: 1, created: 1 },
    })
  }

  async getTree(organizationId) {
    const allFolders = await this.mongoRequest(
      { organizationId },
      { sort: { name: 1, created: 1 } },
    )

    // Build descendants map
    const childrenMap = {}
    for (const folder of allFolders) {
      const pid = folder.parentId || null
      if (!childrenMap[pid]) childrenMap[pid] = []
      childrenMap[pid].push(folder)
    }

    const collectDescendants = (folderId) => {
      const result = []
      const queue = [...(childrenMap[folderId] || [])]
      while (queue.length > 0) {
        const child = queue.shift()
        result.push(child)
        const grandchildren = childrenMap[child._id.toString()] || []
        queue.push(...grandchildren)
      }
      return result
    }

    const roots = allFolders.filter((f) => !f.parentId)
    return roots.map((root) => ({
      ...root,
      descendants: collectDescendants(root._id.toString()),
    }))
  }

  async getDescendants(folderId, organizationId) {
    const descendants = []
    const queue = [folderId]

    while (queue.length > 0) {
      const currentId = queue.shift()
      const children = await this.mongoRequest({
        organizationId,
        parentId: currentId,
      })
      for (const child of children) {
        descendants.push(child)
        queue.push(child._id.toString())
      }
      if (descendants.length > 1000) break
    }

    return descendants
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
    const operator = "$set"
    const query = {
      _id: this.getObjectId(payload._id),
    }
    const dateTime = moment().format()
    payload.last_update = dateTime

    let mutableElements = { ...payload }
    delete mutableElements._id

    return await this.mongoUpdateOne(query, operator, mutableElements)
  }

  async delete(id) {
    const query = {
      _id: this.getObjectId(id),
    }
    return await this.mongoDelete(query)
  }

  async updateDescendantsVisibility(descendantIds, visibility, owner, members) {
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
  }

  async getAncestors(folderId, organizationId) {
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
  }

  async getSubtreeDepth(folderId, organizationId) {
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
  }

  async reparentChildren(oldParentId, newParentId, organizationId) {
    const query = {
      parentId: oldParentId,
      organizationId: organizationId,
    }
    return await this.mongoUpdateMany(query, "$set", {
      parentId: newParentId,
      last_update: moment().format(),
    })
  }
}

module.exports = new FolderModel()
