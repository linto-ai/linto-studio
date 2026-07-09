import io from "socket.io-client"
import Vue from "vue"
import { customDebug } from "@/tools/customDebug"
import { bus } from "@/main"
import { getCookie } from "@/tools/getCookie"
import { getEnv } from "@/tools/getEnv"
import store from "@/store/index.js"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"
import { generateId } from "@/tools/generateId"

const socketioUrl = getEnv("VUE_APP_SESSION_WS")
const socketioPath = getEnv("VUE_APP_SESSION_WS_PATH")

// After this many failed attempts socket.io gives up: status becomes
// "failed" and the user has to trigger retry() manually (status dot/banner).
const RECONNECTION_ATTEMPTS = 10

export const WEBSOCKET_STATUS = Object.freeze({
  IDLE: "idle",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  RECONNECTING: "reconnecting",
  FAILED: "failed",
})

const VISITOR_ID_KEY = "linto_visitor_id"
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_ID_KEY)
  if (!id) {
    id = generateId()
    localStorage.setItem(VISITOR_ID_KEY, id)
  }
  return id
}

const debugWSSession = customDebug("Websocket:Session:debug")
const debugWSMedia = customDebug("Websocket:Media:debug")
export default class ApiEventWebSocket {
  constructor() {
    this.state = Vue.observable({
      status: WEBSOCKET_STATUS.IDLE,
      // Derived from status, kept as a plain flag because many components
      // watch it ("websocketInstance.state.isConnected").
      isConnected: false,
    })

    this.socket = null
    this.currentChannelId = null
    this.currentSessionOrganizationId = null
    this.test = false
    this.textPartialForTest = ""
    this.currentToken = null
    // Stable references so removeEventListener actually removes them.
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    this.handleNetworkOnline = this.handleNetworkOnline.bind(this)
  }

  setStatus(status) {
    this.state.status = status
    this.state.isConnected = status === WEBSOCKET_STATUS.CONNECTED
  }

  connect(token, { isPublic = false } = {}) {
    if (this.state.isConnected) {
      debugWSSession("already connected to socket.io server")
      return Promise.resolve()
    }

    const userToken = token ?? this.currentToken ?? getCookie("authToken")
    this.currentToken = userToken
    this.setStatus(WEBSOCKET_STATUS.CONNECTING)

    return new Promise((resolve) => {
      const transports = getEnv("VUE_APP_WEBSOCKET_TRANSPORTS").split(",")
      const auth = { token: userToken }
      if (isPublic) auth.visitorId = getVisitorId()

      this.socket = io(socketioUrl, {
        path: socketioPath,
        auth,
        transports: transports,
        reconnectionAttempts: RECONNECTION_ATTEMPTS,
      })

      this.socket.on("connect", (msg) => {
        debugWSSession("connected to socket.io server", msg)
        this.setStatus(WEBSOCKET_STATUS.CONNECTED)
        this.subscribeFolderUpdate()

        resolve()
      })

      this.socket.on("disconnect", (reason) => {
        this.handleDisconnection(reason)
      })

      this.socket.on("connect_error", (error) => {
        debugWSSession("connection error to socket.io server", error)
        // Handshake rejected by the server middleware (e.g. expired or
        // invalid token): socket.io destroys the namespace socket and will
        // never retry on its own (socket.active becomes false), so without
        // this the status would stay "connecting" forever with no indicator.
        // Network-level errors keep socket.active === true and are handled
        // by the manager reconnection cycle (reconnect_attempt/failed).
        if (!this.socket.active) {
          this.setStatus(WEBSOCKET_STATUS.FAILED)
        }
      })

      // Manager-level events drive the reconnection state machine: they
      // fire for both the initial connection and post-disconnect retries.
      this.socket.io.on("reconnect_attempt", () => {
        this.setStatus(WEBSOCKET_STATUS.RECONNECTING)
      })

      this.socket.io.on("reconnect_failed", () => {
        debugWSSession("reconnection failed, giving up")
        this.setStatus(WEBSOCKET_STATUS.FAILED)
      })

      document.removeEventListener(
        "visibilitychange",
        this.handleVisibilityChange,
      )
      document.addEventListener("visibilitychange", this.handleVisibilityChange)

      window.removeEventListener("online", this.handleNetworkOnline)
      window.addEventListener("online", this.handleNetworkOnline)
    })
  }

  handleVisibilityChange() {
    if (document.visibilityState !== "visible") return

    // The reconnection budget was exhausted while the tab was hidden:
    // coming back to the tab is the natural moment to try again.
    if (this.state.status === WEBSOCKET_STATUS.FAILED) {
      this.retry()
      return
    }

    // Silent death: the socket dropped while the tab was hidden and the
    // "disconnect" event was never processed (throttled/suspended tab).
    if (this.state.isConnected && !this.socket.connected) {
      this.handleDisconnection()
    }
  }

