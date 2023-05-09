const MongoModel = require(`../model`)
const debug = require('debug')('linto:conversation-manager:models:mongodb:models:conversations')

const moment = require('moment')
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

class ConvoModel extends MongoModel {

    constructor() {
        super('conversations')
    }

    async create(conversation) {
        try {
            const dateTime = moment().format()
            conversation.created = dateTime
            conversation.last_update = dateTime

            return await this.mongoInsert(conversation)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async update(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload._id)
            }

            if (payload.organizationId)
                delete payload.organizationId

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

    async getConvos() {
        try {
            const query = {}
            const projection = {
                text: 0,
                speakers: 0,
                keywords: 0,
                highlights: 0
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
                _id: this.getObjectId(convoId)
            }
            let projection = {}
            if (projectionArray) {
                projectionArray.map(element => {
                    projection[element] = 1
                })
            }

            return await this.mongoRequest(query, projection)

        } catch (error) {
            console.error(error)

            return error
        }
    }

    // list conversation shared to the user
    async getByShare(idUser, filter = undefined) {
        try {
            const query = {
                "sharedWithUsers": {
                    $elemMatch: {
                        userId: idUser.toString(),
                    }
                }
            }

            if (filter.name) {
                query.name = {
                    $regex: filter.name,
                    $options: 'i'
                }
            }
            if (filter.text) {
                query['text.raw_segment'] = {
                    $regex: filter.text,
                    $options: 'i'
                }
            }
            if (filter.description) {
                query.description = {
                    $regex: filter.description,
                    $options: 'i'
                }
            }

            const projection = {
                text: 0,
                speakers: 0,
                keywords: 0,
                highlights: 0,
            }

            if (!filter) return await this.mongoRequest(query, projection)
            else return await this.mongoAggregatePaginate(query, projection, filter)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    // list conversation from an organization id
    async getConvoByOrga(idOrga) {
        getByOrga(idOrga)
    }

    async getByOrga(idOrga, projection) {
        try {
            const query = {
                "organization.organizationId": idOrga.toString()
            }
            if (!projection) {
                projection = {
                    text: 0,
                    speakers: 0,
                    keywords: 0,
                    highlights: 0
                }
            }

            return await this.mongoRequest(query, projection)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async listConversationByOrgaRole(idOrga, role, projection, filter = undefined) {
        try {
            const query = {
                "organization.organizationId": idOrga.toString()
            }
            if (!projection) {
                projection = {
                    text: 0,
                    speakers: 0,
                    keywords: 0,
                    highlights: 0
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
                jobs: { ...jobPayload }
            }
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async updateKeyword(_id, keywordPayload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(_id),
            }
            let mutableElements = {
                keywords: { ...keywordPayload }
            }

            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async updateTurn(_id, text) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(_id),
            }
            let mutableElements = {
                text: [...text]
            }

            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async updateCategory(_id, category) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(_id),
            }
            let mutableElements = {
                category: [...category]
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
                tags: [...tags]
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
                _id: this.getObjectId(id)
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
                "organization.organizationId": orgaId.toString()
            }
            const operator = "$pull"

            let tagIds = tags
            if (typeof tags === "string")
                tagIds = tags.split(",")

            const values = {
                tags: {
                    $in: tagIds
                }
            }
            return await this.mongoUpdateMany(query, operator, values)

        } catch (err) {

        }
    }

    async getByIdsAndTag(idList, tagList) {
        try {
            const query = {
                "_id": {
                    $in: idList
                },
                "tags": {
                    $elemMatch: {
                        $in: tagList
                    }
                }
            }
            return await this.mongoRequest(query)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async addSharedUser(id, shared) {
        try {

            const query = {
                _id: this.getObjectId(id)
            }
            const operator = "$addToSet"
            const values = {
                sharedWithUsers: shared
            }
            return await this.mongoUpdateOne(query, operator, values)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // Default right is 1 (read)
    async listConvFromOrga(organizationId, userId, userRole, desiredAccess = 1, filter) {
        try {
            let query = {
                "organization.organizationId": organizationId.toString(),
                $or: [
                    {
                        "organization.customRights": {
                            $elemMatch: {
                                userId: userId,
                                right: { $bitsAnySet: desiredAccess }
                            }
                        }
                    },
                    {
                        "organization.customRights": {
                            $not: {
                                $elemMatch: {
                                    userId: userId
                                }
                            }
                        }
                    }
                ]
            }

            if (filter.filter === 'notags') query.tags = { $size: 0 }
            if (filter.name) {
                query.name = {
                    $regex: filter.name,
                    $options: 'i'
                }
            }
            if (filter.text) {
                query['text.raw_segment'] = {
                    $regex: filter.text,
                    $options: 'i'
                }
            }

            if (userRole === ROLES.MEMBER) { // A member can only see conversation where he has access
                query['$or'][1]['organization.membersRight'] = { $bitsAnySet: desiredAccess }
            }

            return await this.mongoAggregatePaginate(query, { page: 0 }, filter)

        } catch (error) {
            console.error(error)
            return error
        }
    }

    async listConvFromConvIds(convIds, userId, userRole, desiredAccess = 1, filter) {
        try {
            convIds = convIds.map(id => {
                if (typeof id === 'string') return this.getObjectId(id)
                else return id
            })

            let query = {
                "_id": {
                    $in: convIds
                }, $or: [
                    {
                        "organization.customRights": {
                            $elemMatch: {
                                userId: userId,
                                right: { $bitsAnySet: desiredAccess }
                            }
                        }
                    },
                    {
                        "organization.customRights": {
                            $not: {
                                $elemMatch: {
                                    userId: userId
                                }
                            }
                        }
                    },
                    {
                        "sharedWithUsers": {
                            $elemMatch: {
                                userId: userId,
                                right: { $bitsAnySet: desiredAccess }
                            }
                        }
                    },
                ]
            }


            if (userRole === ROLES.MEMBER) { // A member can only see conversation where he has access
                query['$or'][1]['organization.membersRight'] = { $bitsAnySet: desiredAccess }
            }

            return await this.mongoAggregatePaginate(query, { page: 0 }, filter)

        } catch (error) {
            console.error(error)
            return error
        }
    }


}

module.exports = new ConvoModel()
