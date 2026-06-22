const MongoModel = require(`../model`)

const moment = require("moment")

/**
 * Persisted Yjs binary state, one document per conversation.
 *
 * The state is the source of truth for the editor's CRDT *history*: on load,
 * the EditorHandler replays it instead of reseeding from `text`, so Yjs op
 * identifiers stay stable across document unload/reload cycles (reseeding an
 * existing lineage would reuse the fixed seed clientID with different
 * content and silently corrupt clients holding the previous history).
 *
 * Each state is tagged with the conversation's `editorEpoch` at write time.
 * Epochs are compared by equality only: a state whose epoch no longer
 * matches the conversation's current epoch belongs to a dead lineage and is
 * ignored on load (no deletion needed — it gets overwritten by the next
 * flush of the new lineage).
 */
class EditorStateModel extends MongoModel {
  constructor() {
    super("editorStates")
  }

  async get(conversationId) {
    try {
      const result = await this.mongoRequest({
        conversationId: conversationId.toString(),
      })
      return result.length === 1 ? result[0] : null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  /**
   * Upsert the Yjs state for a conversation, tagged with its epoch.
   * @param {string} conversationId
   * @param {number} epoch - editorEpoch the state belongs to
   * @param {Buffer} state - Y.encodeStateAsUpdate output
   */
  async set(conversationId, epoch, state) {
    const query = { conversationId: conversationId.toString() }
    return await this.mongoUpdateOne(
      query,
      "$set",
      { epoch, state, last_update: moment().format() },
      { upsert: true },
    )
  }

  async delete(conversationId) {
    try {
      return await this.mongoDelete({
        conversationId: conversationId.toString(),
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new EditorStateModel()
