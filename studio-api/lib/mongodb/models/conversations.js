const MongoModel = require(`../model`)
const MongoDriver = require(`../driver`)
const debug = require("debug")("linto:lib:mongodb:models:conversations")
const { calculateObjectSize } = require("bson")

const moment = require("moment")
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const TYPE = require(`${process.cwd()}/lib/dao/conversation/types`)

const BSON_MAX_SIZE = 16 * 1024 * 1024
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
      const conversationId = payload._id
      const query = {
        _id: this.getObjectId(conversationId),
      }

      if (payload.organizationId) delete payload.organizationId

      const dateTime = moment().format()
      payload.last_update = dateTime

      delete payload._id
      // Never write back a (possibly stale) epoch fetched by the caller:
      // the epoch is only ever moved forward by bumpEditorEpoch.
      delete payload.editorEpoch
      let mutableElements = payload

      // External rewrite of editor-owned data: invalidate the editor history
      // lineage before writing (a bump without a write is harmless, the
      // reverse would let the editor flush clobber this write).
      if (payload.text !== undefined || payload.speakers !== undefined) {
        await this.bumpEditorEpoch(conversationId)
      }

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

  async getConvos() {
    try {
      const query = {}
      const projection = {
        text: 0,
        speakers: 0,
        keywords: 0,
        highlights: 0,
      }

      return await this.mongoRequest(query, projection)
    } catch (error) {
      console.error(error)
      throw error
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
      convIds = convIds.map((id) => {
        if (typeof id === "string") return this.getObjectId(id)
        else return id
      })
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
        text: 0,
        speakers: 0,
        keywords: 0,
        highlights: 0,
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

  async getTagByShare(idUser, filter = undefined) {
    const query = {
      sharedWithUsers: {
        $elemMatch: {
          userId: idUser.toString(),
        },
      },
    }
    if (filter.tags) {
      filter.tags = filter.tags.split(",")
      query.tags = {
        $elemMatch: {
          $in: filter.tags,
        },
      }
    }

    const projection = {
      tags: 1,
      name: 1,
    }

    return await this.mongoRequest(query, projection)
  }

  // list conversation from an organization id
  async getConvoByOrga(idOrga) {
    getByOrga(idOrga)
  }

  async getByOrga(idOrga, projection) {
    try {
      const query = {
        "organization.organizationId": idOrga.toString(),
        "type.mode": TYPE.CANONICAL,
      }
      if (!projection) {
        projection = {
          text: 0,
          speakers: 0,
          keywords: 0,
          highlights: 0,
        }
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

  async listConversationByOrgaRole(
    idOrga,
    role,
    projection,
    filter = undefined,
  ) {
    try {
      const query = {
        "organization.organizationId": idOrga.toString(),
      }
      if (!projection) {
        projection = {
          text: 0,
          speakers: 0,
          keywords: 0,
          highlights: 0,
        }
      }
      return await this.mongoRequest(query, projection)
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
      const query = {
        _id: this.getObjectId(_id),
      }
      const dateTime = moment().format()

      // Text rewritten outside the collaborative editor: bump the editor
      // epoch in the same atomic op to invalidate its persisted Yjs state.
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, {
          $set: { text: [...text], last_update: dateTime },
          $inc: { editorEpoch: 1 },
        })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Update a single turn in-place using MongoDB positional operator.
   * Unlike updateTurn(), this does NOT read-modify-write the whole text array.
   */
  async updateTurnAtomic(conversationId, turnId, newTurn) {
    try {
      const query = {
        _id: this.getObjectId(conversationId),
        "text.turn_id": turnId,
      }
      const dateTime = moment().format()
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, {
          $set: {
            "text.$": { ...newTurn, turn_id: turnId },
            last_update: dateTime,
          },
          $inc: { editorEpoch: 1 },
        })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Append a new turn to the text array atomically.
   */
  async addTurnAtomic(conversationId, newTurn) {
    try {
      const query = { _id: this.getObjectId(conversationId) }
      const dateTime = moment().format()
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, {
          $push: { text: newTurn },
          $set: { last_update: dateTime },
          $inc: { editorEpoch: 1 },
        })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Remove a turn from the text array atomically.
   */
  async removeTurnAtomic(conversationId, turnId) {
    try {
      const query = { _id: this.getObjectId(conversationId) }
      const dateTime = moment().format()
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, {
          $pull: { text: { turn_id: turnId } },
          $set: { last_update: dateTime },
          $inc: { editorEpoch: 1 },
        })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // ── Collaborative editor epoch ────────────────────────────────────────
  //
  // `editorEpoch` identifies the current editor CRDT history lineage of a
  // conversation. It is compared by equality only (never ordered); a missing
  // field is equivalent to 0 (conversations created before this feature).
  //
  // Two rules keep it sound under concurrency:
  //  - every writer of `text`/`speakers` that does NOT go through the editor
  //    flush bumps it ($inc, atomic), invalidating the persisted Yjs state;
  //  - the editor flush never bumps it, and writes with the epoch read at
  //    document load as an optimistic-concurrency filter (a concurrent bump
  //    makes the flush match nothing instead of clobbering the rewrite).

  /** Query matching the conversation only if its epoch is still `expectedEpoch`. */
  editorEpochQuery(conversationId, expectedEpoch) {
    const query = { _id: this.getObjectId(conversationId) }
    // `$in: [0, null]` also matches documents without the field (missing ≡ 0).
    query.editorEpoch =
      expectedEpoch === 0 ? { $in: [0, null] } : expectedEpoch
    return query
  }

  async bumpEditorEpoch(conversationId) {
    try {
      // $inc creates the field with value 1 when missing (missing ≡ 0).
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(
          { _id: this.getObjectId(conversationId) },
          { $inc: { editorEpoch: 1 } },
        )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Replace the entire text array on a conversation.
   * Used by the collaborative editor flush so that turn order is preserved
   * exactly as it appears in the Y.Doc (atomic single-document write).
   * With `expectedEpoch`, the write only applies if the editor epoch is
   * unchanged — check `matchedCount` on the result.
   */
  async replaceTurns(conversationId, turns, expectedEpoch = null) {
    try {
      const query =
        expectedEpoch === null
          ? { _id: this.getObjectId(conversationId) }
          : this.editorEpochQuery(conversationId, expectedEpoch)
      const dateTime = moment().format()
      return await this.mongoUpdateOne(query, "$set", {
        text: turns,
        last_update: dateTime,
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Update specific turns in place by turn_id (caller ensures no
   * add/remove/reorder). With `expectedEpoch`, every op is filtered on the
   * epoch — a full write yields matchedCount === turns.length + 1.
   */
  async updateTurnsByIds(conversationId, turns, expectedEpoch = null) {
    try {
      const filter =
        expectedEpoch === null
          ? { _id: this.getObjectId(conversationId) }
          : this.editorEpochQuery(conversationId, expectedEpoch)
      const operations = turns.map((turn) => ({
        updateOne: {
          filter,
          update: { $set: { "text.$[elem]": turn } },
          arrayFilters: [{ "elem.turn_id": turn.turn_id }],
        },
      }))
      operations.push({
        updateOne: {
          filter,
          update: { $set: { last_update: moment().format() } },
        },
      })
      return await this.mongoBulkWrite(operations)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Replace the speakers array on a conversation.
   * With `expectedEpoch`, the write only applies if the editor epoch is
   * unchanged — check `matchedCount` on the result.
   */
  async updateSpeakers(conversationId, speakers, expectedEpoch = null) {
    try {
      const query =
        expectedEpoch === null
          ? { _id: this.getObjectId(conversationId) }
          : this.editorEpochQuery(conversationId, expectedEpoch)
      const dateTime = moment().format()
      return await this.mongoUpdateOne(query, "$set", {
        speakers,
        last_update: dateTime,
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async updateCategory(_id, category) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(_id),
      }
      let mutableElements = {
        category: [...category],
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
    } catch (err) {
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
      let projection = {
        page: 0,
        text: 0,
        "jobs.transcription.job_logs": 0,
      }

      let query = {
        "organization.organizationId": organizationId.toString(),
        "type.mode": TYPE.CANONICAL,
        $or: [
          {
            "organization.customRights": {
              $elemMatch: {
                userId: userId,
                right: { $bitsAnySet: desiredAccess },
              },
            },
          },
          {
            "organization.customRights": {
              $not: {
                $elemMatch: {
                  userId: userId,
                },
              },
            },
          },
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
        // notags rules don't apply for highlighs category
        query.tags = {
          $nin: filter.tags,
        }
      } else if (filter.tags) {
        query.tags = {
          $all: filter.tags.split(","),
        }
      }
      if (filter.tags && filter.filter !== "notags") {
        query.tags = {
          $all: filter.tags.split(","),
        }
      }

      const searchConditions = []

      if (filter?.name) {
        searchConditions.push({
          name: { $regex: filter.name, $options: "i" },
        })
      }

      if (filter?.text) {
        searchConditions.push({
          "text.raw_segment": { $regex: filter.text, $options: "i" },
        })
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

      if (searchConditions.length > 0) {
        // Ensure conversations match at least one of the search terms
        query.$and = [{ $or: searchConditions }]
      }

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
      convIds = convIds.map((id) => {
        if (typeof id === "string") return this.getObjectId(id)
        else return id
      })

      let query = {
        _id: {
          $in: convIds,
        },
        "type.mode": TYPE.CANONICAL,
        $or: [
          {
            "organization.customRights": {
              $elemMatch: {
                userId: userId,
                right: { $bitsAnySet: desiredAccess },
              },
            },
          },
          {
            "organization.customRights": {
              $not: {
                $elemMatch: {
                  userId: userId,
                },
              },
            },
          },
          {
            sharedWithUsers: {
              $elemMatch: {
                userId: userId,
                right: { $bitsAnySet: desiredAccess },
              },
            },
          },
        ],
      }

      if (userRole === ROLES.MEMBER) {
        // A member can only see conversation where he has access
        query["$or"][1]["organization.membersRight"] = {
          $bitsAnySet: desiredAccess,
        }
      }

      if (filter.tags) {
        query.tags = {
          $all: filter.tags.split(","),
        }
      }

      const searchConditions = []
      if (filter?.name) {
        searchConditions.push({
          name: { $regex: filter.name, $options: "i" },
        })
      }
      if (filter?.text) {
        searchConditions.push({
          "text.raw_segment": {
            $regex: filter.text,
            $options: "i",
          },
        })
      }
      if (searchConditions.length > 0) {
        query.$and = [{ $or: searchConditions }]
      }

      const projection = {
        page: 0,
        text: 0,
        "jobs.transcription.job_logs": 0,
      }

      return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async listConvFromFavorite(convIds, filter) {
    try {
      let projection = {
        page: 0,
        text: 0,
        "jobs.transcription.job_logs": 0,
      }

      convIds = convIds.map((id) => {
        if (typeof id === "string") return this.getObjectId(id)
        else return id
      })

      let query = {
        _id: {
          $in: convIds,
        },
        "type.mode": TYPE.CANONICAL,
      }

      /* ----------------------- SEARCH name OR text ----------------------------- */
      const favSearch = []
      if (filter?.text) {
        favSearch.push({
          "text.raw_segment": { $regex: filter.text, $options: "i" },
        })
      }
      if (filter?.name) {
        favSearch.push({
          name: { $regex: filter.name, $options: "i" },
        })
      }
      if (favSearch.length > 0) {
        query.$and = [{ $or: favSearch }]
      }

      return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async listConvFromAccess(
    convIds,
    userId,
    orgaId,
    userRole,
    desiredAccess = 1,
    filter = {},
  ) {
    try {
      convIds = convIds.map((id) => {
        if (typeof id === "string") return this.getObjectId(id)
        else return id
      })

      let query = {
        _id: {
          $in: convIds,
        },
        "type.mode": TYPE.CANONICAL,
        $or: [
          {
            sharedWithUsers: {
              $elemMatch: {
                userId: userId,
                right: { $bitsAnySet: desiredAccess },
              },
            },
          },
        ],
      }

      if (userRole && userRole > ROLES.UNDEFINED) {
        query["$or"].push({
          "organization.organizationId": orgaId,
          "organization.customRights": {
            $elemMatch: {
              userId: userId,
              right: { $bitsAnySet: desiredAccess },
            },
          },
        })
        query["$or"].push({
          "organization.organizationId": orgaId,
          "organization.customRights": {
            $not: {
              $elemMatch: {
                userId: userId,
              },
            },
          },
        })

        if (userRole === ROLES.MEMBER)
          // A member can only see conversation where he has access
          query["$or"][2]["organization.membersRight"] = {
            $bitsAnySet: desiredAccess,
          }
      }

      /* ------------------------ TAG & SEARCH filters --------------------------- */
      if (filter.tags) {
        query.tags = { $all: filter.tags.split(",") }
      }

      const accSearch = []
      if (filter?.name)
        accSearch.push({ name: { $regex: filter.name, $options: "i" } })
      if (filter?.text)
        accSearch.push({
          "text.raw_segment": { $regex: filter.text, $options: "i" },
        })
      if (accSearch.length > 0) query.$and = [{ $or: accSearch }]

      const projectionAcc = {
        page: 0,
        text: 0,
        "jobs.transcription.job_logs": 0,
      }

      return await this.mongoRequest(query, projectionAcc)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async listConvFromOwner(convIds, userId) {
    try {
      const objectIds = convIds
        .split(",")
        .map((id) => (typeof id === "string" ? this.getObjectId(id) : id))
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
      const objectIds = conversationIds.map((id) =>
        typeof id === "string" ? this.getObjectId(id) : id,
      )
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
