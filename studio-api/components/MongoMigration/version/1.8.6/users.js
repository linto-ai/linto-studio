const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.6:users`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const VALIDITY_DATE = require(
  `${process.cwd()}/lib/dao/validityDate/validityDate.js`,
)

function normalizeEmail(email) {
  if (typeof email !== "string") return email
  return email.trim().toLowerCase()
}

// An unverified address that replaced a verified one goes back to pending,
// the last verified address becomes primary again
async function restorePendingEmail(users) {
  const cursor = users.find({
    type: { $ne: "machine" },
    fromSso: { $ne: true },
    emailIsVerified: false,
    "verifiedEmail.0": { $exists: true },
  })

  let moved = 0
  for await (const user of cursor) {
    if (user.verifiedEmail.includes(user.email)) continue
    const previous = user.verifiedEmail[user.verifiedEmail.length - 1]
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          email: previous,
          emailIsVerified: true,
          pendingEmail: {
            address: user.email,
            validityDate: VALIDITY_DATE.generateValidityDate(
              VALIDITY_DATE.SHORT,
            ),
          },
        },
      },
    )
    moved++
  }
  logger.info(`Moved ${moved} unverified primary addresses back to pending`)
}

// Accounts whose addresses only differ by case: touching them would merge
// distinct accounts, they are left as is and reported for manual cleanup
async function findCollisions(users) {
  const groups = await users
    .aggregate([
      { $match: { email: { $type: "string" } } },
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$email" } } },
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray()

  for (const group of groups) {
    logger.warn(
      `Email ${group._id} is shared by accounts ${group.ids.join(", ")}, left untouched`,
    )
  }
  return new Set(groups.map((group) => group._id))
}

function normalizedFields(user) {
  const fields = {}

  const email = normalizeEmail(user.email)
  if (email !== user.email) fields.email = email

  if (Array.isArray(user.verifiedEmail)) {
    const verifiedEmail = [...new Set(user.verifiedEmail.map(normalizeEmail))]
    const same =
      verifiedEmail.length === user.verifiedEmail.length &&
      verifiedEmail.every((value, i) => value === user.verifiedEmail[i])
    if (!same) fields.verifiedEmail = verifiedEmail
  }

  const pending = normalizeEmail(user.pendingEmail?.address)
  if (pending !== undefined && pending !== user.pendingEmail.address) {
    fields["pendingEmail.address"] = pending
  }

  const linked = normalizeEmail(user.authLink?.email)
  if (linked !== undefined && linked !== user.authLink.email) {
    fields["authLink.email"] = linked
  }

  return fields
}

// Lookups are case insensitive since the users model normalizes emails,
// stored addresses must match or existing accounts become unreachable
async function normalizeEmails(users) {
  const collisions = await findCollisions(users)
  const cursor = users.find(
    { email: { $type: "string" } },
    {
      projection: { email: 1, verifiedEmail: 1, pendingEmail: 1, authLink: 1 },
    },
  )

  let updated = 0
  let skipped = 0
  for await (const user of cursor) {
    if (collisions.has(normalizeEmail(user.email))) {
      skipped++
      continue
    }
    const fields = normalizedFields(user)
    if (Object.keys(fields).length === 0) continue

    await users.updateOne({ _id: user._id }, { $set: fields })
    updated++
  }
  logger.info(
    `Normalized email addresses on ${updated} accounts, ${skipped} skipped for collisions`,
  )
}

// Every account creation looks up that address, only pending changes are indexed
const PENDING_INDEX = { "pendingEmail.address": 1 }
const PENDING_INDEX_OPTIONS = {
  partialFilterExpression: { "pendingEmail.address": { $exists: true } },
}

module.exports = {
  async up(db) {
    const users = db.collection("users")
    await users.createIndex(PENDING_INDEX, PENDING_INDEX_OPTIONS)
    await restorePendingEmail(users)
    await normalizeEmails(users)
  },

  // Original casing is lost, only the pending address move is reverted
  async down(db) {
    const users = db.collection("users")
    await users.dropIndex(PENDING_INDEX).catch((err) => {
      if (err.codeName !== "IndexNotFound" && err.code !== 27) throw err
    })
    const cursor = users.find({ "pendingEmail.address": { $exists: true } })
    for await (const user of cursor) {
      await users.updateOne(
        { _id: user._id },
        {
          $set: { email: user.pendingEmail.address, emailIsVerified: false },
          $unset: { pendingEmail: "" },
        },
      )
    }
  },
}
