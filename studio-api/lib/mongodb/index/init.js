const logger = require(`${process.cwd()}/lib/logger/logger`)

const rules = require(`./rules.json`)

function createIndex(MongoDriver) {
  let collectionRules = Object.keys(rules)
  collectionRules.map((collectionName) => {
    rules[collectionName].map((rule) => {
      MongoDriver.db.collection(collectionName).createIndex(rule, (err) => {
        if (err) {
          logger.error(
            `> MongoDB : Failed to create index on ${collectionName} (${JSON.stringify(rule)}): ${err.message}`,
          )
        }
      })
    })
  })
}

module.exports = {
  createIndex,
}
