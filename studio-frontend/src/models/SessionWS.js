import io from "socket.io-client"
import { customDebug } from "../tools/customDebug"

const socketioUrl = process.env.VUE_APP_SESSION_WS
const socketioPath = process.env.VUE_APP_SESSION_WS_PATH

const debugWS = customDebug("Websocket:Session:debug")

export default class Session {
  constructor() {
    this.isConnected = false
    this.socket = null
    this.currentChannelId = null

    this.test = false
    this.textPartialForTest = ""
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = io(socketioUrl, { path: socketioPath })
      this.socket.on("connect", (msg) => {
        debugWS("connected to socket.io server", msg)
        this.isConnected = true
        resolve()

        this.socket.on("broker_ko", () => {
          debugWS("broker_ko")
        })

        this.socket.on("broker_ok", () => {
          debugWS("broker_ok")
        })
      })
    })
  }

  close() {
    this.socket.close()
    this.isConnected = false
  }

  subscribe(channelId, onPartial, onFinal) {
    return new Promise((resolve, reject) => {
      if (this.currentChannelId) {
        this.socket.emit("leave_room", this.currentChannelId)
      }

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
}
