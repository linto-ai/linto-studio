const debug = require("debug")("linto:components:socketio")
const Component = require(`../component.js`)
const socketIO = require("socket.io")
const axios = require(`${process.cwd()}/lib/utility/axios`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

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

async function registryMetrics(session, socket) {
  model.metrics.startConnection({
    sessionId: session.id,
    socketId: socket.id,
    organizationId: session.organizationId,
  })
}

async function checkSocketAccess(socket, roomId) {
  try {
    const session = await axios.get(
      process.env.SESSION_API_ENDPOINT + `/sessions/${roomId.split("/")[0]}`,
    )

    if (session.visibility === "public") {
      registryMetrics(session, socket)

      return true
    } else {
      const { isAuth, userId } = await auth_middlewares.checkSocket(socket)
      if (isAuth === false) {
        socket.emit("unauthorized")
        socket.disconnect(true)
        return false
      }

      const access = await sessionSocketAccess(session, userId)
      if (access === false) {
        socket.emit("unauthorized")
        socket.disconnect(true)
        return false
      }

      if (
        session.visibility === "organization" ||
        (session.visibility === "private" && session.owner === userId)
      ) {
        registryMetrics(session, socket)
        return true
      } else {
        socket.emit("unauthorized")
        socket.disconnect(true)
        return false
      }
    }
  } catch (err) {
    appLogger.error(
      `Error getting session ${roomId.split("/")[0]} from the session API: ${err}`,
    )
    socket.emit("unauthorized")
    socket.disconnect(true)
    return false
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

    // this.io.use(auth_middlewares.isAuthenticateSocket) // Used initialy to require authentication, disabling annonymous sessions
    this.io.on("connection", (socket) => {
      appLogger.debug(`New client connected : ${socket.id}`)

      if (this.app.components["BrokerClient"].deliveryState !== "ready") {
        socket.emit("broker_ko")
      }

      socket.on("join_room", async (roomId) => {
        if (!(await checkSocketAccess(socket, roomId))) return

        appLogger.debug(`Client ${socket.id} joins room ${roomId}`)
        this.addSocketInRoom(roomId, socket)
      })

      socket.on("leave_room", (roomId) => {
        appLogger.debug(`Client ${socket.id} leaves room ${roomId}`)
        this.removeSocketFromRoom(roomId, socket)
        model.metrics.endConnection(socket.id)
      })

      socket.on("watch_organization_session", (orgaId) => {
        appLogger.debug(
          `Client ${socket.id} joins watcher session of orga ${orgaId}`,
        )
        this.addSocketInOrga(orgaId, socket, "session")
      })

      socket.on("unwatch_organization_session", (orgaId) => {
        appLogger.debug(
          `Client ${socket.id} leaves watcher session of orga ${orgaId}`,
        )
        this.removeSocketFromOrga(orgaId, socket)
        model.metrics.endConnection(socket.id)
      })

      socket.on("watch_organization_media", (orgaId) => {
        appLogger.debug(
          `Client ${socket.id} joins watcher for conversations status ${orgaId}`,
        )
        this.addSocketInMedia(orgaId, socket)
      })

      socket.on("unwatch_organization_media", (orgaId) => {
        appLogger.debug(
          `Client ${socket.id} leaves watcher for conversations status ${orgaId}`,
        )
        this.removeSocketFromMedia(orgaId, socket)
      })

      socket.on("disconnect", () => {
        appLogger.debug(`Client ${socket.id} disconnected`)

        model.metrics.endConnection(socket.id)
        this.searchAndRemoveSocketFromRooms(socket)
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
        } catch (err) {
          appLogger.debug(
            `Error getting organization ID from the orga ${orgaId}: ${err}`,
          )
        }
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
        if (this.memoryMedias[orgaId] !== undefined)
          this.memoryMedias[orgaId].remove(message.id)
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
      appLogger.error(`Conversation ID is undefined`)
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

  brokerOk() {
    this.io.emit("broker_ok")
    appLogger.info("Broker connection established")
  }

  brokerKo(notify = false) {
    if (notify) {
      this.io.emit("broker_ko")
    }
    appLogger.error("Broker connection lost")
  }
}

module.exports = (app) => new IoHandler(app)
