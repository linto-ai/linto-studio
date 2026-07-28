const MongoModel = require(`../model`)
const MongoDriver = require(`../driver`)
const debug = require("debug")("linto:lib:mongodb:models:conversations")
const { calculateObjectSize } = require("bson")

const moment = require("moment")
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const TYPE = require(`${process.cwd()}/lib/dao/conversation/types`)
const { regexContains } = require(`${process.cwd()}/lib/utility/escapeRegex`)

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
        query.name = regexContains(filter.name)
      }

      if (filter?.description) {
        query.description = regexContains(filter.description)
      }
      if (filter?.tags) {
        filter.tags = filter.tags.split(",")
        query.tags = {
          $all: filter.tags,
        }
      }

      if (filter?.text) {
        query["text.raw_segment"] = regexContains(filter.text)
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

      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, {
          $set: { text: [...text], last_update: dateTime },
        })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * editorVersion of a conversation and its whole family (children and
   * grandchildren — the topology is canonical → channels → translations, or
   * canonical → translations). The editor join ack ships this map so a
   * reconnecting client can detect which loaded tracks went stale during
   * the disconnection. Missing field ≡ 0. Throws on DB error.
   * @returns {Promise<Record<string, number>>} conversationId → editorVersion
   */
  async getFamilyEditorVersions(conversationId) {
    const collection = MongoDriver.constructor.db.collection(this.collection)
    const projection = { editorVersion: 1, "type.child_conversations": 1 }

    const parent = await collection.findOne(
      { _id: this.getObjectId(conversationId) },
      { projection },
    )
    if (!parent) return {}
    const versions = { [conversationId]: parent.editorVersion ?? 0 }

    const childIds = parent.type?.child_conversations ?? []
    if (childIds.length === 0) return versions
    const children = await collection
      .find(
        { _id: { $in: childIds.map((id) => this.getObjectId(id)) } },
        { projection },
      )
      .toArray()

    const grandchildIds = []
    for (const child of children) {
      versions[child._id.toString()] = child.editorVersion ?? 0
      grandchildIds.push(...(child.type?.child_conversations ?? []))
    }
    if (grandchildIds.length > 0) {
      const grandchildren = await collection
        .find(
          { _id: { $in: grandchildIds.map((id) => this.getObjectId(id)) } },
          { projection: { editorVersion: 1 } },
        )
        .toArray()
      for (const grandchild of grandchildren) {
        versions[grandchild._id.toString()] = grandchild.editorVersion ?? 0
      }
    }
    return versions
  }

  /**
   * Targeted save of ONE edited turn (lock+save editor). Field-level $set so
   * the fields this write doesn't own survive untouched (raw_segment keeps
   * the original ASR text, lang, future additions), and editorVersion is
   * incremented IN THE SAME atomic write — a broadcast can never announce a
   * version the data doesn't have. Throws on DB error (the handler tells
   * transient failures apart from a vanished turn).
   * @returns {Promise<{version: number}|null>} null when the conversation or
   *   the turn no longer exists.
   */
  async updateEditorTurn(
    conversationId,
    turnId,
    { segment, words, stime, etime },
  ) {
    const set = {
      "text.$.segment": segment,
      "text.$.words": words,
      last_update: moment().format(),
    }
    if (stime !== undefined) set["text.$.stime"] = stime
    if (etime !== undefined) set["text.$.etime"] = etime

    const result = await MongoDriver.constructor.db
      .collection(this.collection)
      .findOneAndUpdate(
        { _id: this.getObjectId(conversationId), "text.turn_id": turnId },
        { $set: set, $inc: { editorVersion: 1 } },
        {
          returnDocument: "after",
          projection: { editorVersion: 1 },
          includeResultMetadata: false,
        },
      )
    return result ? { version: result.editorVersion } : null
  }

  /**
   * Replace ONE turn by its two halves, in place (lock+save editor split).
   * Aggregation-pipeline update: one atomic write recomputes the array
   * ($indexOfArray + $concatArrays) AND bumps editorVersion — the filter on
   * "text.turn_id" guarantees the index exists at write time. Throws on DB
   * error.
   * @returns {Promise<{version: number}|null>} null when the conversation or
   *   the turn no longer exists.
   */
  async splitEditorTurn(conversationId, turnId, leftTurn, rightTurn) {
    const result = await MongoDriver.constructor.db
      .collection(this.collection)
      .findOneAndUpdate(
        { _id: this.getObjectId(conversationId), "text.turn_id": turnId },
        [
          {
            $set: {
              text: {
                $let: {
                  vars: { idx: { $indexOfArray: ["$text.turn_id", turnId] } },
                  in: {
                    $concatArrays: [
                      { $slice: ["$text", "$$idx"] },
                      [leftTurn, rightTurn],
                      // Position past the end yields [] — $size keeps the
                      // count argument positive (0 would be rejected).
                      {
                        $slice: [
                          "$text",
                          { $add: ["$$idx", 1] },
                          { $size: "$text" },
                        ],
                      },
                    ],
                  },
                },
              },
              editorVersion: { $add: [{ $ifNull: ["$editorVersion", 0] }, 1] },
              last_update: moment().format(),
            },
          },
        ],
        {
          returnDocument: "after",
          projection: { editorVersion: 1 },
          includeResultMetadata: false,
        },
      )
    return result ? { version: result.editorVersion } : null
  }

  /**
   * Replace two ADJACENT turns by their merged result (lock+save editor).
   * The adjacency is part of the FILTER ($expr): if the array changed since
   * the caller's check (a concurrent split/merge), nothing matches and
   * nothing is written — the atomic counterpart of the handler's read.
   * Throws on DB error.
   * @returns {Promise<{version: number}|null>} null when the pair is gone or
   *   no longer adjacent.
   */
  async mergeEditorTurns(conversationId, firstTurnId, secondTurnId, mergedTurn) {
    const adjacencyExpr = {
      $let: {
        vars: { idx: { $indexOfArray: ["$text.turn_id", firstTurnId] } },
        in: {
          $and: [
            { $gte: ["$$idx", 0] },
            {
              $eq: [
                { $arrayElemAt: ["$text.turn_id", { $add: ["$$idx", 1] }] },
                secondTurnId,
              ],
            },
          ],
        },
      },
    }
    const result = await MongoDriver.constructor.db
      .collection(this.collection)
      .findOneAndUpdate(
        { _id: this.getObjectId(conversationId), $expr: adjacencyExpr },
        [
          {
            $set: {
              text: {
                $let: {
                  vars: { idx: { $indexOfArray: ["$text.turn_id", firstTurnId] } },
                  in: {
                    $concatArrays: [
                      { $slice: ["$text", "$$idx"] },
                      [mergedTurn],
                      // Position past the end yields [] — $size keeps the
                      // count argument positive (0 would be rejected).
                      {
                        $slice: [
                          "$text",
                          { $add: ["$$idx", 2] },
                          { $size: "$text" },
                        ],
                      },
                    ],
                  },
                },
              },
              editorVersion: { $add: [{ $ifNull: ["$editorVersion", 0] }, 1] },
              last_update: moment().format(),
            },
          },
        ],
        {
          returnDocument: "after",
          projection: { editorVersion: 1 },
          includeResultMetadata: false,
        },
      )
    return result ? { version: result.editorVersion } : null
  }

  /**
   * Point a turn at a speaker (existing or freshly minted), in ONE atomic
   * pipeline that also maintains the speakers array: the speaker is added
   * when new, and any speaker no longer referenced by the text is dropped
   * (GC — "a speaker exists as long as it is assigned"). editorVersion is
   * bumped in the same write. Throws on DB error.
   * @param {{speaker_id: string, speaker_name: string}} speaker
   * @returns {Promise<{version: number}|null>} null when the conversation or
   *   the turn no longer exists.
   */
  async updateEditorTurnSpeaker(conversationId, turnId, speaker) {
    const result = await MongoDriver.constructor.db
      .collection(this.collection)
      .findOneAndUpdate(
        { _id: this.getObjectId(conversationId), "text.turn_id": turnId },
        [
          {
            $set: {
              text: {
                $map: {
                  input: "$text",
                  as: "t",
                  in: {
                    $cond: [
                      { $eq: ["$$t.turn_id", turnId] },
                      {
                        $mergeObjects: [
                          "$$t",
                          { speaker_id: speaker.speaker_id },
                        ],
                      },
                      "$$t",
                    ],
                  },
                },
              },
            },
          },
          {
            // Runs on the UPDATED text (pipeline stages are sequential):
            // ensure the new speaker, then keep only referenced speakers.
            $set: {
              speakers: {
                $filter: {
                  input: {
                    $concatArrays: [
                      { $ifNull: ["$speakers", []] },
                      {
                        $cond: [
                          {
                            $in: [
                              speaker.speaker_id,
                              { $ifNull: ["$speakers.speaker_id", []] },
                            ],
                          },
                          [],
                          [speaker],
                        ],
                      },
                    ],
                  },
                  as: "s",
                  cond: { $in: ["$$s.speaker_id", "$text.speaker_id"] },
                },
              },
            },
          },
          {
            $set: {
              editorVersion: { $add: [{ $ifNull: ["$editorVersion", 0] }, 1] },
              last_update: moment().format(),
            },
          },
        ],
        {
          returnDocument: "after",
          projection: { editorVersion: 1 },
          includeResultMetadata: false,
        },
      )
    return result ? { version: result.editorVersion } : null
  }

  /**
   * Remove ONE turn (lock+save editor — triggered by committing an emptied
   * text). One atomic pipeline: the turn is filtered out of text, speakers
   * no longer referenced are dropped (GC), editorVersion bumped. The filter
   * requires a SECOND turn to exist ("text.1") — a track never goes empty,
   * the last turn cannot be deleted. Throws on DB error.
   * @returns {Promise<{version: number}|null>} null when the conversation or
   *   the turn no longer exists — or when it is the track's last turn.
   */
  async deleteEditorTurn(conversationId, turnId) {
    const result = await MongoDriver.constructor.db
      .collection(this.collection)
      .findOneAndUpdate(
        {
          _id: this.getObjectId(conversationId),
          "text.turn_id": turnId,
          "text.1": { $exists: true },
        },
        [
          {
            $set: {
              text: {
                $filter: {
                  input: "$text",
                  as: "t",
                  cond: { $ne: ["$$t.turn_id", turnId] },
                },
              },
            },
          },
          {
            // Runs on the UPDATED text: drop speakers referencing nothing.
            $set: {
              speakers: {
                $filter: {
                  input: { $ifNull: ["$speakers", []] },
                  as: "s",
                  cond: { $in: ["$$s.speaker_id", "$text.speaker_id"] },
                },
              },
            },
          },
          {
            $set: {
              editorVersion: { $add: [{ $ifNull: ["$editorVersion", 0] }, 1] },
              last_update: moment().format(),
            },
          },
        ],
        {
          returnDocument: "after",
          projection: { editorVersion: 1 },
          includeResultMetadata: false,
        },
      )
    return result ? { version: result.editorVersion } : null
  }

  /**
   * Rename a speaker of ONE conversation (track). editorVersion bumped in
   * the same write. Throws on DB error.
   * @returns {Promise<{version: number}|null>} null when the conversation or
   *   the speaker no longer exists.
   */
  async renameEditorSpeaker(conversationId, speakerId, name) {
    const result = await MongoDriver.constructor.db
      .collection(this.collection)
      .findOneAndUpdate(
        {
          _id: this.getObjectId(conversationId),
          "speakers.speaker_id": speakerId,
        },
        {
          $set: {
            "speakers.$.speaker_name": name,
            last_update: moment().format(),
          },
          $inc: { editorVersion: 1 },
        },
        {
          returnDocument: "after",
          projection: { editorVersion: 1 },
          includeResultMetadata: false,
        },
      )
    return result ? { version: result.editorVersion } : null
  }

  /**
   * Reassign every turn of a speaker to another and drop the replaced
   * speaker (it references nothing by construction afterwards) — one atomic
   * pipeline, editorVersion bumped in the same write. Throws on DB error.
   * @returns {Promise<{version: number}|null>} null when the conversation or
   *   either speaker no longer exists.
   */
  async replaceEditorSpeaker(conversationId, fromSpeakerId, toSpeakerId) {
    const result = await MongoDriver.constructor.db
      .collection(this.collection)
      .findOneAndUpdate(
        {
          _id: this.getObjectId(conversationId),
          $and: [
            { speakers: { $elemMatch: { speaker_id: fromSpeakerId } } },
            { speakers: { $elemMatch: { speaker_id: toSpeakerId } } },
          ],
        },
        [
          {
            $set: {
              text: {
                $map: {
                  input: "$text",
                  as: "t",
                  in: {
                    $cond: [
                      { $eq: ["$$t.speaker_id", fromSpeakerId] },
                      {
                        $mergeObjects: ["$$t", { speaker_id: toSpeakerId }],
                      },
                      "$$t",
                    ],
                  },
                },
              },
            },
          },
          {
            $set: {
              speakers: {
                $filter: {
                  input: { $ifNull: ["$speakers", []] },
                  as: "s",
                  cond: { $ne: ["$$s.speaker_id", fromSpeakerId] },
                },
              },
            },
          },
          {
            $set: {
              editorVersion: { $add: [{ $ifNull: ["$editorVersion", 0] }, 1] },
              last_update: moment().format(),
            },
          },
        ],
        {
          returnDocument: "after",
          projection: { editorVersion: 1 },
          includeResultMetadata: false,
        },
      )
    return result ? { version: result.editorVersion } : null
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
          name: regexContains(filter.name),
        })
      }

      if (filter?.text) {
        searchConditions.push({
          "text.raw_segment": regexContains(filter.text),
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
          name: regexContains(filter.name),
        })
      }
      if (filter?.text) {
        searchConditions.push({
          "text.raw_segment": regexContains(filter.text),
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
          "text.raw_segment": regexContains(filter.text),
        })
      }
      if (filter?.name) {
        favSearch.push({
          name: regexContains(filter.name),
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
        accSearch.push({
          name: regexContains(filter.name),
        })
      if (filter?.text)
        accSearch.push({
          "text.raw_segment": regexContains(filter.text),
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
