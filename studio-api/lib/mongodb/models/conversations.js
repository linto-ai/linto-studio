const MongoModel = require(`../model`)
const debug = require("debug")("linto:lib:mongodb:models:conversations")
const { calculateObjectSize } = require("bson")

const moment = require("moment")
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const TYPE = require(`${process.cwd()}/lib/dao/conversation/types`)

const { toObjectIds } = require("../queryBuilders/ids")
const {
  customRightsAllowed,
  customRightsNotMember,
  sharedWithUsersAllowed,
} = require("../queryBuilders/rights")
const {
  applyNameTextSearch,
  applyTagAllFilter,
} = require("../queryBuilders/filters")

const BSON_MAX_SIZE = 16 * 1024 * 1024

const LIGHT_CONVERSATION_PROJECTION = {
  text: 0,
  speakers: 0,
  keywords: 0,
  highlights: 0,
}

const LIST_CONVERSATION_PROJECTION = {
  page: 0,
  text: 0,
  "jobs.transcription.job_logs": 0,
}

class ConvoModel extends MongoModel {
  constructor() {
    super("conversations")
  }

  async create(conversation) {
    try {
      const dateTime = moment().format()
      conversation.created = dateTime
      conversation.last_update = dateTime

      if (conversation.text?.length > 0) {
        let docSize = calculateObjectSize(conversation)
        if (docSize > BSON_MAX_SIZE) {
          const originalCount = conversation.text.length
          while (docSize > BSON_MAX_SIZE && conversation.text.length > 0) {
            conversation.text = conversation.text.slice(
              0,
              Math.floor(conversation.text.length * 0.8),
            )
            docSize = calculateObjectSize(conversation)
          }
          debug(
            `Conversation document exceeded BSON 16MB limit (${originalCount} turns), truncated to ${conversation.text.length} turns`,
          )
        }
      }

      return await this.mongoInsert(conversation)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async update(payload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(payload._id),
      }

      if (payload.organizationId) delete payload.organizationId

      const dateTime = moment().format()
      payload.last_update = dateTime

      delete payload._id
      let mutableElements = payload

      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async updateRights(
    conversationId,
    organizationId,
    membersRight,
    customRights,
  ) {
    try {
      const query = {
        _id: this.getObjectId(conversationId),
        "organization.organizationId": organizationId,
      }
      return await this.mongoUpdateOne(query, "$set", {
        "organization.membersRight": membersRight,
        "organization.customRights": customRights,
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getConversationFromParent(id, projectionArray) {
    try {
      let query = {
        "type.from_parent_id": id,
      }

      let projection = {}
      if (projectionArray) {
        projectionArray.map((element) => {
          projection[element] = 1
        })
      }

      return await this.mongoRequest(query, projection)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByIdWithFilter(convId, projection) {
    try {
      const query = {
        _id: this.getObjectId(convId),
      }

      return await this.mongoRequest(query, projection)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getById(convoId, projectionArray) {
    try {
      const query = {
        _id: this.getObjectId(convoId),
      }
      let projection = {}
      if (projectionArray) {
        projectionArray.map((element) => {
          projection[element] = 1
        })
      }
      return await this.mongoRequest(query, projection)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getConvsListByIds(convIds, filter) {
    try {
      convIds = toObjectIds(convIds, this.getObjectId)
      const query = {
        _id: {
          $in: convIds,
        },
      }
      return await this.mongoRequest(query, filter)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // list conversation shared to the user
  async getByShare(idUser, filter = undefined) {
    try {
      let projection = {
        ...LIGHT_CONVERSATION_PROJECTION,
        "jobs.transcription.job_logs": 0,
      }

      const query = {
        "type.mode": TYPE.CANONICAL,
        sharedWithUsers: {
          $elemMatch: {
            userId: idUser.toString(),
            right: { $bitsAnySet: RIGHTS.READ }, // Only get conversation where user has read access
          },
        },
      }

      if (filter?.name) {
        query.name = {
          $regex: filter.name,
          $options: "i",
        }
      }

      if (filter?.description) {
        query.description = {
          $regex: filter.description,
          $options: "i",
        }
      }
      if (filter?.tags) {
        filter.tags = filter.tags.split(",")
        query.tags = {
          $all: filter.tags,
        }
      }

      if (filter?.text) {
        query["text.raw_segment"] = {
          $regex: filter.text,
          $options: "i",
        }
      }

      if (!filter) return await this.mongoRequest(query, projection)
      else return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async getTagByOrga(idOrga, tags) {
    const query = {
      "organization.organizationId": idOrga.toString(),
    }
    if (tags) {
      tags = tags.split(",")
      query.tags = {
        $all: tags,
      }
    }

    const projection = {
      tags: 1,
    }

    return await this.mongoRequest(query, projection)
  }

  async getByOrga(idOrga, projection) {
    try {
      const query = {
        "organization.organizationId": idOrga.toString(),
        "type.mode": TYPE.CANONICAL,
      }
      if (!projection) {
        projection = { ...LIGHT_CONVERSATION_PROJECTION }
      }
      return await this.mongoRequest(query, projection)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async getSharedConvFromOrga(idOrga, idUser) {
    try {
      const query = {
        "organization.organizationId": idOrga.toString(),
        "type.mode": TYPE.CANONICAL,
        sharedWithUsers: {
          $elemMatch: {
            userId: idUser.toString(),
          },
        },
      }
      return await this.mongoRequest(query, {
        _id: 1,
        sharedWithUsers: 1,
        organization: 1,
      })
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async updateConvOnTranscriptionResult(_id, conversation) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(_id),
      }

      let mutableElements = {
        speakers: conversation.speakers,
        text: conversation.text,
        metadata: conversation.metadata,
        jobs: conversation.jobs,
      }

      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async updateJob(_id, jobPayload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(_id),
      }
      let mutableElements = {
        jobs: { ...jobPayload },
      }
      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async updateTurn(_id, text) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(_id),
      }
      const dateTime = moment().format()
      let mutableElements = {
        text: [...text],
        last_update: dateTime,
      }

      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async updateTag(_id, tags) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(_id),
      }
      let mutableElements = {
        tags: [...tags],
      }

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

  async deleteTag(orgaId, tags) {
    try {
      const query = {
        "organization.organizationId": orgaId.toString(),
      }
      const operator = "$pull"

      let tagIds = tags
      if (typeof tags === "string") tagIds = tags.split(",")

      const values = {
        tags: {
          $in: tagIds,
        },
      }
      return await this.mongoUpdateMany(query, operator, values)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async addSharedUser(id, shared) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }
      const operator = "$addToSet"
      const values = {
        sharedWithUsers: shared,
      }
      return await this.mongoUpdateOne(query, operator, values)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async listProcessingConversations(organizationId) {
    try {
      const query = {
        "organization.organizationId": organizationId.toString(),
        "jobs.transcription.state": {
          $nin: ["error", "done"],
        },
        "type.mode": TYPE.CANONICAL,
      }

      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // Default right is 1 (read)
  async listConvFromOrga(
    organizationId,
    userId,
    userRole,
    desiredAccess = 1,
    filter,
  ) {
    try {
      let projection = { ...LIST_CONVERSATION_PROJECTION }

      let query = {
        "organization.organizationId": organizationId.toString(),
        "type.mode": TYPE.CANONICAL,
        $or: [
          customRightsAllowed(userId, desiredAccess),
          customRightsNotMember(userId),
        ],
      }

      if (filter.folderId !== undefined) {
        if (filter.folderId === null || filter.folderId === "null") {
          query.$and = query.$and || []
          query.$and.push({
            $or: [{ folderId: null }, { folderId: { $exists: false } }],
          })
        } else {
          query.folderId = filter.folderId
        }
      }

      if (filter.excludeFolderIds && filter.excludeFolderIds.length > 0) {
        query.$and = query.$and || []
        query.$and.push({
          $or: [
            { folderId: { $nin: filter.excludeFolderIds } },
            { folderId: null },
            { folderId: { $exists: false } },
          ],
        })
      }

      if (filter.tags && filter.filter === "notags") {
        query.tags = {
          $nin: filter.tags,
        }
      } else if (filter.tags) {
        query.tags = {
          $all: filter.tags.split(","),
        }
      }

      if (["pending", "processing", "queued"].includes(filter?.processing)) {
        query["jobs.transcription.state"] = {
          $nin: ["error", "done"],
        }
        projection.skipProjection = true
      } else if (filter?.processing === "done") {
        query["jobs.transcription.state"] = "done"
      } else if (filter?.processing === "error") {
        query["jobs.transcription.state"] = "error"
      }

      applyNameTextSearch(query, filter)

      if (userRole === ROLES.MEMBER) {
        // A member can only see conversation where he has access
        query["$or"][1]["organization.membersRight"] = {
          $bitsAnySet: desiredAccess,
        }
      }
      if (userRole >= ROLES.MAINTAINER) {
        // A maintainer can see all conversations in the organization
        delete query["$or"]
      }

      return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async listConvFromConvIds(
    convIds,
    userId,
    userRole,
    desiredAccess = 1,
    filter = {},
  ) {
    try {
      convIds = toObjectIds(convIds, this.getObjectId)

      let query = {
        _id: {
          $in: convIds,
        },
        "type.mode": TYPE.CANONICAL,
        $or: [
          customRightsAllowed(userId, desiredAccess),
          customRightsNotMember(userId),
          sharedWithUsersAllowed(userId, desiredAccess),
        ],
      }

      if (userRole === ROLES.MEMBER) {
        // A member can only see conversation where he has access
        query["$or"][1]["organization.membersRight"] = {
          $bitsAnySet: desiredAccess,
        }
      }

      applyTagAllFilter(query, filter)
      applyNameTextSearch(query, filter)

      const projection = { ...LIST_CONVERSATION_PROJECTION }

      return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async listConvFromFavorite(convIds, filter) {
    try {
      let projection = { ...LIST_CONVERSATION_PROJECTION }

      convIds = toObjectIds(convIds, this.getObjectId)

      let query = {
        _id: {
          $in: convIds,
        },
        "type.mode": TYPE.CANONICAL,
      }

      applyNameTextSearch(query, filter)

      return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async listConvFromOwner(convIds, userId) {
    try {
      const objectIds = toObjectIds(convIds.split(","), this.getObjectId)
      const query = {
        _id: { $in: objectIds },
        owner: userId.toString(),
      }

      const result = await this.mongoRequest(query, {})
      if (result.length === objectIds.length) return result
      else return []
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByFolderIds(folderIds, organizationId) {
    try {
      const query = {
        folderId: { $in: folderIds },
        "organization.organizationId": organizationId,
      }
      return await this.mongoRequest(query, {
        owner: 1,
        "organization.customRights": 1,
        "organization.membersRight": 1,
        "organization.organizationId": 1,
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateFolderBatch(conversationIds, folderId, organizationId) {
    try {
      const objectIds = toObjectIds(conversationIds, this.getObjectId)
      const query = {
        _id: { $in: objectIds },
        "organization.organizationId": organizationId,
      }
      return await this.mongoUpdateMany(query, "$set", {
        folderId: folderId,
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async unsetFolderReferences(folderId, newFolderId, organizationId) {
    try {
      const query = {
        folderId: folderId,
        "organization.organizationId": organizationId,
      }
      return await this.mongoUpdateMany(query, "$set", {
        folderId: newFolderId,
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateRightsBatchByFolderId(
    folderId,
    organizationId,
    membersRight,
    customRights,
  ) {
    try {
      const query = {
        folderId: folderId,
        "organization.organizationId": organizationId,
      }
      return await this.mongoUpdateMany(query, "$set", {
        "organization.membersRight": membersRight,
        "organization.customRights": customRights,
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async countByAudioFilepath(filepath) {
    try {
      const query = { "metadata.audio.filepath": filepath }
      const result = await this.mongoRequest(query, { _id: 1 })
      return result.length
    } catch (error) {
      console.error(error)
      return 0
    }
  }

  async countMediaFromOrga(orgaIds) {
    try {
      return await this.mongoAggregate([
        {
          $match: {
            "organization.organizationId": { $in: orgaIds },
          },
        },
        {
          $group: {
            _id: "$organization.organizationId",
            total: { $sum: 1 },
          },
        },
      ])
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ConvoModel()
