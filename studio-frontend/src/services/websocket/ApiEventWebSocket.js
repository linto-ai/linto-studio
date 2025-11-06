import io from "socket.io-client"
import Vue from "vue"
import { customDebug } from "@/tools/customDebug"
import { bus } from "@/main"
import { getCookie } from "@/tools/getCookie"
import { getEnv } from "@/tools/getEnv"
import store from "@/store/index.js"

const socketioUrl = process.env.VUE_APP_SESSION_WS
const socketioPath = process.env.VUE_APP_SESSION_WS_PATH

const debugWSSession = customDebug("Websocket:Session:debug")
const debugWSMedia = customDebug("Websocket:Media:debug")
export default class ApiEventWebSocket {
  constructor() {
    this.state = Vue.observable({
      isConnected: false,
      isConnectedToSessionBroker: false,
    })

    this.socket = null
    this.currentChannelId = null
    this.currentSessionOrganizationId = null
    this.test = false
    this.textPartialForTest = ""
    this.retryAfterKO = 0
  }

  connect() {
    return new Promise((resolve, reject) => {
      const userToken = getCookie("authToken")
      const transports = getEnv("VUE_APP_WEBSOCKET_TRANSPORTS").split(",")
      this.socket = io(socketioUrl, {
        path: socketioPath,
        auth: {
          token: userToken,
        },
        transports: transports,
      })
      this.socket.on("connect", (msg) => {
        debugWSSession("connected to socket.io server", msg)
        this.state.isConnected = true
        resolve()

        this.socket.on("broker_ko", () => {
          this.isConnectedToSessionBroker = false
          debugWSSession("broker_ko")
        })

        this.socket.on("broker_ok", () => {
          debugWSSession("broker_ok")
          this.isConnectedToSessionBroker = true
        })
      })
    })
  }

  close() {
    this.socket.close()
    this.state.isConnected = false
  }

  subscribeSessionRoom(sessionId, channelIndex, onPartial, onFinal) {
    // TODO: rewrite by emitting event via bus
    return new Promise((resolve, reject) => {
      this.unSubscribeSessionRoom()

      const channelId = `${sessionId}/${channelIndex}`

      this.socket.off("partial")
      this.socket.off("final")

      this.socket.on("partial", onPartial)
      this.socket.on("final", onFinal)

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
      store.dispatch(
        `${this.currentMediaOrganizationId}/processing/conversations/updateMedia`,
        {
          mediaId: mediaId,
          media: { jobs: { transcription: { state: "done" } } },
          patch: true,
        },
      )
      store.dispatch(
        `${this.currentMediaOrganizationId}/done/conversations/increaseCount`,
      )

      store.dispatch(
        `${this.currentMediaOrganizationId}/done/conversations/prependMedias`,
        [
          store.getters[
            `${this.currentMediaOrganizationId}/processing/conversations/getMediaById`
          ](mediaId),
        ],
      )

      store.dispatch(
        `${this.currentMediaOrganizationId}/processing/conversations/decreaseCount`,
      )
    })

    this.socket.on("conversation_processing_error", (mediaId) => {
      debugWSMedia("conversation_processing_error", mediaId)
      store.dispatch(
        `${this.currentMediaOrganizationId}/processing/conversations/updateMedia`,
        {
          mediaId: mediaId,
          media: { jobs: { transcription: { state: "error" } } },
          patch: true,
        },
      )
      store.dispatch(
        `${this.currentMediaOrganizationId}/error/conversations/increaseCount`,
      )
      store.dispatch(
        `${this.currentMediaOrganizationId}/processing/conversations/decreaseCount`,
      )
    })
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