  handleNetworkOnline() {
    if (this.state.status === WEBSOCKET_STATUS.FAILED) {
      this.retry()
    }
  }

  handleDisconnection(reason) {
    debugWSSession("disconnected from socket.io server, reason:", reason)

    if (reason === "io client disconnect") {
      // Deliberate close() on our side: do not resurrect the socket.
      this.setStatus(WEBSOCKET_STATUS.IDLE)
      return
    }

    this.setStatus(WEBSOCKET_STATUS.RECONNECTING)

    // NOTE: on "io server disconnect" (server called socket.disconnect(),
    // e.g. a rolling restart) socket.io does NOT auto-reconnect, so the
    // manual connect() below is the only recovery path — do not early-return
    // here or the socket dies silently forever.
    setTimeout(() => {
      if (!this.socket.connected) {
        this.socket.connect()
      }
    }, 1000)
  }

  // Manual reconnection, triggered by the user once the status is "failed"
  // (the automatic cycle gave up after RECONNECTION_ATTEMPTS).
  retry() {
    if (!this.socket) return
    this.setStatus(WEBSOCKET_STATUS.RECONNECTING)
    this.socket.connect()
  }

  close() {
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    )
    window.removeEventListener("online", this.handleNetworkOnline)
    this.socket.close()
    this.setStatus(WEBSOCKET_STATUS.IDLE)
  }

  subscribeSessionRoom(
    sessionId,
    channelIndex,
    onPartial,
    onFinal,
    onTranslation,
  ) {
    // TODO: rewrite by emitting event via bus
    return new Promise((resolve, reject) => {
      this.unSubscribeSessionRoom()

      const channelId = `${sessionId}/${channelIndex}`

      this.socket.off("partial")
      this.socket.off("final")
      this.socket.off("translation")

      this.socket.on("partial", onPartial)
      this.socket.on("final", onFinal)
      if (onTranslation) {
        this.socket.on("translation", onTranslation)
      }

      this.socket.emit("join_room", channelId)
      debugWSSession("subscribed to channel", channelId)
      this.currentChannelId = channelId

      // if test mode, send a test message onPartial every 3 seconds
      if (this.test) {
        setInterval(() => {
          this.textPartialForTest = this.textPartialForTest + " test message"
          onPartial(this.textPartialForTest)
        }, 3000)
      }

      resolve()
    })
  }

  unSubscribeSessionRoom() {
    if (this.currentChannelId) {
      this.socket.emit("leave_room", this.currentChannelId)
    }
    this.socket.off("partial")
    this.socket.off("final")
    this.socket.off("translation")
  }

  subscribeSessionsUpdate(organizationId) {
    this.unSubscribeSessionsUpdate()
    this.currentSessionOrganizationId = organizationId
    this.socket.emit("watch_organization_session", organizationId)
    // TODO: generalize every this.socket.on(event_name) to bus.$emit(`websocket/${event_name}`)
    this.socket.on(`orga_${organizationId}_session_update`, (value) => {
      store.dispatch("sessions/updateSession", value)
      bus.$emit(`websocket/orga_${organizationId}_session_update`, value)
    })

    this.socket.on(`orga_${organizationId}_session_cleared`, (value) => {
      bus.$emit(`websocket/orga_${organizationId}_session_cleared`, value)
    })
  }

  unSubscribeSessionsUpdate() {
    if (this.currentSessionOrganizationId) {
      this.socket.emit(
        "unwatch_organization_session",
        this.currentSessionOrganizationId,
      )
      this.socket.off(
        `orga_${this.currentSessionOrganizationId}_session_update`,
      )
      this.socket.off(
        `orga_${this.currentSessionOrganizationId}_session_cleared`,
      )
    }
  }

  subscribeMediaUpdate(organizationId) {
    if (!this.socket) return
    this.unSubscribeMediaUdate()
    this.currentMediaOrganizationId = organizationId
    this.socket.emit("watch_organization_media", organizationId)

    this.socket.on("conversation_deleted", ({ id: mediaId, status }) => {
      const statusFormatted =
        status === "done" || status === "error" ? status : "processing"

      store.dispatch(
        `${this.currentMediaOrganizationId}/${statusFormatted}/conversations/deleteMedias`,
        { ids: [mediaId], callApi: false },
      )
      store.dispatch(
        `${this.currentMediaOrganizationId}/${statusFormatted}/conversations/decreaseCount`,
      )
    })

    this.socket.on("conversation_created", (media) => {
      debugWSMedia("conversation_created", media)
      if (media.jobs?.transcription?.state === "done") {
        store.dispatch(
          `${this.currentMediaOrganizationId}/done/conversations/prependMedias`,
          [media],
        )
        store.dispatch(
          `${this.currentMediaOrganizationId}/done/conversations/increaseCount`,
        )
        return
      }
      store.dispatch(
        `${this.currentMediaOrganizationId}/processing/conversations/prependMedias`,
        [media],
      )
      store.dispatch(
        `${this.currentMediaOrganizationId}/processing/conversations/increaseCount`,
      )
    })

    this.socket.on("conversation_processing", (value) => {
      for (const media of value) {
        debugWSMedia(
          "Updating media job",
          structuredClone(media?.jobs?.transcription),
        )
        store.dispatch(
          `${this.currentMediaOrganizationId}/processing/conversations/updateMedia`,
          { mediaId: media._id, media: { jobs: media.jobs }, patch: true },
        )
      }
    })

    this.socket.on("conversation_processing_done", (mediaId) => {
      debugWSMedia("conversation_processing_done", mediaId)

      const processingMedia =
        store.getters[
          `${this.currentMediaOrganizationId}/processing/conversations/getMediaById`
        ](mediaId)

      // Remove from processing store
      if (processingMedia) {
        store.dispatch(
          `${this.currentMediaOrganizationId}/processing/conversations/deleteMedias`,
          { ids: [mediaId], callApi: false },
        )
      }
      store.dispatch(
        `${this.currentMediaOrganizationId}/processing/conversations/decreaseCount`,
      )

      // Add to done store (inbox)
      store.dispatch(
        `${this.currentMediaOrganizationId}/done/conversations/prependMedias`,
        [
          processingMedia
            ? { ...processingMedia, jobs: { transcription: { state: "done" } } }
            : mediaId,
        ],
      )
      store.dispatch(
        `${this.currentMediaOrganizationId}/done/conversations/increaseCount`,
      )
    })

    this.socket.on("conversation_processing_error", (mediaId) => {
      debugWSMedia("conversation_processing_error", mediaId)

      const processingMedia =
        store.getters[
          `${this.currentMediaOrganizationId}/processing/conversations/getMediaById`
        ](mediaId)

      // Remove from processing store
      if (processingMedia) {
        store.dispatch(
          `${this.currentMediaOrganizationId}/processing/conversations/deleteMedias`,
          { ids: [mediaId], callApi: false },
        )
      }
      store.dispatch(
        `${this.currentMediaOrganizationId}/processing/conversations/decreaseCount`,
      )

      store.dispatch(
        `${this.currentMediaOrganizationId}/error/conversations/increaseCount`,
      )
    })
  }

  subscribeFolderUpdate(organizationId) {
    if (!this.socket) return
    this.unSubscribeFolderUpdate()

    this.socket.on("folder_created", (folder) => {
      if (!this._canAccessFolder(folder)) return
      const existing = store.getters["folders/getFolderById"](folder._id)
      if (existing) return
      store.commit("folders/addFolder", { ...folder, conversationCount: 0 })
    })

    this.socket.on("folder_updated", (folder) => {
      const existing = store.getters["folders/getFolderById"](folder._id)
      if (this._canAccessFolder(folder)) {
        if (existing) {
          store.commit("folders/updateFolder", folder)
        } else {
          store.commit("folders/addFolder", { ...folder, conversationCount: 0 })
        }
      } else if (existing) {
        store.commit("folders/removeFolder", folder._id)
      }
    })

    this.socket.on("folder_deleted", ({ _id }) => {
      store.commit("folders/removeFolder", _id)
    })

    this.socket.on("folders_refresh", () => {
      store.dispatch("folders/fetchFolders")
    })

    this.socket.on("conversation_folder_changed", (payload) => {
      bus.$emit("conversation_folder_changed", payload)
    })
  }

  unSubscribeFolderUpdate() {
    if (!this.socket) return
    this.socket.off("folder_created")
    this.socket.off("folder_updated")
    this.socket.off("folder_deleted")
    this.socket.off("folders_refresh")
    this.socket.off("conversation_folder_changed")
  }

  _canAccessFolder(folder) {
    if (folder.visibility !== "private") return true
    const userId = store.getters["user/getUserId"]
    const userRole = store.getters["organizations/getUserRoleInOrganization"]
    if (userRole >= ORGANIZATION_ROLES.MAINTAINER) return true
    if (folder.owner === userId) return true
    return (folder.members || []).some((m) => m.userId === userId)
  }

  unSubscribeMediaUdate() {
    if (!this.socket) return
    if (this.currentMediaOrganizationId) {
      this.socket.emit(
        "unwatch_organization_media",
        this.currentMediaOrganizationId,
      )
    }

    this.socket.off("conversation_deleted")
    this.socket.off("conversation_created")
    this.socket.off("conversation_processing_error")
    this.socket.off("conversation_processing_done")
    this.socket.off("conversation_processing")
  }
}
