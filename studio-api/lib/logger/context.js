const debug = require("debug")("linto:lib:logger:context")

const model = require(`${process.cwd()}/lib/mongodb/models`)

const P_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const O_ROLE = require(`${process.cwd()}/lib/dao/organization/roles`)

const DEFAULT_LEVEL = "info"

const cache = {
  users: {},
  organizations: {},
}

async function storeCacheUser(userId) {
  if (cache.users[userId]) {
    return cache.users[userId]
  }

  const user = (await model.users.getById(userId))[0]
  return (cache.users[userId] = {
    lastname: user.lastname,
    firstname: user.firstname,
    email: user.email,
  })
}

async function storeCacheOrganization(organizationId) {
  if (cache.organizations[organizationId]) {
    return
  }

  const organization = (await model.organizations.getById(organizationId))[0]
  return (cache.organizations[organizationId] = {
    name: organization.name,
    description: organization.description,
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
    let normalizedMessage, errorContext
    try {
      if (message instanceof Error) {
        normalizedMessage = message.message
        errorContext = {
          name: message.name,
          stack: message.stack,
        }
      } else if (typeof message === "object" && message !== null) {
        normalizedMessage = JSON.stringify(message)
      } else {
        normalizedMessage = message || null
      }

      const context = { source, level }

      if (normalizedMessage) context.message = normalizedMessage
      if (errorContext) context.error = errorContext

      if (req?.method && req?.url) {
        context.http = {
          method: req.method,
          url: req.originalUrl || req.url,
          body: Object.keys(req.body || {}).length ? req.body : null,
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
        message: "Error creating log context",
        error: { name: err.name, stack: err.stack },
      }
    }
  }

  // TODO: WIP
  async createSocketContext(
    socket,
    socketEvent,
    { source = "socketio", level = DEFAULT_LEVEL } = {},
  ) {
    const context = {
      source,
      level,
      scope: { from: "resource", on: "session" },
      socket: {
        id: socket.id,
        namespace: socket.nsp?.name || "/",
        rooms: Array.from(socket.rooms || []), // rooms the socket joined
        connected: socket.connected,
        disconnected: socket.disconnected,
      },
    }

    if (socketEvent.from === "session") {
      //TODO: fetch session data there
      context.session = socketEvent
      context.message = `${socket.id} ${socketEvent.action} ${socketEvent.sessionId}`
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
  }
}

/*
{
  http: {
    method: 'GET',
    url: '/api/organizations/688778cb980f721744a206d8',
    body: null,
    status: 200
  },
  user: {
    id: '688778cb980f721744a206d7',
    role: { value: 31, name: 'SUPER_ADMINISTRATOR' },
    info: {
      lastname: 'Houpert',
      firstname: 'Yoann',
      email: 'yoann.houpert@gmail.com'
    }
  },
  organization: {
    id: '688778cb980f721744a206d8',
    role: { value: 6, name: 'ADMIN' },
    info: { name: 'yoann.houpert@gmail.com', description: undefined }
  },


  level: 'info',
  source: 'webserver',
  scope: { from: 'organization', on: null },
}
*/

// Export the singleton instance
module.exports = new LoggerContext()
