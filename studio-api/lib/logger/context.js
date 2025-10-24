const debug = require("debug")("linto:lib:logger:context")

const axios = require(`${process.cwd()}/lib/utility/axios`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const P_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const O_ROLE = require(`${process.cwd()}/lib/dao/organization/roles`)

const SOCKET_EVENTS = require(`${process.cwd()}/lib/dao/log/socketEvent`)

const DEFAULT_LEVEL = "info"

const cache = {
  users: {},
  organizations: {},
  sessions: {},
}

async function storeCacheUser(userId) {
  if (cache.users[userId]) return cache.users[userId]

  const user = (await model.users.getById(userId))[0]
  return (cache.users[userId] = {
    lastname: user.lastname,
    firstname: user.firstname,
    email: user.email,
  })
}

async function storeCacheOrganization(organizationId) {
  if (cache.organizations[organizationId])
    return cache.organizations[organizationId]

  const organization = (await model.organizations.getById(organizationId))[0]
  return (cache.organizations[organizationId] = {
    name: organization.name,
    description: organization.description,
  })
}

async function storeCacheSession(sessionId) {
  if (cache.sessions[sessionId]) return cache.sessions[sessionId]

  const session = await axios.get(
    process.env.SESSION_API_ENDPOINT + `/sessions/${sessionId}`,
  )
  return (cache.sessions[sessionId] = {
    sessionId: sessionId,
    name: session.name,
    organizationId: session.organizationId,
    visibility: session.visibility,
  })
}

function defineScope(url = "") {
  if (!url) return "unknown"

  const parts = url.toLowerCase().split("/").filter(Boolean)

  if (parts[1] === "administration" || parts[1] === "transcriber_profiles")
    return "platform"
  if (parts[1] === "sessions") return "resource"

  const orgIndex = parts.indexOf("organizations")
  const hasOrganization = orgIndex !== -1 && parts[orgIndex + 1]

  const userIndex = parts.indexOf("users")
  const hasUser = userIndex !== -1 && parts[userIndex + 1]

  const hasDeeperResource =
    (hasOrganization && parts.length > orgIndex + 2) ||
    (hasUser && parts.length > userIndex + 2)

  const hasIdSegment = parts.some((p) => /^[0-9a-f]{6,}$|^\d+$|^{.+}$/i.test(p))
  const looksLikeResource =
    hasDeeperResource || (!hasOrganization && !hasUser && hasIdSegment)

  if (looksLikeResource) return "resource"
  if (hasOrganization) return "organization"
  if (hasUser) return "user"
  return "unknown"
}

function formatError(error) {
  let normalizedMessage, errorContext

  if (error instanceof Error) {
    normalizedMessage = error.message
    errorContext = {
      name: error.name,
      stack: error.stack,
    }
  } else if (typeof message === "object" && error !== null) {
    normalizedMessage = JSON.stringify(error)
  } else {
    normalizedMessage = error || null
  }

  return { normalizedMessage, errorContext }
}

class LoggerContext {
  constructor() {
    if (LoggerContext.instance) {
      return LoggerContext.instance
    }
    LoggerContext.instance = this
  }

  async createContext(
    req,
    message,
    { source = "webserver", level = DEFAULT_LEVEL } = {},
  ) {
    try {
      const context = { source, level, timestamp: new Date().toISOString() }

      let { normalizedMessage, errorContext } = formatError(message)
      if (normalizedMessage) context.message = normalizedMessage
      if (errorContext) context.error = errorContext

      if (req?.method && req?.url) {
        context.http = {
          method: req.method,
          url: req.originalUrl || req.url,
          // body: Object.keys(req.body || {}).length ? req.body : null,
          status: req.res?.statusCode || null,
        }
        context.scope = defineScope(context.http.url)
      }

      if (req?.payload?.data?.userId) {
        const userId = req.payload.data.userId
        const roleValue = req?.payload?.data?.role || null

        await storeCacheUser(userId) // Ensure user is cached
        context.user = {
          id: userId || null,
          role: {
            value: roleValue || null,
            name: P_ROLE.print(roleValue || null),
          },
          info: cache.users[userId],
        }
      }
      if (req?.params?.organizationId) {
        const organizationId = req.params.organizationId
        const orgRoleValue = req?.userRole || null

        await storeCacheOrganization(organizationId) // Ensure organization is cached
        context.organization = {
          id: organizationId,
          role: {
            value: orgRoleValue || null,
            name: O_ROLE.print(orgRoleValue || null),
          },
          info: cache.organizations[organizationId],
        }
      }

      return context
    } catch (err) {
      return {
        source: "system",
        level: "error",
        message: `Error creating log context from ${source}`,
        error: { name: err.name, stack: err.stack },
        timestamp: new Date().toISOString(),
      }
    }
  }

  // TODO: WIP
  async createSocketContext(
    socket,
    socketEvent,
    { source = "socketio", level = DEFAULT_LEVEL } = {},
  ) {
    try {
      const context = {
        source,
        level,
        scope: "resource",
        socket: {
          id: socket.id,
          connectionCount: 1,
          totalWatchTime: 0,
        },
        timestamp: new Date().toISOString(),
      }

      switch (socketEvent.action) {
        case SOCKET_EVENTS.JOIN:
          context.socket.lastJoinedAt = context.timestamp
          break
        case SOCKET_EVENTS.LEAVE:
        case SOCKET_EVENTS.DISCONNECT:
          context.socket.lastLeftAt = context.timestamp
          break
      }

      if (socketEvent.error) {
        const { normalizedMessage, errorContext } = formatError(
          socketEvent.error,
        )
        if (normalizedMessage) context.message = normalizedMessage
        if (errorContext) context.error = errorContext
      }

      if (socketEvent.from === "session") {
        const [sessionId, channelId] = socketEvent.sessionId.split("/")
        const session = await storeCacheSession(sessionId)
        context.session = session

        if (session.organizationId) {
          await storeCacheOrganization(session.organizationId)
          context.organization = {
            id: session.organizationId,
            info: cache.organizations[session.organizationId],
          }
        }

        context.message = `${socket.id} ${socketEvent.action} ${sessionId}`
      } else if (socketEvent.from === "organization") {
        await storeCacheOrganization(socketEvent.organizationId)

        context.organization = {
          id: socketEvent.organizationId,
          info: cache.organizations[socketEvent.organizationId],
        }
        context.message = socketEvent.message
      } else if (socketEvent.from === "socket") {
        context.message = socketEvent.message
      }

      return context
    } catch (err) {
      return {
        source: "system",
        level: "error",
        message: `Error creating log context from ${source}`,
        error: { name: err.name, stack: err.stack },
        timestamp: new Date().toISOString(),
      }
    }
  }
  async createSystemContext(
    message,
    { source = "system", level = DEFAULT_LEVEL } = {},
  ) {
    return {
      message,
      source,
      level,
      timestamp: new Date().toISOString(),
    }
  }
}

module.exports = new LoggerContext()
