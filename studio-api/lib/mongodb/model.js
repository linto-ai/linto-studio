const debug = require("debug")(
  "linto:conversation-manager:models:mongodb:models",
)

const MongoDriver = require(`./driver`)

const { MongoError } = require(
  `${process.cwd()}/lib/mongodb/error/customErrors`,
)

class MongoModel {
  constructor(collection) {
    this.collection = collection
  }

  getObjectId(id) {
    return new MongoDriver.constructor.mongoDb.ObjectId(id)
  }

  createObjectId() {
    return new MongoDriver.constructor.mongoDb.ObjectId()
  }

  // Request function for Mongodb. Makes a request on the collection, filtered by the query.
  async mongoRequest(query, options = {}) {
    try {
      let projection, sort, limit

      // Detect if second argument is an object containing options
      if (options && typeof options === "object" && !Array.isArray(options)) {
        // If it has the typical keys, treat as options
        if (
          "projection" in options ||
          "sort" in options ||
          "limit" in options
        ) {
          ;({ projection, sort, limit } = options)
        } else {
          // Otherwise, assume it's the old-style projection object
          projection = options
        }
      }

      const collection = MongoDriver.constructor.db.collection(this.collection)
      let cursor = collection.find(query)

      if (projection) cursor = cursor.project(projection)
      if (sort) cursor = cursor.sort(sort)
      if (limit) cursor = cursor.limit(limit)

      return await cursor.toArray()
    } catch (error) {
      debug("mongoRequest error:", error)
      throw new MongoError(error)
    }
  }

  async mongoAggregatePaginate(query, projection, paginate = {}) {
    const size = parseInt(paginate.size) || 100
    const page = parseInt(paginate.page) || 0
    const sortField = paginate.sortField || "_id"
    const sortCriteria = parseInt(paginate.sortCriteria) === -1 ? -1 : 1
    const sort = { [sortField]: sortCriteria, _id: sortCriteria }

    try {
      const paginatedResultPipeline = [
        { $sort: sort },
        { $skip: size * page },
        { $limit: size },
      ]

      if (!projection.skipProjection) {
        paginatedResultPipeline.push({ $project: projection })
      }

      const aggregationPipeline = [
        { $match: query },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            paginatedResult: paginatedResultPipeline,
          },
        },
      ]

      const collection = MongoDriver.constructor.db.collection(this.collection)
      const result = await collection.aggregate(aggregationPipeline).toArray()

      if (result[0].totalCount.length === 0) {
        return { count: 0, list: [] }
      } else {
        return {
          count: result[0].totalCount[0].count,
          list: result[0].paginatedResult,
        }
      }
    } catch (error) {
      debug("mongoAggregatePaginate error:", error)
      throw new MongoError(error)
    }
  }

  // Insert/Create ONE
  async mongoInsert(document) {
    try {
      const collection = MongoDriver.constructor.db.collection(this.collection)
      const result = await collection.insertOne(document)
      // Assuming `this.db` is your MongoDB database instance and `this.collection` is the target collection name

      if (result.acknowledged) {
        //result.insertedId.toString()
        return {
          success: true,
          message: "Document inserted successfully",
          insertedId: result.insertedId,
          insertedCount: 1,
        }
      } else {
        return {
          success: false,
          message: "Document insertion was not acknowledged",
        }
      }
    } catch (error) {
      console.error("Error in mongoInsert:", error)
      return {
        success: false,
        message: "Error inserting document",
        error: error,
      }
    }
  }

  // Insert/Create MANY
  async mongoInsertMany(documents) {
    try {
      const collection = MongoDriver.constructor.db.collection(this.collection)
      const result = await collection.insertMany(documents)
      return result
    } catch (error) {
      console.error("Error in mongoInsertMany:", error)
      return {
        success: false,
        message: "Error inserting documents",
        error: error,
      }
    }
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

    try {
      const result = await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, { $set: values })
      return result
    } catch (error) {
      debug("mongoUpdate error:", error)
      throw error // Rethrow the error after logging it
    }
  }

  // Update ONE, define update operator param
  async mongoUpdateOne(query, operator, values, filters) {
    if (values._id) {
      delete values._id
    }
    let payload = {}
    payload[operator] = values

    try {
      const result = await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, payload, filters)
      return result
    } catch (error) {
      debug("mongoUpdateOne error:", error)
      throw error // Rethrow the error after logging it
    }
  }

  async mongoUpdateMany(query, operatorOrValues, values) {
    try {
      const update =
        typeof operatorOrValues === "string"
          ? { [operatorOrValues]: values }
          : { $set: operatorOrValues }

      const result = await MongoDriver.constructor.db
        .collection(this.collection)
        .updateMany(query, update)

      return result
    } catch (error) {
      debug("mongoUpdateMany error:", error)
      throw error
    }
  }

  async mongoDelete(query) {
    try {
      const result = await MongoDriver.constructor.db
        .collection(this.collection)
        .deleteOne(query)
      return result
    } catch (error) {
      debug("mongoDelete error:", error)
      throw error // Rethrow the error to be handled by the caller
    }
  }

  async mongoDeleteMany(query) {
    try {
      const result = await MongoDriver.constructor.db
        .collection(this.collection)
        .deleteMany(query)
      return result
    } catch (error) {
      debug("mongoDeleteMany error:", error)
      throw error // Rethrow the error to be handled by the caller
    }
  }

  async mongoAggregate(pipeline) {
    try {
      const result = await MongoDriver.constructor.db
        .collection(this.collection)
        .aggregate(pipeline)
        .toArray()
      return result
    } catch (error) {
      debug("mongoAggregate error:", error)
      throw error // Rethrow the error to be handled by the caller
    }
  }

  async mongoDistinct(field, filter = {}) {
    try {
      const result = await MongoDriver.constructor.db
        .collection(this.collection)
        .distinct(field, filter)

      return result
    } catch (error) {
      console.error("mongoDistinct error:", error)
      throw error
    }
  }
}

module.exports = MongoModel
