const debug = require('debug')('linto:conversation-manager:models:mongodb:models:logs')
const MongoModel = require(`../model`)

class LogsModel extends MongoModel {

    constructor() {
        super('logs') // define name of 'logs' collection elsewhere?
    }

    async createLog(log) {
      try {
          return await this.mongoInsert(log)
      } catch (error) {
          console.error(error)
          return error
      }
    }
  
}

module.exports = new LogsModel()