const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organization:optedInMembers",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  COLLECTION_TYPE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  VoiceprintCollectionNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)

const { resolveUserSampleAudio } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/userVoiceOptIn`,
)

async function verifyOrgMembership(organizationId, userId) {
  const orgs = await model.organizations.getById(organizationId)
  if (orgs.length === 0) {
    throw new VoiceprintCollectionNotFound("Organization not found")
  }
  const org = orgs[0]
  const isMember = (org.users || []).some((u) => u.userId === userId)
  if (!isMember) {
    throw new VoiceprintCollectionNotFound("User is not a member of this organization")
  }
  return org
}

async function getOptedInMembers(req, res, next) {
  try {
    const { organizationId, collectionId } = req.params

    const collections = await model.voiceprintCollections.getById(collectionId)
    if (collections.length === 0) {
      throw new VoiceprintCollectionNotFound()
    }
    const collection = collections[0]
    if (collection.organizationId.toString() !== organizationId) {
      throw new VoiceprintCollectionNotFound()
    }
    if (collection.type !== COLLECTION_TYPE.ORGANIZATION) {
      throw new VoiceprintCollectionNotFound(
        "This endpoint is only for organization collections",
      )
    }

    // Get users who opted in for this organization, cross-checked with current membership
    const [optIns, orgs] = await Promise.all([
      model.voiceOptIns.getByOrganizationId(organizationId),
      model.organizations.getById(organizationId),
    ])

    if (orgs.length === 0 || optIns.length === 0) {
      return res.status(200).send([])
    }

    const orgMemberIds = new Set((orgs[0].users || []).map((u) => u.userId))
    const optedInUserIds = optIns
      .map((o) => o.userId)
      .filter((id) => orgMemberIds.has(id))

    if (optedInUserIds.length === 0) {
      return res.status(200).send([])
    }

    const members = []
    await Promise.all(
      optedInUserIds.map(async (userId) => {
        try {
          const samples =
            await model.voiceSamples.getByUserId(userId)
          if (!samples || samples.length === 0) return

          const users = await model.users.getById(userId, true)
          if (users.length === 0) return
          const user = users[0]

          const totalDuration = samples.reduce(
            (sum, s) => sum + (s.audioDuration || 0),
            0,
          )

          members.push({
            userId: userId,
            name:
              `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
              "Member",
            samplesCount: samples.length,
            totalDuration,
            created: samples[samples.length - 1]?.created,
          })
        } catch (err) {
          debug("Failed to resolve member %s: %O", userId, err)
        }
      }),
    )

    res.status(200).send(members)
  } catch (err) {
    next(err)
  }
}

async function verifyOptIn(organizationId, userId) {
  const optIn = await model.voiceOptIns.getByUserAndOrg(userId, organizationId)
  if (optIn.length === 0) {
    throw new VoiceprintCollectionNotFound("User has not opted in for this organization")
  }
}

async function getOptedInMemberSamples(req, res, next) {
  try {
    const { organizationId, userId } = req.params
    await Promise.all([
      verifyOrgMembership(organizationId, userId),
      verifyOptIn(organizationId, userId),
    ])

    const samples = await model.voiceSamples.getByUserId(userId)
    res.status(200).send(samples)
  } catch (err) {
    next(err)
  }
}

async function getOptedInMemberSampleAudio(req, res, next) {
  try {
    const { organizationId, userId, sampleId } = req.params
    await Promise.all([
      verifyOrgMembership(organizationId, userId),
      verifyOptIn(organizationId, userId),
    ])

    const filePath = await resolveUserSampleAudio(sampleId, userId)
    res.sendFile(filePath)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getOptedInMembers,
  getOptedInMemberSamples,
  getOptedInMemberSampleAudio,
}
