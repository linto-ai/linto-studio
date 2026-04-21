const debug = require("debug")("linto:lib:mongodb:model")

const MongoDriver = require(`./driver`)

const { MongoError } = require(
  `${process.cwd()}/lib/mongodb/error/customErrors`,
)

async function runMongoOp(name, operation) {
  try {
    return await operation()
  } catch (error) {
    debug(`${name} error:`, error)
    throw new MongoError(error)
  }
}

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

  async mongoRequest(query, options = {}) {
    return runMongoOp("mongoRequest", async () => {
      let projection, sort, limit

      if (options && typeof options === "object" && !Array.isArray(options)) {
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
    })
  }

  async mongoAggregatePaginate(query, projection, paginate = {}) {
    const size = parseInt(paginate.size) || 100
    const page = parseInt(paginate.page) || 0
    const sortField = paginate.sortField || "_id"
    const sortCriteria = parseInt(paginate.sortCriteria) === -1 ? -1 : 1
    const sort = { [sortField]: sortCriteria, _id: sortCriteria }

    return runMongoOp("mongoAggregatePaginate", async () => {
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
      }
      return {
        count: result[0].totalCount[0].count,
        list: result[0].paginatedResult,
      }
    })
  }

  async mongoInsert(document) {
    return runMongoOp("mongoInsert", async () => {
      const collection = MongoDriver.constructor.db.collection(this.collection)
      const result = await collection.insertOne(document)

      if (result.acknowledged) {
        return {
          success: true,
          message: "Document inserted successfully",
          insertedId: result.insertedId,
          insertedCount: 1,
        }
      }
      return {
        success: false,
        message: "Document insertion was not acknowledged",
      }
    })
  }

  async mongoInsertMany(documents) {
    return runMongoOp("mongoInsertMany", async () => {
      const collection = MongoDriver.constructor.db.collection(this.collection)
      return await collection.insertMany(documents)
    })
  }

  async mongoUpdate(query, values) {
    if (values._id) {
      delete values._id
    }
    return runMongoOp("mongoUpdate", async () => {
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, { $set: values })
    })
  }

  async mongoUpdateOne(query, operator, values, filters) {
    if (values._id) {
      delete values._id
    }
    const payload = { [operator]: values }
    return runMongoOp("mongoUpdateOne", async () => {
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateOne(query, payload, filters)
    })
  }

  async mongoUpdateMany(query, operatorOrValues, values) {
    const update =
      typeof operatorOrValues === "string"
        ? { [operatorOrValues]: values }
        : { $set: operatorOrValues }
    return runMongoOp("mongoUpdateMany", async () => {
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .updateMany(query, update)
    })
  }

  async mongoDelete(query) {
    return runMongoOp("mongoDelete", async () => {
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .deleteOne(query)
    })
  }

  async mongoDeleteMany(query) {
    return runMongoOp("mongoDeleteMany", async () => {
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .deleteMany(query)
    })
  }

  async mongoAggregate(pipeline) {
    return runMongoOp("mongoAggregate", async () => {
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .aggregate(pipeline)
        .toArray()
    })
  }

  async mongoDistinct(field, filter = {}) {
    return runMongoOp("mongoDistinct", async () => {
      return await MongoDriver.constructor.db
        .collection(this.collection)
        .distinct(field, filter)
    })
  }
}

module.exports = MongoModel
