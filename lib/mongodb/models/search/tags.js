const debug = require('debug')('linto:conversation-manager:models:mongodb:models:tags')
const MongoModel = require(`../../model`)

class TagModel extends MongoModel {

    constructor() {
        super('tags') // define name of 'users' collection elsewhere?
    }

    async getByIds(idList) {
        try {
            const query = {
                "_id": {
                    $in: idList
                }
            }
            console.log(query)
            return await this.mongoRequest(query)
        } catch (err) {
            console.error(err)
            return err
        }
    }
}

module.exports = new TagModel()