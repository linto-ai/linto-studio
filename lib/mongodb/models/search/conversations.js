const MongoModel = require(`../../model`)
const debug = require('debug')('linto:conversation-manager:models:mongodb:models:conversations')

class ConvoModel extends MongoModel {

    constructor() {
        super('conversations')
    }

    async getByTagAndOrga(idOrga, tagList) {
        try {
            const query = {
                "organization.organizationId" : idOrga,
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

    async searchBy(convId, filter){
        try{
            let query = {
                "_id": {
                    $in: convId
                }
            }
            if(filter.name) {
                query.name = {
                    $regex: filter.name,
                    $options: 'i'
                }
            }
            if(filter.text) {
                query['text.raw_segment'] = {
                    $regex: filter.text,
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