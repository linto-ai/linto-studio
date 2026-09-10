const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.7:externalEntitlements`,
)

// External entitlements (what Twake & co declare about a person or a domain).
// The uniqueness tuple is (organizationId, provider, kind, email|domain): two
// partial unique indexes, one per kind, so a replay of the whole message
// history can never create a duplicate. The other indexes serve the
// resolution (subject → user, email → user, domain → domain record).
module.exports = {
  async up(db) {
    const collection = db.collection("externalEntitlements")
    await collection.createIndex(
      { organizationId: 1, provider: 1, kind: 1, email: 1 },
      {
        unique: true,
        name: "entitlement_user_key",
        partialFilterExpression: { kind: "user" },
      },
    )
    await collection.createIndex(
      { organizationId: 1, provider: 1, kind: 1, domain: 1 },
      {
        unique: true,
        name: "entitlement_domain_key",
        partialFilterExpression: { kind: "domain" },
      },
    )
    await collection.createIndex(
      { kind: 1, provider: 1, subject: 1 },
      { name: "entitlement_by_subject" },
    )
    await collection.createIndex(
      { kind: 1, email: 1 },
      { name: "entitlement_by_email" },
    )
    await collection.createIndex(
      { kind: 1, domain: 1 },
      { name: "entitlement_by_domain" },
    )
    debug("externalEntitlements indexes created")
  },

  async down(db) {
    // The records are the source of truth for the rights: never dropped, only
    // their indexes go.
    const collection = db.collection("externalEntitlements")
    for (const name of [
      "entitlement_user_key",
      "entitlement_domain_key",
      "entitlement_by_subject",
      "entitlement_by_email",
      "entitlement_by_domain",
    ]) {
      await collection.dropIndex(name).catch(() => {})
    }
  },
}
