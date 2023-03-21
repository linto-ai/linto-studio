const MongoModel = require(`../../model`)
const debug = require('debug')('linto:conversation-manager:models:mongodb:models:conversations')

class ConvoModel extends MongoModel {

    constructor() {
        super('conversations')
    }

    async getByIdsAndTag(idList, tagList) {
        try {
            const query = {
                "_id": {
                    $in: idList
                },
                tags: {
                    $all: tagList
                }
            }
            return await this.mongoRequest(query)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async getByIdsAndTitle(idList, title) {
        try {
            const query = {
                "_id": {
                    $in: idList
                },
                "name": {
                    $regex: title,
                    $options: 'i'
                }
            }
            return await this.mongoRequest(query)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async getByIdsAndText(idList, text) {
        try {
            const query = {
                "_id": {
                    $in: idList
                },
                "text.raw_segment": {
                    $regex: text,
                    $options: 'i'
                }
            }
            return await this.mongoRequest(query)
        } catch (err) {
            console.error(err)
            return err
        }
    }
}

module.exports = new ConvoModel()
