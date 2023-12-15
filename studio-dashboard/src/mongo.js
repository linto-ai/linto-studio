import { MongoClient } from "mongodb"
const client = new MongoClient(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`
)
await client.connect()

export default client
