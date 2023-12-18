import mongoClient from "../mongo.js"
import { ObjectId } from "mongodb"
import simplifyDuration from "../tools/simplifyDuration.js"
const DB_NAME = process.env.DB_NAME
export default class Users {
  static async getAll(number = 10, offset = 0, filter = {}) {
    const usersRaw = await mongoClient
      .db(DB_NAME)
      .collection("users")
      .find(filter)
      .skip(offset)
      .limit(number)
      .toArray()

    let users = []
    for (let i = 0; i < usersRaw.length; i++) {
      users[i] = new User(usersRaw[i])
    }

    return users
  }

  static async getEstimatedTotal() {
    const total = await mongoClient
      .db(DB_NAME)
      .collection("users")
      .estimatedDocumentCount()
    return total
  }

  static async countUser(filter = {}) {
    const total = await mongoClient
      .db(DB_NAME)
      .collection("users")
      .countDocuments(filter)
    return total
  }

  static async getOneById(id) {
    const user = await mongoClient
      .db(DB_NAME)
      .collection("users")
      .findOne({ _id: ObjectId(id) })

    if (user) return new User(user)
    else return null
  }

  static async getUsersAndStats(number = 10, offset = 0, email, ids = null) {
    let users = []
    let totalUsers = 0
    let totalExternalUsers = 0

    const filter = {}

    if (ids && ids.length > 0) {
      filter["_id"] = { $in: ids }
    }

    if (email) {
      filter["email"] = { $regex: `(${email})` }
    }

    users = await Users.getAll(number, offset, filter)
    totalUsers = await Users.countUser(filter)

    if (!email) {
      totalExternalUsers =
        totalUsers -
        (await Users.countUser({
          ...filter,
          email: { $regex: "(@linagora.com$)" },
        }))
    }

    const { totalDuration: convDuration, count: convCount } =
      await this.totalTime(ids)
    return {
      users,
      totalUsers,
      totalExternalUsers,
      convDuration: simplifyDuration(convDuration),
      convCount,
    }
  }

  static async totalTime(userIds) {
    const filter = {}

    if (userIds && userIds.length > 0) {
      filter["owner"] = { $in: userIds.map((id) => id.toString()) }
    }
    const stats = await mongoClient
      .db(DB_NAME)
      .collection("conversations")
      .aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalDuration: { $sum: "$metadata.audio.duration" },
          },
        },
      ])
      .toArray()
    return stats[0]
  }
}

export class User {
  constructor({ _id, email, firstname, lastname }) {
    this._id = _id
    this.email = email
    this.firstname = firstname
    this.lastname = lastname
  }

  get ownedConversationCount() {
    return this._ownedConversationCount
  }

  get ownedConversationsDuration() {
    return simplifyDuration(this._ownedConversationsDuration)
  }

  get sharedWithConversationsCount() {
    return this._sharedWithConversationsCount
  }

  get sharedWithConversationsDuration() {
    return simplifyDuration(this._sharedWithConversationsDuration)
  }

  get totalAudioDuration() {
    return simplifyDuration(
      (this._sharedWithConversationsDuration || 0) +
        (this._ownedConversationsDuration || 0)
    )
  }

  async fetchOwnedConversations() {
    this._ownedConversations = null
    const ownedConversationsStat = await mongoClient
      .db(DB_NAME)
      .collection("conversations")
      .aggregate([
        { $match: { owner: this._id.toString() } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalDuration: { $sum: "$metadata.audio.duration" },
          },
        },
      ])
      .toArray()

    if (ownedConversationsStat.length === 0) {
      this._ownedConversationCount = 0
      this._ownedConversationsDuration = 0
      return
    }

    this._ownedConversationCount = ownedConversationsStat[0].count
    this._ownedConversationsDuration = ownedConversationsStat[0].totalDuration
  }

  async fetchSharedWithConversations() {
    const sharedWithConversationsStat = await mongoClient
      .db(DB_NAME)
      .collection("conversations")
      .aggregate([
        {
          $match: {
            sharedWithUsers: { $elemMatch: { userId: this._id.toString() } },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalDuration: { $sum: "$metadata.audio.duration" },
          },
        },
      ])
      .toArray()

    if (sharedWithConversationsStat.length === 0) {
      this._sharedWithConversationsCount = 0
      this._sharedWithConversationsDuration = 0
      return
    }

    this._sharedWithConversationsCount = sharedWithConversationsStat[0].count
    this._sharedWithConversationsDuration =
      sharedWithConversationsStat[0].totalDuration
  }
}
