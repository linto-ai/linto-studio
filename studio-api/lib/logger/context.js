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

  // Optional: socket context
  createSocketContext(socket, message, source = "socketio") {
    const userId = socket?.decoded?.data?.userId || null
    const roleValue = socket?.decoded?.data?.role || null
    const roleName = P_ROLE.print(roleValue) // fixed ROLE -> P_ROLE or O_ROLE
    const action = `SOCKET ${socket.id}`
    const resource = socket.nsp.name || "/"

    return {
      source,
      userId,
      role: { value: roleValue, name: roleName },
      action,
      resource,
      message,
    }
  }
}

// Export the singleton instance
module.exports = new LoggerContext()
