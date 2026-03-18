const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organization:optedInMembers",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  COLLECTION_TYPE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  SpeakerLabelCollectionNotFound,
  UserVoiceSignatureNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerDiarization`,
)

const { resolveUserSignatureAudio } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/userVoiceOptIn`,
)

async function verifyOrgMembership(organizationId, userId) {
  const orgs = await model.organizations.getById(organizationId)
  if (orgs.length === 0) {
    throw new UserVoiceSignatureNotFound("Organization not found")
  }
  const org = orgs[0]
  const isMember = (org.users || []).some((u) => u.userId === userId)
  if (!isMember) {
    throw new UserVoiceSignatureNotFound("User is not a member of this organization")
  }
  return org
}

async function getOptedInMembers(req, res, next) {
  try {
    const { organizationId, collectionId } = req.params

    // Verify the collection exists, belongs to this org, and is type "organization"
    const collections = await model.speakerLabelCollections.getById(collectionId)
    if (collections.length === 0) {
      throw new SpeakerLabelCollectionNotFound()
    }
    const collection = collections[0]
    if (collection.organizationId.toString() !== organizationId) {
      throw new SpeakerLabelCollectionNotFound()
    }
    if (collection.type !== COLLECTION_TYPE.ORGANIZATION) {
      throw new SpeakerLabelCollectionNotFound(
        "This endpoint is only for organization collections",
      )
    }

    // Get organization members
    const orgs = await model.organizations.getById(organizationId)
    if (orgs.length === 0) {
      return res.status(200).send([])
    }
    const org = orgs[0]
    const memberUserIds = (org.users || []).map((u) => u.userId)

    // For each member, check if they have voice signatures
    const members = []
    await Promise.all(
      memberUserIds.map(async (userId) => {
        try {
          const signatures =
            await model.voiceSignatures.getByUserId(userId)
          if (!signatures || signatures.length === 0) return

          const users = await model.users.getById(userId, true)
          if (users.length === 0) return
          const user = users[0]

          const totalDuration = signatures.reduce(
            (sum, s) => sum + (s.audioDuration || 0),
            0,
          )

          members.push({
            userId: userId,
            name:
              `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
              "Member",
            signaturesCount: signatures.length,
            totalDuration,
            created: signatures[signatures.length - 1]?.created,
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

async function getOptedInMemberSignatures(req, res, next) {
  try {
    const { organizationId, userId } = req.params
    await verifyOrgMembership(organizationId, userId)

    const signatures = await model.voiceSignatures.getByUserId(userId)
    res.status(200).send(signatures)
  } catch (err) {
    next(err)
  }
}

async function getOptedInMemberSignatureAudio(req, res, next) {
  try {
    const { organizationId, userId, sigId } = req.params
    await verifyOrgMembership(organizationId, userId)

    const filePath = await resolveUserSignatureAudio(sigId, userId)
    res.sendFile(filePath)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getOptedInMembers,
  getOptedInMemberSignatures,
  getOptedInMemberSignatureAudio,
}
