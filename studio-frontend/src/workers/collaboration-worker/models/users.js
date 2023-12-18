export default class Users {
  static users = {}

  static getUserById(userId) {
    return this.users[userId]
  }
  static addUser(userId) {
    this.users[userId] = new User(userId)
    return this.users[userId]
  }
  static removeUser(userId) {
    this.users[userId] = null
  }
}

export class User {
  constructor(data) {
    this.userId = data.userId
    this.inputField = null
  }
}
