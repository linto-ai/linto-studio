const debug = require("debug")(
  "linto:components:WebServer:middlewares:access:conversation",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const platformAccess = require(`./platform`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const ORGANIZATION_ROLES = require(
  `${process.cwd()}/lib/dao/organization/roles`,
)

const projection = ["owner", "sharedWithUsers", "organization"]
const batchProjection = { owner: 1, sharedWithUsers: 1, organization: 1 }
const organizationProjection = { users: 1 }

const {
  ConversationReadAccessDenied,
  ConversationWriteAccessDenied,
  ConversationShareAccessDenied,
  ConversationDeleteAccessDenied,
  ConversationNotShared,
  ConversationIdRequire,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

module.exports = {
  asReadAccess: async (req, res, next) => {
    if (
      req.method === "GET" &&
      (await platformAccess.isSystemAdministrator(req))
    )
      next()
    else
      await access(
        next,
        req.params.conversationId,
        req.payload.data.userId,
        false,
        CONVERSATION_RIGHTS.READ,
        ConversationReadAccessDenied,
      ) // ORGA MEMBER
  },
  asCommentAccess: async (req, res, next) => {
    await access(
      next,
      req.params.conversationId,
      req.payload.data.userId,
      false,
      CONVERSATION_RIGHTS.COMMENT,
      ConversationReadAccessDenied,
    ) // ORGA MAINTENER
  },
  asWriteAccess: async (req, res, next) => {
    await access(
      next,
      req.params.conversationId,
      req.payload.data.userId,
      false,
      CONVERSATION_RIGHTS.WRITE,
      ConversationWriteAccessDenied,
    ) // ORGA MAINTENER
  },
  asDeleteAccess: async (req, res, next) => {
    await access(
      next,
      req.params.conversationId,
      req.payload.data.userId,
      true,
      CONVERSATION_RIGHTS.DELETE,
      ConversationDeleteAccessDenied,
    ) // ORGA MAINTENER
  },
  asShareAccess: async (req, res, next) => {
    await access(
      next,
      req.params.conversationId,
      req.payload.data.userId,
      false,
      CONVERSATION_RIGHTS.SHARE,
      ConversationShareAccessDenied,
    )
  },
  asShareBatchAccess: async (req, res, next) => {
    await batchAccess(
      next,
      req.body.conversations,
      req.payload.data.userId,
      CONVERSATION_RIGHTS.SHARE,
      ORGANIZATION_ROLES.MAINTAINER,
      ConversationShareAccessDenied,
    )
  },
  access: async (
    req,
    next,
    convId,
    userId,
    restricted,
    right,
    rightException,
  ) => {
    return await access(next, convId, userId, restricted, right, rightException)
  },
  asReadBatchAccess: async (req, res, next) => {
    const conversations = req.body.conversations
    if (!conversations) return next(new ConversationIdRequire())
    try {
      const batch = await loadBatch(conversations.split(","))
      for (const { conv, organization } of batch) {
        const refusal = accessRefusal(
          conv,
          organization,
          req.payload.data.userId,
          false,
          CONVERSATION_RIGHTS.READ,
          ConversationReadAccessDenied,
        )
        if (refusal) return next(new ConversationReadAccessDenied())
      }
      return next()
    } catch (err) {
      return next(err)
    }
  },
  hasAccess,
  loadBatch,
}

// Same decision tree as access(), usable without req/res/next context
async function hasAccess(convId, userId, right, restricted = false) {
  let granted = false
  await access(
    (err) => {
      if (!err) granted = true
    },
    convId,
    userId,
    restricted,
    right,
    ConversationReadAccessDenied,
  )
  return granted
}

async function access(next, convId, userId, restricted, right, rightException) {
  try {
    if (!convId) return next(new ConversationIdRequire())
    const lconv = await model.conversations.getById(convId, projection)
    if (lconv.length !== 1) return next(new ConversationNotShared())
    const conv = lconv[0]

    if (grantedByConversation(conv, userId, restricted, right)) return next()
    const organization = await loadOrganization(conv)
    const refusal = organizationRefusal(
      conv,
      organization,
      userId,
      right,
      rightException,
    )
    if (refusal) return next(refusal)
    return next()
  } catch (err) {
    return next(err)
  }
}

async function batchAccess(
  next,
  conversations,
  userId,
  rightConvo,
  rightOrga,
  rightException,
) {
  if (!conversations || conversations.length === 0) {
    return next(new ConversationIdRequire())
  }
  try {
    const batch = await loadBatch(conversations.split(","))
    for (const { conv, organization } of batch) {
      const refusal = shareBatchRefusal(
        conv,
        organization,
        userId,
        rightConvo,
        rightOrga,
        rightException,
      )
      if (refusal) return next(refusal)
    }
    return next()
  } catch (err) {
    return next(err)
  }
}

async function loadOrganization(conv) {
  const organizationId = conv.organization.organizationId
  if (organizationId === undefined) return undefined
  const lorga = await model.organizations.getById(organizationId)
  return lorga[0]
}

// Conversations then their organizations, one query per collection, in the
// order of the ids; an unknown id gives an undefined conv
async function loadBatch(convIds, convProjection = batchProjection) {
  const conversations = throwIfError(
    await model.conversations.getConvsListByIds(convIds, convProjection),
  )
  const organizationIds = new Set(
    conversations.map((conv) => conv.organization.organizationId),
  )
  let organizations = []
  if (organizationIds.size > 0) {
    organizations = throwIfError(
      await model.organizations.getByIds(
        [...organizationIds],
        organizationProjection,
      ),
    )
  }

  const conversationById = new Map(
    conversations.map((conv) => [conv._id.toString(), conv]),
  )
  const organizationById = new Map(
    organizations.map((orga) => [orga._id.toString(), orga]),
  )
  return convIds.map((convId) => {
    const conv = conversationById.get(convId)
    let organization
    if (conv)
      organization = organizationById.get(conv.organization.organizationId)
    return { convId, conv, organization }
  })
}

// The single entry matching, undefined when there is none or several
function onlyMatch(list, predicate) {
  const matches = list.filter(predicate)
  if (matches.length === 1) return matches[0]
  return undefined
}

function isSharedWith(conv, userId, right) {
  const share = onlyMatch(
    conv.sharedWithUsers,
    (share) =>
      share.userId === userId &&
      CONVERSATION_RIGHTS.hasRightAccess(share.right, right),
  )
  return share !== undefined
}

// Owner and direct shares grant without looking at the organization
function grantedByConversation(conv, userId, restricted, right) {
  if (conv.owner === userId) return true
  if (conv.organization.organizationId === undefined) return false
  return !restricted && isSharedWith(conv, userId, right)
}

// Refusal for a loaded conversation and its organization, null when granted
function accessRefusal(
  conv,
  organization,
  userId,
  restricted,
  right,
  rightException,
) {
  if (!conv) return new ConversationNotShared()
  if (grantedByConversation(conv, userId, restricted, right)) return null
  return organizationRefusal(conv, organization, userId, right, rightException)
}

function organizationRefusal(
  conv,
  organization,
  userId,
  right,
  rightException,
) {
  if (!organization) return new rightException()

  const member = onlyMatch(organization.users, (user) => user.userId === userId)
  if (!member) return new ConversationNotShared()
  if (
    ORGANIZATION_ROLES.hasRoleAccess(member.role, ORGANIZATION_ROLES.MAINTAINER)
  ) {
    return null
  }

  const customRight = onlyMatch(
    conv.organization.customRights,
    (customRight) => customRight.userId === userId,
  )
  if (customRight) {
    if (CONVERSATION_RIGHTS.hasRightAccess(customRight.right, right))
      return null
    return new rightException()
  }

  if (CONVERSATION_RIGHTS.hasRightAccess(conv.organization.membersRight, right))
    return null
  return new ConversationNotShared()
}

// Share batch tree: organization role first, then owner, share and custom right
function shareBatchRefusal(
  conv,
  organization,
  userId,
  rightConvo,
  rightOrga,
  rightException,
) {
  if (!conv) return new ConversationNotShared()
  if (!organization) return new rightException()

  const member = onlyMatch(
    organization.users,
    (user) =>
      user.userId === userId &&
      ORGANIZATION_ROLES.hasRoleAccess(user.role, rightOrga),
  )
  if (member) return null
  if (conv.owner === userId) return null
  if (isSharedWith(conv, userId, rightConvo)) return null

  const customRight = onlyMatch(
    conv.organization.customRights,
    (customRight) => customRight.userId === userId,
  )
  if (
    customRight &&
    CONVERSATION_RIGHTS.hasRightAccess(customRight.right, rightConvo)
  ) {
    return null
  }
  return new rightException()
}
