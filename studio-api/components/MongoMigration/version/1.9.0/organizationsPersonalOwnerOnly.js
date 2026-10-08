const debug = require("debug")(
  `linto:components:MongoMigration:version:1.9.0:organizationsPersonalOwnerOnly`,
)

const moment = require("moment")

const logger = require(`${process.cwd()}/lib/logger/logger`)
const MongoDriver = require(`${process.cwd()}/lib/mongodb/driver`)
const saas = require(`${process.cwd()}/lib/saas`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

// In SaaS mode a personal organization only holds its owner. A removed member
// keeps a read share on each media they could read, API keys are deleted.
const BACKUP_COLLECTION = "organizationsRemovedMembers"

// Same resolution as the conversation access middleware for an org member
function canRead(conversation, member) {
  if (ROLES.hasRoleAccess(member.role, ROLES.MAINTAINER)) return true
  const organization = conversation.organization || {}
  const custom = (organization.customRights || []).find(
    (right) => right.userId === member.userId,
  )
  const right = custom ? custom.right : organization.membersRight
  return RIGHTS.hasRightAccess(right, RIGHTS.READ)
}

async function listApiKeyIds(db, users) {
  const ids = users.map(
    (user) => new MongoDriver.constructor.mongoDb.ObjectId(user.userId),
  )
  const machines = await db
    .collection("users")
    .find(
      { _id: { $in: ids }, type: USER_TYPE.M2M },
      { projection: { _id: 1 } },
    )
    .toArray()
  return machines.map((machine) => machine._id.toString())
}

async function shareMedia(db, organization, members) {
  const conversations = await db
    .collection("conversations")
    .find(
      { "organization.organizationId": organization._id.toString() },
      { projection: { owner: 1, organization: 1 } },
    )
    .toArray()

  let shares = 0
  for (const conversation of conversations) {
    for (const member of members) {
      if (conversation.owner === member.userId) continue
      if (!canRead(conversation, member)) continue
      // An existing share is kept as it is
      const result = await db.collection("conversations").updateOne(
        {
          _id: conversation._id,
          "sharedWithUsers.userId": { $ne: member.userId },
        },
        {
          $push: {
            sharedWithUsers: {
              userId: member.userId,
              right: RIGHTS.READ,
              sharedBy: organization.owner,
            },
          },
        },
      )
      shares += result.modifiedCount
    }
  }
  return shares
}

async function keepOwnerOnly(db, organization) {
  const others = organization.users.filter(
    (user) => user.userId !== organization.owner,
  )
  const apiKeyIds = await listApiKeyIds(db, others)
  const members = others.filter((user) => !apiKeyIds.includes(user.userId))

  await db.collection(BACKUP_COLLECTION).insertOne({
    organizationId: organization._id.toString(),
    name: organization.name,
    owner: organization.owner,
    removed: others.map((user) => ({
      userId: user.userId,
      role: user.role,
      apiKey: apiKeyIds.includes(user.userId),
    })),
    date: moment().format(),
  })

  const shares = await shareMedia(db, organization, members)

  // A custom right outlives the membership on batch routes: drop it
  await db.collection("conversations").updateMany(
    { "organization.organizationId": organization._id.toString() },
    {
      $pull: {
        "organization.customRights": {
          userId: { $in: others.map((user) => user.userId) },
        },
      },
    },
  )

  await db.collection("organizations").updateOne(
    { _id: organization._id },
    {
      $set: {
        users: organization.users.filter(
          (user) => user.userId === organization.owner,
        ),
        last_update: moment().format(),
      },
    },
  )

  if (apiKeyIds.length) {
    await db.collection("tokens").deleteMany({ userId: { $in: apiKeyIds } })
    await db.collection("users").deleteMany({
      _id: {
        $in: apiKeyIds.map(
          (id) => new MongoDriver.constructor.mongoDb.ObjectId(id),
        ),
      },
      type: USER_TYPE.M2M,
    })
  }

  logger.info(
    `Personal organization ${organization._id} "${organization.name}": ${members.length} member(s) removed, ${apiKeyIds.length} API key(s) deleted, ${shares} read share(s) added`,
  )
}

module.exports = {
  async up(db) {
    if (!saas.enabled()) {
      logger.info("SaaS mode is off, personal organizations are left untouched")
      return
    }

    const organizations = await db
      .collection("organizations")
      .find({
        personal: true,
        pendingCheckout: { $exists: false },
        "users.1": { $exists: true },
      })
      .toArray()

    for (const organization of organizations) {
      const isOwnerMember = organization.users.some(
        (user) => user.userId === organization.owner,
      )
      if (!isOwnerMember) {
        logger.warn(
          `Personal organization ${organization._id} "${organization.name}" skipped: its owner is not a member`,
        )
        continue
      }
      await keepOwnerOnly(db, organization)
    }
  },

  // Members are removed for good, BACKUP_COLLECTION keeps who they were
  async down() {},
}
