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
  escapeRegex,
} = require("../queryBuilders/filters")
const {
  LIGHT_CONVERSATION_PROJECTION,
  LIST_CONVERSATION_PROJECTION,
} = require("../queryBuilders/projections")

const BSON_MAX_SIZE = 16 * 1024 * 1024

class ConvoModel extends MongoModel {
  constructor() {
    super("conversations")
  }

  async create(conversation) {
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
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    if (payload.organizationId) delete payload.organizationId
    delete payload._id
    payload.last_update = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async updateRights(
    conversationId,
    organizationId,
    membersRight,
    customRights,
  ) {
    return await this.mongoUpdateOne(
      {
        _id: this.getObjectId(conversationId),
        "organization.organizationId": organizationId,
      },
      "$set",
      {
        "organization.membersRight": membersRight,
        "organization.customRights": customRights,
      },
    )
  }

  async getConversationFromParent(id, projectionArray) {
    const projection = {}
    if (projectionArray) {
      projectionArray.map((element) => {
        projection[element] = 1
      })
    }
    return await this.mongoRequest({ "type.from_parent_id": id }, projection)
  }

  async getByIdWithFilter(convId, projection) {
    return await this.mongoRequest(
      { _id: this.getObjectId(convId) },
      projection,
    )
  }

  async getById(convoId, projectionArray) {
    const projection = {}
    if (projectionArray) {
      projectionArray.map((element) => {
        projection[element] = 1
      })
    }
    return await this.mongoRequest(
      { _id: this.getObjectId(convoId) },
      projection,
    )
  }

  async getConvsListByIds(convIds, filter) {
    convIds = toObjectIds(convIds, this.getObjectId)
    return await this.mongoRequest({ _id: { $in: convIds } }, filter)
  }

  // list conversation shared to the user
  async getByShare(idUser, filter = undefined) {
    const projection = {
      ...LIGHT_CONVERSATION_PROJECTION,
      "jobs.transcription.job_logs": 0,
    }

    const query = {
      "type.mode": TYPE.CANONICAL,
      sharedWithUsers: {
        $elemMatch: {
          userId: idUser.toString(),
          right: { $bitsAnySet: RIGHTS.READ },
        },
      },
    }

    if (filter?.name) {
      query.name = { $regex: escapeRegex(filter.name), $options: "i" }
    }
    if (filter?.description) {
      query.description = {
        $regex: escapeRegex(filter.description),
        $options: "i",
      }
    }
    if (filter?.tags) {
      filter.tags = filter.tags.split(",")
      query.tags = { $all: filter.tags }
    }
    if (filter?.text) {
      query["text.raw_segment"] = {
        $regex: escapeRegex(filter.text),
        $options: "i",
      }
    }

    if (!filter) return await this.mongoRequest(query, projection)
    return await this.mongoAggregatePaginate(query, projection, filter)
  }

  async getTagByOrga(idOrga, tags) {
    const query = {
      "organization.organizationId": idOrga.toString(),
    }
    if (tags) {
      query.tags = { $all: tags.split(",") }
    }
    return await this.mongoRequest(query, { tags: 1 })
  }

  async getByOrga(idOrga, projection) {
    const query = {
      "organization.organizationId": idOrga.toString(),
      "type.mode": TYPE.CANONICAL,
    }
    if (!projection) {
      projection = { ...LIGHT_CONVERSATION_PROJECTION }
    }
    return await this.mongoRequest(query, projection)
  }

  async getSharedConvFromOrga(idOrga, idUser) {
    return await this.mongoRequest(
      {
        "organization.organizationId": idOrga.toString(),
        "type.mode": TYPE.CANONICAL,
        sharedWithUsers: { $elemMatch: { userId: idUser.toString() } },
      },
      {
        _id: 1,
        sharedWithUsers: 1,
        organization: 1,
      },
    )
  }

  async updateConvOnTranscriptionResult(_id, conversation) {
    return await this.mongoUpdateOne({ _id: this.getObjectId(_id) }, "$set", {
      speakers: conversation.speakers,
      text: conversation.text,
      metadata: conversation.metadata,
      jobs: conversation.jobs,
    })
  }

  async updateJob(_id, jobPayload) {
    return await this.mongoUpdateOne({ _id: this.getObjectId(_id) }, "$set", {
      jobs: { ...jobPayload },
    })
  }

  async updateTurn(_id, text) {
    return await this.mongoUpdateOne({ _id: this.getObjectId(_id) }, "$set", {
      text: [...text],
      last_update: moment().format(),
    })
  }

  async updateTag(_id, tags) {
    return await this.mongoUpdateOne({ _id: this.getObjectId(_id) }, "$set", {
      tags: [...tags],
    })
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }

  async deleteTag(orgaId, tags) {
    const tagIds = typeof tags === "string" ? tags.split(",") : tags
    return await this.mongoUpdateMany(
      { "organization.organizationId": orgaId.toString() },
      "$pull",
      { tags: { $in: tagIds } },
    )
  }

  async addSharedUser(id, shared) {
    return await this.mongoUpdateOne(
      { _id: this.getObjectId(id) },
      "$addToSet",
      { sharedWithUsers: shared },
    )
  }

  async listProcessingConversations(organizationId) {
    return await this.mongoRequest({
      "organization.organizationId": organizationId.toString(),
      "jobs.transcription.state": { $nin: ["error", "done"] },
      "type.mode": TYPE.CANONICAL,
    })
  }

  // Default right is 1 (read)
  async listConvFromOrga(
    organizationId,
    userId,
    userRole,
    desiredAccess = 1,
    filter,
  ) {
    const projection = { ...LIST_CONVERSATION_PROJECTION }

    const query = {
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
      query.tags = { $nin: filter.tags }
    } else if (filter.tags) {
      query.tags = { $all: filter.tags.split(",") }
    }

    if (["pending", "processing", "queued"].includes(filter?.processing)) {
      query["jobs.transcription.state"] = { $nin: ["error", "done"] }
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
  }

  async listConvFromConvIds(
    convIds,
    userId,
    userRole,
    desiredAccess = 1,
    filter = {},
  ) {
    convIds = toObjectIds(convIds, this.getObjectId)

    const query = {
      _id: { $in: convIds },
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

    return await this.mongoAggregatePaginate(
      query,
      { ...LIST_CONVERSATION_PROJECTION },
      filter,
    )
  }

  async listConvFromFavorite(convIds, filter) {
    convIds = toObjectIds(convIds, this.getObjectId)

    const query = {
      _id: { $in: convIds },
      "type.mode": TYPE.CANONICAL,
    }

    applyNameTextSearch(query, filter)

    return await this.mongoAggregatePaginate(
      query,
      { ...LIST_CONVERSATION_PROJECTION },
      filter,
    )
  }

  async listConvFromOwner(convIds, userId) {
    const objectIds = toObjectIds(convIds.split(","), this.getObjectId)
    const result = await this.mongoRequest(
      {
        _id: { $in: objectIds },
        owner: userId.toString(),
      },
      {},
    )
    return result.length === objectIds.length ? result : []
  }

  async getByFolderIds(folderIds, organizationId) {
    return await this.mongoRequest(
      {
        folderId: { $in: folderIds },
        "organization.organizationId": organizationId,
      },
      {
        owner: 1,
        "organization.customRights": 1,
        "organization.membersRight": 1,
        "organization.organizationId": 1,
      },
    )
  }

  async updateFolderBatch(conversationIds, folderId, organizationId) {
    const objectIds = toObjectIds(conversationIds, this.getObjectId)
    return await this.mongoUpdateMany(
      {
        _id: { $in: objectIds },
        "organization.organizationId": organizationId,
      },
      "$set",
      { folderId },
    )
  }

  async unsetFolderReferences(folderId, newFolderId, organizationId) {
    return await this.mongoUpdateMany(
      {
        folderId,
        "organization.organizationId": organizationId,
      },
      "$set",
      { folderId: newFolderId },
    )
  }

  async updateRightsBatchByFolderId(
    folderId,
    organizationId,
    membersRight,
    customRights,
  ) {
    return await this.mongoUpdateMany(
      {
        folderId,
        "organization.organizationId": organizationId,
      },
      "$set",
      {
        "organization.membersRight": membersRight,
        "organization.customRights": customRights,
      },
    )
  }

  async countByAudioFilepath(filepath) {
    try {
      const result = await this.mongoRequest(
        { "metadata.audio.filepath": filepath },
        { _id: 1 },
      )
      return result.length
    } catch (error) {
      console.error(error)
      return 0
    }
  }

  async countMediaFromOrga(orgaIds) {
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
  }

  async countByFolderIds(folderIds, organizationId, userId, userRole) {
    try {
      const matchStage = {
        folderId: { $in: folderIds },
        "organization.organizationId": organizationId,
      }

      if (userRole < ROLES.MAINTAINER) {
        matchStage.$or = [
          customRightsAllowed(userId, RIGHTS.READ),
          {
            ...customRightsNotMember(userId),
            "organization.membersRight": { $bitsAnySet: RIGHTS.READ },
          },
        ]
      }

      const result = await this.mongoAggregate([
        { $match: matchStage },
        { $group: { _id: "$folderId", count: { $sum: 1 } } },
      ])

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
}

module.exports = new ConvoModel()
