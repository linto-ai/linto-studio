import io from "socket.io-client"
import Vue from "vue"
import { customDebug } from "@/tools/customDebug"
import { bus } from "@/main"
import { getCookie } from "@/tools/getCookie"
import { getEnv } from "@/tools/getEnv"
import store from "@/store/index.js"

const socketioUrl = process.env.VUE_APP_SESSION_WS
const socketioPath = process.env.VUE_APP_SESSION_WS_PATH

const debugWS = customDebug("Websocket:Session:debug")

export default class ApiEventWebSocket {
  constructor() {
    this.state = Vue.observable({
      isConnected: false,
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
        debugWS("connected to socket.io server", msg)
        this.state.isConnected = true
        resolve()

        this.socket.on("broker_ko", () => {
          debugWS("broker_ko")
          this.retryAfterKO += 1
          if (this.retryAfterKO > 5) {
            this.close()
            this.retryAfterKO = 0
          }
        })

        this.socket.on("broker_ok", () => {
          debugWS("broker_ok")
          this.retryAfterKO = 0
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
      debugWS("subscribed to channel", channelId)
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
    this.unSubscribeMediaUdate()
    this.currentMediaOrganizationId = organizationId
    this.socket.emit("watch_organization_media", organizationId)
    // conversation_processing_done
    // conversation_processing
  }
  unSubscribeMediaUdate() {
    if (this.currentMediaOrganizationId) {
      this.socket.emit(
        "unwatch_organization_media",
        this.currentMediaOrganizationId,
      )
    }
  }
}
