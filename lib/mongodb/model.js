const debug = require('debug')('linto:conversation-manager:models:mongodb:models')

const MongoDriver = require(`./driver`)

class MongoModel {

    constructor(collection) {
        this.collection = collection
    }

    getObjectId(id) {
        return MongoDriver.constructor.mongoDb.ObjectId(id)
    }

    createObjectId() {
        return MongoDriver.constructor.mongoDb.ObjectId()
    }

    // Request function for Mongodb. Makes a request on the collection, filtered by the query.
    async mongoRequest(query, projection) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).find(query).project(projection).toArray((error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            } catch (error) {
                console.error(error.toString())
                reject(error)
            }
        })
    }

    async mongoAggregatePaginate(query, projection, paginate = {}) {
        if (paginate.size === undefined || isNaN(paginate.size)) paginate.size = 100
        else paginate.size = parseInt(paginate.size)

        if (paginate.page === undefined || isNaN(paginate.page)) paginate.page = 0
        else paginate.page = parseInt(paginate.page)

        if ((paginate.sortField !== undefined && paginate.sortField !== '') && paginate.sortCriteria !== undefined) {    // sortCriteria can be 1, or -1
            if (isNaN(paginate.sortCriteria)) paginate.sort = { [paginate.sortField]: 1 }
            else if (parseInt(paginate.sortCriteria) === 1 || parseInt(paginate.sortCriteria) === -1) paginate.sort = { [paginate.sortField]: parseInt(paginate.sortCriteria) }
            else paginate.sort = { [paginate.sortField]: 1 }
        } else paginate.sort = { _id: 1 }

        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).aggregate([{
                    $facet: {
                        paginatedResult: [
                            { $sort: paginate.sort },
                            { $project: projection },
                            { $match: query },
                            { $skip: paginate.size * paginate.page },
                            { $limit: paginate.size },
                        ],
                        totalCount: [
                            { $match: query },
                            { $count: 'count' }
                        ]
                    }
                }]).toArray((error, result) => {
                    if (error) {
                        reject(error)
                    }

                    if (result[0].totalCount.length === 0) resolve({ count: 0, list: [] })
                    else {
                        resolve({
                            count: result[0].totalCount[0].count,
                            list: result[0].paginatedResult
                        })
                    }

                })
            } catch (error) {
                console.error(error.toString())
                reject(error)
            }
        })
    }


    // Insert/Create ONE
    async mongoInsert(payload) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).insertOne(payload, (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    /**
     * Update function for mongoDB. This function will update an entry based on the "collection", the "query" and the "values" passed in parmaters.
     * @param {Object} query
     * @param {Object} values
     * @returns {Pomise}
     */
    async mongoUpdate(query, values) {
        if (values._id) {
            delete values._id
        }

        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).updateOne(query, {
                    $set: values
                }, function (error, result) {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    // Update ONE, define update operator param
    async mongoUpdateOne(query, operator, values, filters) {
        if (values._id) {
            delete values._id
        } // do this so we dont double the _id?
        let payload = {}
        payload[operator] = values
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).updateOne(query, payload, filters, (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    async mongoUpdateMany(query, operator, values, filters) {
        if (values._id) {
            delete values._id
        } // do this so we dont double the _id?
        let payload = {}
        payload[operator] = values

        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).updateMany(query, payload, filters, (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }


    // Delete ONE
    async mongoDelete(query) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).deleteOne(query, (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })

            } catch (error) {
                console.error(error)
                reject(error)
            }
        })

    }

    // Aggregate
    async mongoAggregate(query) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).aggregate(query).toArray((error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

}

module.exports = MongoModel