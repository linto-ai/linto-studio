const MongoModel = require(`../model`)
const MongoDriver = require(`../driver`)

const moment = require("moment")

// Editor (lock+save) write path, backed by the conversations collection.
class ConversationEditorModel extends MongoModel {
  constructor() {
    super("conversations")
  }

  /**
   * editorVersion of a conversation and its children/grandchildren, keyed by
   * conversationId. Missing field means 0. Throws on DB error.
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
   * Save one edited turn. Field-level $set so fields this write doesn't own
   * (raw_segment, lang) survive, and editorVersion is bumped in the same
   * atomic write. Returns null when the conversation or turn no longer exists.
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
   * Replace one turn by its two halves in a single atomic pipeline update
   * that also bumps editorVersion. Returns null when the conversation or
   * turn no longer exists.
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
                      // $literal: transcribed text can start with "$", store
                      // it verbatim.
                      { $literal: [leftTurn, rightTurn] },
                      // Position past the end yields []; $size keeps the
                      // count argument positive.
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
   * Replace two adjacent turns by their merged result. Adjacency is part of
   * the filter ($expr): if the array changed concurrently nothing is written.
   * Returns null when the pair is gone or no longer adjacent.
   */
  async mergeEditorTurns(
    conversationId,
    firstTurnId,
    secondTurnId,
    mergedTurn,
  ) {
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
                  vars: {
                    idx: { $indexOfArray: ["$text.turn_id", firstTurnId] },
                  },
                  in: {
                    $concatArrays: [
                      { $slice: ["$text", "$$idx"] },
                      // $literal: transcribed text can start with "$", store
                      // it verbatim.
                      { $literal: [mergedTurn] },
                      // Position past the end yields []; $size keeps the
                      // count argument positive.
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
   * Assign a speaker to a turn in one atomic pipeline that also maintains
   * the speakers array (added when new, dropped when no longer referenced)
   * and bumps editorVersion. Returns null when the conversation or turn no
   * longer exists.
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
                          // $literal: never evaluate the injected id.
                          { $literal: { speaker_id: speaker.speaker_id } },
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
            // Runs on the updated text: ensure the new speaker, then keep
            // only referenced speakers.
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
                          // $literal: speaker_name is user input, store it
                          // verbatim.
                          { $literal: [speaker] },
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
   * Remove one turn and drop unreferenced speakers, atomically. The filter
   * requires a second turn to exist: the track's last turn cannot be deleted.
   * Returns null when the conversation or turn is gone, or on the last turn.
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
   * speaker, in one atomic pipeline that also bumps editorVersion. Returns
   * null when the conversation or either speaker no longer exists.
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
                        $mergeObjects: [
                          "$$t",
                          // $literal: never evaluate the injected id.
                          { $literal: { speaker_id: toSpeakerId } },
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
}

module.exports = new ConversationEditorModel()
