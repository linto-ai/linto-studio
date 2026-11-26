const debug = require("debug")(
  `linto:components:WebServer:routecontrollers:conversation:conversation`,
)

const conversationUtility = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/utility`,
)
const userUtility = require(
  `${process.cwd()}/components/WebServer/controllers/user/utility`,
)

const orgaUtility = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const PART_STATES = require(`${process.cwd()}/lib/dao/conversation/partStates`)
const conversationAccess = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

const { fetchJob } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)

const TYPE = require(`${process.cwd()}/lib/dao/conversation/types`)
const EXPIRATION = require(`${process.cwd()}/lib/dao/conversation/expiration`)

const { ConversationNotFound, ConversationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

const { OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

// Never written by this route, each has a dedicated one
const PROTECTED_FIELDS = [
  "owner",
  "organization",
  "sharedWithUsers",
  "securityLevel",
  "metadata",
  "jobs",
  "type",
  "expiresAt",
  "deleteOnFetch",
]

function stripProtectedFields(body) {
  return Object.fromEntries(
    Object.entries(body).filter(
      ([key]) => !PROTECTED_FIELDS.includes(key.split(".")[0]),
    ),
  )
}

// null removes the date: the media is never deleted. A child has no date of
// its own, it is deleted with its parent.
function parseExpiration(input, conversation) {
  if (TYPE.isChild(conversation.type?.mode)) {
    throw new ConversationError("expiresAt is set on the parent conversation")
  }
  if (input === null) return null

  const date = EXPIRATION.parseDate(input)
  if (!date) {
    throw new ConversationError("expiresAt expects a date to come, or null")
  }
  return date
}

// Kept while it is transcribed: only the fetch of its final state deletes it
function isLastFetch(conversation) {
  return (
    conversation.deleteOnFetch === true &&
    PART_STATES.isSettled(conversation.jobs?.transcription?.state)
  )
}

async function deleteFetched(conversation) {
  try {
    await orgaUtility.deleteConversationCascade(conversation)
  } catch (err) {
    logger.error(
      `Conversation ${conversation._id} could not be deleted after its fetch: ${err && err.message}`,
    )
  }
}

async function deleteConversation(req, res, next) {
  try {
    const conversation = await model.conversations.getById(
      req.params.conversationId,
    )
    if (conversation.length !== 1) throw new ConversationNotFound()

    await orgaUtility.deleteConversationCascade(conversation[0])

    res.status(200).send({
      message: "Conversation has been deleted",
    })
  } catch (err) {
    next(err)
  }
}

async function updateConversation(req, res, next) {
  try {
    const conversation = await model.conversations.getById(
      req.params.conversationId,
    )
    if (conversation.length !== 1) throw new ConversationNotFound()

    const conv = {
      ...stripProtectedFields(req.body),
      _id: req.params.conversationId,
    }
    let expiresAt
    if (req.body.expiresAt !== undefined) {
      expiresAt = parseExpiration(req.body.expiresAt, conversation[0])
    }

    const result = await model.conversations.update(conv)
    if (result.matchedCount === 0) throw new ConversationError()

    if (expiresAt !== undefined) {
      throwIfError(
        await model.conversations.updateExpiration(
          req.params.conversationId,
          expiresAt,
        ),
      )
    }

    res.status(200).send({
      message: "Conversation updated",
    })
  } catch (err) {
    next(err)
  }
}

async function getConversation(req, res, next) {
  try {
    let conversation = await model.conversations.getById(
      req.params.conversationId,
      ["jobs", "type"],
    )
    if (conversation.length !== 1) throw new ConversationNotFound()

    if (
      conversation[0].type.mode === "canonical" ||
      (conversation[0].type.mode === "child" &&
        conversation[0].jobs?.transcription?.job_id !== undefined)
    )
      await fetchJob(req.params.conversationId, conversation[0].jobs)

    const hasKeyFilter =
      Boolean(req?.query?.key) && typeof req.query.key === "string"
    if (hasKeyFilter) {
      const projectionValue =
        req.query.projection && /^\d+$/.test(req.query.projection)
          ? parseInt(req.query.projection, 10)
          : 1
      let filter = ["name", "owner", "organization", "sharedWithUsers", "jobs"]

      let projection = {}
      for (const key of req.query.key.split(",")) {
        projection[key] = projectionValue
      }

      filter.forEach((field) => {
        if (projectionValue === 1) projection[field] = 1
        else delete projection[field]
      })

      conversation = await model.conversations.getByIdWithFilter(
        req.params.conversationId,
        projection,
      )
    } else {
      conversation = await model.conversations.getById(
        req.params.conversationId,
      )
    }
    // Deleted by a concurrent fetch since the first read
    if (conversation.length !== 1) throw new ConversationNotFound()

    const data = await conversationUtility.getUserRightFromConversation(
      req.payload.data.userId,
      conversation[0],
    )

    // We need to get the audio duration from the session, the audio didn't exist on the conversation creation
    if (
      conversation[0].metadata &&
      conversation[0].metadata.audio &&
      conversation[0].metadata.audio.duration === 0 &&
      conversation[0].metadata.audio.filepath &&
      conversation[0].type.from_session_id !== undefined
    ) {
      conversation[0] = await conversationUtility.generateAudioDuration(
        conversation[0],
      )
    }

    // A key filter only reads it. Deleted once the answer is written out
    if (!hasKeyFilter && isLastFetch(conversation[0])) {
      res.once("finish", () => deleteFetched(conversation[0]))
    }

    res.status(200).send({
      ...conversation[0],
      userAccess: data.access,
      personal: data.personal,
    })
  } catch (err) {
    next(err)
  }
}

async function getUsersByConversation(req, res, next) {
  try {
    const conversation = await model.conversations.getById(
      req.params.conversationId,
    )
    if (conversation.length !== 1) throw new ConversationNotFound()

    let organization = await model.organizations.getById(
      conversation[0].organization.organizationId,
    )
    if (organization.length !== 1) throw new OrganizationNotFound()

    const userId = req.payload.data.userId
    const conversationUsers = await userUtility.getUsersListByConversation(
      userId,
      conversation[0],
      organization[0],
    )
    res.status(200).send({
      conversationUsers,
    })
  } catch (err) {
    next(err)
  }
}

async function getUsersByConversationList(req, res, next) {
  try {
    const batch = await conversationAccess.loadBatch(
      req.body.conversations.split(","),
      { sharedWithUsers: 1, organization: 1 },
    )
    const items = batch.map(({ conv, organization }) => {
      if (!conv) throw new ConversationNotFound()
      if (!organization) throw new OrganizationNotFound()
      return { conversation: conv, organization }
    })

    const members = throwIfError(
      await userUtility.getUsersListByConversations(
        req.payload.data.userId,
        items,
      ),
    )
    const result = batch.map(({ convId }, index) => ({
      conversationId: convId,
      member: members[index],
    }))
    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

async function getChildConversation(req, res, next) {
  try {
    const conversation = await model.conversations.getById(
      req.params.conversationId,
    )

    if (conversation.length !== 1) throw new ConversationNotFound()

    let projection = req.query?.projection
      ? req.query.projection.split(",")
      : []

    const childConversations =
      await model.conversations.getConversationFromParent(
        req.params.conversationId,
        projection,
      )
    res.status(200).send(childConversations)
  } catch (err) {
    next(err)
  }
}

async function duplicateConversation(req, res, next) {
  try {
    const conversation = await model.conversations.getById(
      req.params.conversationId,
    )
    if (conversation.length !== 1) throw new ConversationNotFound()

    const source = conversation[0]

    const copy = JSON.parse(JSON.stringify(source))
    delete copy._id
    delete copy.created
    delete copy.last_update
    // The copy is a regular media
    delete copy.deleteOnFetch

    copy.name = source.name + " (copy)"
    copy.owner = req.payload.data.userId
    copy.sharedWithUsers = []

    copy.type = {
      mode: "canonical",
      child_conversations: [],
    }

    copy.jobs = {
      transcription: {
        state: source.jobs?.transcription?.state || "done",
        steps: {},
      },
      keyword: {},
    }

    const result = await model.conversations.create(copy)
    if (!result.insertedId)
      throw new ConversationError("Error duplicating conversation")

    res.status(201).send({
      message: "Conversation duplicated",
      conversationId: result.insertedId.toString(),
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  deleteConversation,
  duplicateConversation,
  getConversation,
  getUsersByConversation,
  getUsersByConversationList,
  updateConversation,
  getChildConversation,
}
