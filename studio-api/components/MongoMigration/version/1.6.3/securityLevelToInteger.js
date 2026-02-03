const debug = require("debug")(
  `linto:components:MongoMigration:controllers:version:1.6.3:securityLevelToInteger`,
)

// Migration mapping from old strings to new integers
const LEGACY_TO_INTEGER = {
  insecure: 0,
  sensitive: 1,
  secure: 2,
}

// Reverse mapping for downgrade
const INTEGER_TO_LEGACY = {
  0: "insecure",
  1: "sensitive",
  2: "secure",
}

module.exports = {
  async up(db) {
    // Migrate conversations collection
    for (const [stringVal, intVal] of Object.entries(LEGACY_TO_INTEGER)) {
      const result = await db.collection("conversations").updateMany(
        { securityLevel: stringVal },
        { $set: { securityLevel: intVal } },
      )
      debug(
        `Conversations: Updated ${result.modifiedCount} documents from "${stringVal}" to ${intVal}`,
      )
    }
  },

  async down(db) {
    // Rollback conversations collection
    for (const [intVal, stringVal] of Object.entries(INTEGER_TO_LEGACY)) {
      const result = await db.collection("conversations").updateMany(
        { securityLevel: parseInt(intVal) },
        { $set: { securityLevel: stringVal } },
      )
      debug(
        `Conversations: Reverted ${result.modifiedCount} documents from ${intVal} to "${stringVal}"`,
      )
    }
  },
}
