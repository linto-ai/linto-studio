const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.5:organizationSessionPermissions`,
)

const PERMISSIONS = require(
  `${process.cwd()}/lib/dao/organization/permissions`,
)

// Bit 4 was SESSION in the legacy schema; it now means MICROPHONE. Orgs
// holding the legacy SESSION bit are granted the new BOT and SESSION bits so
// existing capabilities are preserved (bit 4 carries over as MICROPHONE).
const LEGACY_SESSION_BIT = 4
const NEW_BITS = PERMISSIONS.BOT | PERMISSIONS.SESSION

module.exports = {
  async up(db) {
    const cursor = db.collection("organizations").find({
      permissions: { $bitsAllSet: LEGACY_SESSION_BIT },
    })

    let updated = 0
    while (await cursor.hasNext()) {
      const org = await cursor.next()
      const next = (org.permissions || 0) | NEW_BITS
      if (next === org.permissions) continue
      await db
        .collection("organizations")
        .updateOne({ _id: org._id }, { $set: { permissions: next } })
      updated++
    }
    debug(
      `Granted BOT|SESSION to ${updated} organizations holding legacy SESSION bit`,
    )
  },

  async down(db) {
    const mask = ~NEW_BITS
    const cursor = db.collection("organizations").find({
      permissions: { $bitsAnySet: NEW_BITS },
    })

    let updated = 0
    while (await cursor.hasNext()) {
      const org = await cursor.next()
      const next = (org.permissions || 0) & mask
      await db
        .collection("organizations")
        .updateOne({ _id: org._id }, { $set: { permissions: next } })
      updated++
    }
    debug(`Cleared BOT|SESSION bits on ${updated} organizations`)
  },
}
