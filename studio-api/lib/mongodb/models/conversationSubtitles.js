const debug = require("debug")("linto:lib:mongodb:models:conversationSubtitles")
const MongoModel = require(`../model`)

const moment = require("moment")

class SubtitleModel extends MongoModel {
  constructor() {
    super("conversation_subtitles")
  }

  async create(payload) {
    const dateTime = moment().format()
    payload.created = dateTime
    payload.last_update = dateTime
    return await this.mongoInsert(payload)
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    payload.last_update = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }

  async deleteMany(idsToRemove) {
    const objectIdToRemove = idsToRemove.map((id) => {
      if (typeof id === "string") return this.getObjectId(id)
      else if (typeof id === "object") return id
    })
    return await this.mongoDeleteMany({ _id: { $in: objectIdToRemove } })
  }

  async deleteAllFromConv(idConv) {
    if (typeof idConv === "string") idConv = this.getObjectId(idConv)
    return await this.mongoDeleteMany({ conv_id: idConv })
  }

  async deleteAllFromOrga(idOrga) {
    if (typeof idOrga === "object") idOrga = idOrga.toString()
    return await this.mongoDeleteMany({ orga_id: idOrga })
  }

  async getById(id) {
    return await this.mongoRequest({ _id: this.getObjectId(id) })
  }

  async getByConvId(id, projection) {
    return await this.mongoRequest(
      { conv_id: this.getObjectId(id) },
      projection,
    )
  }

  async getByConvIdAndVersion(id, version) {
    return await this.mongoRequest({
      conv_id: this.getObjectId(id),
      version,
    })
  }

  async deleteScreen(id, screenId) {
    return await this.mongoUpdateOne({ _id: this.getObjectId(id) }, "$pull", {
      screens: { screen_id: screenId },
    })
  }

  async updateScreen(id, screenId, screen) {
    const query = { _id: this.getObjectId(id) }
    const filter = { arrayFilters: [{ "elem.screen_id": screenId }] }
    screen.screen_id = screenId
    return await this.mongoUpdateOne(
      query,
      "$set",
      { "screens.$[elem]": screen },
      filter,
    )
  }

  async addScreen(id, screenId, screen, position = 0) {
    if (position < 0) position = 0
    return await this.mongoUpdateOne({ _id: this.getObjectId(id) }, "$push", {
      screens: { $each: [screen], $position: position },
    })
  }
}

module.exports = new SubtitleModel()
