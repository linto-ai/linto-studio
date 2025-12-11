const debug = require("debug")("linto:components:socketio")
const Component = require(`../component.js`)
const socketIO = require("socket.io")
const axios = require(`${process.cwd()}/lib/utility/axios`)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const SOCKET_EVENTS = require(`${process.cwd()}/lib/dao/log/socketEvent`)

const { diffSessions, groupSessionsByOrg } = require(
  `${process.cwd()}/components/IoHandler/controllers/SessionHandling`,
)
const { watchConversation, refreshInterval } = require(
  `${process.cwd()}/components/IoHandler/controllers/ConversationHandling`,
)

const auth_middlewares = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const { sessionSocketAccess } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/organization.js`,
)

function denySocket(socket) {
  socket.emit("unauthorized")
  socket.disconnect(true)
  return false
}

async function checkSocketAccess(socket, roomId) {
  const sessionRoomId = roomId.split("/")[0]

  try {
    // Load session
    const sessionRes = await axios.get(
      `${process.env.SESSION_API_ENDPOINT}/sessions/${sessionRoomId}`,
    )
    const session = sessionRes?.data ?? sessionRes

    // Check user auth
    const { isAuth, userId, sessionId } =
      await auth_middlewares.checkSocket(socket)

    // Protected session data
    const protectedSession =
      await model.sessionData.getBySessionId(sessionRoomId)
    const hasPassword =
      protectedSession?.[0]?.password && protectedSession.length > 0

    // Public session + no protection
    if (session.visibility === "public" && !hasPassword) {
      return true
    }

    // User is not authenticated
    if (!isAuth) {
      return denySocket(socket)
    }

    // Public session & sessionId matches with a password
    if (
      session.visibility === "public" &&
      sessionId === session.id &&
      hasPassword
    ) {
      return true
    }

    // Determine user access from organization access
    const access = await sessionSocketAccess(session, userId)
    if (access === true) {
      // if (session.visibility === "organization") {
      return true
    }

    // Private & owner or explicitly granted access
    if (session.visibility === "private" && session.owner === userId) {
      return true
    }

    return denySocket(socket)
  } catch (err) {
    LogManager.logSocketEvent(
      socket,
      {
        action: SOCKET_EVENTS.UNAUTHORIZED,
        message: `Unauthorized client connected : ${socket.id}`,
        error: err,
        from: "socket",
      },
      { level: "error" },
    )
    return denySocket(socket)
  }
}
class IoHandler extends Component {
  constructor(app) {
    super(app, "WebServer") // Relies on a WebServer component to be registrated
    this.id = this.constructor.name
    this.app = app

    this.rooms = {}
    this.orgas = {}
    this.medias = {}
    this.sessionsCache = {}
    this.memorySessions = {}
    this.memoryMedias = {}

    this.io = socketIO(this.app.components["WebServer"].httpServer, {
      cors: {
        origin: process.env.CORS_API_WHITELIST.split(","),
        methods: ["GET", "POST"],
        credentials: true,
      },
    })

    this.io.use(auth_middlewares.isAuthenticateSocket) // Used initialy to require authentication, disabling annonymous sessions
    this.io.on("connection", (socket) => {
      LogManager.logSocketEvent(socket, {
        action: SOCKET_EVENTS.CONNECTING,
        message: `New client connected : ${socket.id}`,
        from: "socket",
      })

      if (
        !this.app.components["BrokerClient"] ||
        this.app.components["BrokerClient"].deliveryState !== "ready"
      ) {
        socket.emit("broker_ko")
      }

      socket.on("join_room", async (roomId) => {
        if (!(await checkSocketAccess(socket, roomId))) return
        LogManager.logSocketEvent(socket, {
          sessionId: roomId,
          action: SOCKET_EVENTS.JOIN,
          from: "session",
        })
        this.addSocketInRoom(roomId, socket)
      })

      socket.on("leave_room", (roomId) => {
        LogManager.logSocketEvent(socket, {
          sessionId: roomId,
          action: SOCKET_EVENTS.LEAVE,
          from: "session",
        })
        this.removeSocketFromRoom(roomId, socket)
      })

      socket.on("watch_organization_session", async (orgaId) => {
        // Security: Verify user has access to this organization
        try {
          const { isAuth, userId } = await auth_middlewares.checkSocket(socket)
          if (!isAuth || !userId) {
            debug(`[Session] Unauthorized watch_organization_session attempt for org ${orgaId}`)
            return
          }
          const orgAccess = await model.organizations.getByIdAndUser(orgaId, userId)
          if (!orgAccess || orgAccess.length === 0) {
            debug(`[Session] User ${userId} denied access to org ${orgaId}`)
            return
          }
        } catch (err) {
          debug(`[Session] Auth check failed for watch_organization_session: ${err.message}`)
          return
        }
        this.addSocketInOrga(orgaId, socket, "session")
      })

      socket.on("unwatch_organization_session", (orgaId) => {
        this.removeSocketFromOrga(orgaId, socket)
      })

      socket.on("watch_organization_media", async (orgaId) => {
        // Security: Verify user has access to this organization
        try {
          const { isAuth, userId } = await auth_middlewares.checkSocket(socket)
          if (!isAuth || !userId) {
            debug(`[Media] Unauthorized watch_organization_media attempt for org ${orgaId}`)
            return
          }
          const orgAccess = await model.organizations.getByIdAndUser(orgaId, userId)
          if (!orgAccess || orgAccess.length === 0) {
            debug(`[Media] User ${userId} denied access to org ${orgaId}`)
            return
          }
        } catch (err) {
          debug(`[Media] Auth check failed for watch_organization_media: ${err.message}`)
          return
        }
        this.addSocketInMedia(orgaId, socket)
      })

      socket.on("unwatch_organization_media", (orgaId) => {
        this.removeSocketFromMedia(orgaId, socket)
      })

      socket.on("disconnect", () => {
        LogManager.logSocketEvent(socket, {
          action: SOCKET_EVENTS.DISCONNECT,
          from: "socket",
        })
        this.searchAndRemoveSocketFromRooms(socket)
      })

      // LLM job subscription handlers
      socket.on("llm:join", async (data) => {
        const { organizationId, conversationId } = data
        if (!organizationId) return

        // Security: Verify user has access to this organization
        try {
          const { isAuth, userId } = await auth_middlewares.checkSocket(socket)
          if (!isAuth || !userId) {
            debug(`[LLM] Unauthorized llm:join attempt for org ${organizationId}`)
            return
          }

          // Check user belongs to this organization
          const orgAccess = await model.organizations.getByIdAndUser(organizationId, userId)
          if (!orgAccess || orgAccess.length === 0) {
            debug(`[LLM] User ${userId} denied access to org ${organizationId}`)
            return
          }
        } catch (err) {
          debug(`[LLM] Auth check failed for llm:join: ${err.message}`)
          return
        }

        // Join organization-level LLM room
        const orgRoom = `llm/${organizationId}`
        socket.join(orgRoom)
        debug(`Socket ${socket.id} joined LLM room ${orgRoom}`)

        // Join conversation-specific room if provided
        if (conversationId) {
          const convRoom = `llm/${organizationId}/${conversationId}`
          socket.join(convRoom)
          debug(`Socket ${socket.id} joined LLM room ${convRoom}`)
        }
      })

      socket.on("llm:leave", (data) => {
        const { organizationId, conversationId } = data
        if (!organizationId) return

        const orgRoom = `llm/${organizationId}`
        socket.leave(orgRoom)

        if (conversationId) {
          const convRoom = `llm/${organizationId}/${conversationId}`
          socket.leave(convRoom)
        }
      })
    })

    return this.init()
  }

  async addSocketInMedia(orgaId, socket) {
    socket.join(orgaId)
    if (this.medias.hasOwnProperty(orgaId)) {
      this.medias[orgaId].add(socket.id)
    } else {
      this.medias[orgaId] = new Set().add(socket.id)
    }

    let listProcessingConversations =
      await model.conversations.listProcessingConversations(orgaId)
    // Step 2 : if none, do nothing
    if (listProcessingConversations?.length === 0) {
      return
    }
    this.io
      .to(orgaId)
      .emit("conversation_processing", listProcessingConversations)

    if (this.memoryMedias[orgaId] === undefined) {
      this.memoryMedias[orgaId] = watchConversation(
        this.io.to(orgaId),
        listProcessingConversations,
      )
    }
  }

  removeSocketFromMedia(orgaId, socket) {
    socket.leave(orgaId)
    if (!this.medias.hasOwnProperty(orgaId)) {
      return
    }

    this.medias[orgaId].delete(socket.id)
    if (this.medias[orgaId].size == 0) {
      delete this.medias[orgaId]

      if (this.memoryMedias[orgaId] === undefined) return
      this.memoryMedias[orgaId].stop()
      delete this.memoryMedias[orgaId]
    }
  }

  async addSocketInOrga(orgaId, socket) {
    socket.join(orgaId)
    if (this.orgas.hasOwnProperty(orgaId)) {
      this.orgas[orgaId].add(socket.id)
    } else {
      this.orgas[orgaId] = new Set().add(socket.id)
      if (this.memorySessions[orgaId] === undefined) {
        try {
          const sessions = await axios.get(
            process.env.SESSION_API_ENDPOINT + `/sessions`,
          )
          sessions.sessions.forEach((session) => {
            if (this.memorySessions[session.id] === undefined) {
              this.memorySessions[session.id] = session.organizationId
            }
          })
        } catch (err) {}
      }
    }
  }

  removeSocketFromOrga(orgaId, socket) {
    socket.leave(orgaId)
    if (!this.orgas.hasOwnProperty(orgaId)) {
      return
    }

    this.orgas[orgaId].delete(socket.id)
    if (this.orgas[orgaId].size == 0) {
      delete this.orgas[orgaId]
    }
  }

  addSocketInRoom(roomId, socket) {
    socket.join(roomId)
    if (this.rooms.hasOwnProperty(roomId)) {
      this.rooms[roomId].add(socket.id)
      this.app.components["BrokerClient"].emit("join_room", roomId)
    } else {
      this.rooms[roomId] = new Set().add(socket.id)
      this.app.components["BrokerClient"].emit("join_room", roomId)
    }
  }

  searchAndRemoveSocketFromRooms(socket) {
    for (const [roomId, socketIds] of Object.entries(this.rooms)) {
      if (socketIds.has(socket.id)) {
        this.removeSocketFromRoom(roomId, socket)
      }
    }

    for (const [orgaId, socketIds] of Object.entries(this.medias)) {
      if (socketIds.has(socket.id)) {
        this.removeSocketFromMedia(orgaId, socket)
      }
    }
  }

  removeSocketFromRoom(roomId, socket) {
    socket.leave(roomId)

    if (!this.rooms.hasOwnProperty(roomId)) {
      this.app.components["BrokerClient"].emit("leave_room", roomId)
      return
    }

    this.rooms[roomId].delete(socket.id)
    if (this.rooms[roomId].size == 0) {
      delete this.rooms[roomId]
      this.app.components["BrokerClient"].emit("leave_room", roomId)
    }
  }

  //broadcasts to connected sockets
  notify(roomId, action, message) {
    if (this.io.sockets.adapter.rooms.has(roomId)) {
      this.io.to(roomId).emit(action, message)
    }
  }

  async notify_sessions(roomId, action, sessions) {
    const differences = diffSessions(this.sessionsCache, sessions)
    const merged = await groupSessionsByOrg(differences, this.memorySessions)
    Object.keys(merged).forEach((orgaId) => {
      //Verify if a websocket connection is establish to the room
      if (this.io.sockets.adapter.rooms.has(orgaId)) {
        this.io.to(orgaId).emit(`orga_${orgaId}_${action}`, merged[orgaId])
      }
    })
    this.sessionsCache = sessions
  }

  async notify_conversation_action(action, orgaId, message) {
    this.io.to(orgaId).emit(`conversation_${action}`, message)

    if (this.medias.hasOwnProperty(orgaId)) {
      if (action === "deleted") {
        try {
          if (this.memoryMedias[orgaId] !== undefined)
            this.memoryMedias[orgaId].remove(message.id)
        } catch (err) {}
      } else {
        let processConv =
          await model.conversations.listProcessingConversations(orgaId)

        this.memoryMedias[orgaId] = refreshInterval(
          this.io.to(orgaId),
          this.memoryMedias[orgaId],
          processConv,
        )
      }
    }
  }

  async notify_sessions_created(orgaId, session) {
    if (session.insertedId === undefined) {
      return
    }
    ;["owner", "sharedWithUsers", "organization"]

    const conversation = await model.conversations.getById(session.insertedId, [
      "_id",
      "name",
      "organization",
      "jobs",
    ])
    this.io.to(orgaId).emit(`conversation_created`, conversation[0])

    if (this.medias.hasOwnProperty(orgaId)) {
      if (
        conversation[0]?.type?.child_conversations?.length >= 1 ||
        conversation[0]?.jobs?.transcription?.state !== "done"
      ) {
        let processConv =
          await model.conversations.listProcessingConversations(orgaId)
        this.memoryMedias[orgaId] = refreshInterval(
          this.io.to(orgaId),
          this.memoryMedias[orgaId],
          processConv,
        )
      }
    }
  }

  brokerOk(message = "Broker connection established") {
    this.io.emit("broker_ok")
    LogManager.logSystemEvent(message)
  }

  brokerKo(notify = false) {
    if (notify) {
      this.io.emit("broker_ko")
      LogManager.logSystemEvent("Broker connection lost")
    }
  }

  /**
   * Broadcast LLM job update to subscribed clients
   * @param {object} update - { organizationId, conversationId, jobId, status, progress, result, error }
   */
  notifyLlmJobUpdate(update) {
    const { organizationId, conversationId, jobId, status } = update
    if (!organizationId || !jobId) {
      debug(`Cannot broadcast LLM update: missing organizationId or jobId`)
      return
    }

    // Determine event name based on status
    let eventName = "llm:job:update"
    if (status === "completed" || status === "complete") {
      eventName = "llm:job:complete"
    } else if (status === "error" || status === "failed") {
      eventName = "llm:job:error"
    }

    // Broadcast to organization room
    const orgRoom = `llm/${organizationId}`
    this.io.to(orgRoom).emit(eventName, update)
    debug(`Broadcasted ${eventName} to room ${orgRoom} for job ${jobId}`)

    // Also broadcast to conversation-specific room if available
    if (conversationId) {
      const convRoom = `llm/${organizationId}/${conversationId}`
      this.io.to(convRoom).emit(eventName, update)
      debug(`Broadcasted ${eventName} to room ${convRoom} for job ${jobId}`)
    }
  }
}

module.exports = (app) => new IoHandler(app)
