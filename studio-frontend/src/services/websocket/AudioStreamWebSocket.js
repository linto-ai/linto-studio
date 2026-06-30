import Vue from "vue"
import { customDebug } from "../../tools/customDebug"
import store from "@/store/index.js"
import i18n from "@/i18n"

const debugWS = customDebug("Websocket:AudioStream:debug")

// Websocket to session transcriber to send audio
export default class AudioStreamWebSocket {
  constructor() {
    this.state = Vue.observable({
      isConnected: false,
      receivedACK: false,
      connexionLost: false,
    })

    this.socket = null
    this.channel = null
    this.currentConfig = null
    // Tells apart a close() we triggered (stop recording, channel change)
    // from a network drop, so we only notify on the latter.
    this.intentionalClose = false
  }

  clearNotifs() {
    store.dispatch("system/removeNotificationById", "websocket-error")
  }

  handleConnexionLost() {
    if (this.intentionalClose) {
      return
    }
    this.state.connexionLost = true
    this.clearNotifs()
    store.dispatch("system/addNotification", {
      id: "websocket-error",
      message: i18n.t("websocket.audio_stream_lost"),
      timeout: 0,
      type: "error",
    })
  }

  async changeChannel(channel, newConfig) {
    this.channel = channel

    if (this.state.isConnected) {
      this.close()
    }

    let config = this.currentConfig
    if (newConfig) {
      config = newConfig
    }

    if (config) {
      return await this.connectWithConfig(config)
    } else {
      await this.connect()

      return
    }
  }

  connect() {
    if (this.channel === null) {
      console.error("Try to connect to websocket without channel")
      return
    }

    this.intentionalClose = false
    this.state.connexionLost = false
    this.clearNotifs()

    return new Promise((resolve, reject) => {
      const url = this.channel?.streamEndpoints?.ws
      if (!url) {
        debugWS("No valid websocket url")
        reject("No websocket url")
        return
      }
      this.socket = new WebSocket(url)
      this.socket.onopen = () => {
        debugWS("connected to websocket server")
        this.state.isConnected = true
        resolve()
      }
      this.socket.onerror = (event) => {
        debugWS("websocket error", event)
        this.state.isConnected = false
        this.handleConnexionLost()
        // No-op if the connection promise already resolved.
        reject("websocket error")
      }
      this.socket.onclose = () => {
        debugWS("websocket closed")
        this.state.isConnected = false
        this.state.receivedACK = false
        this.handleConnexionLost()
        reject("websocket closed")
      }
    })
  }

  connectWithConfig(config) {
    this.currentConfig = config
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => {
          this.socket.send(JSON.stringify(config))
          this.socket.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            if (msg.type === "ack") {
              debugWS("ack received")
              this.state.receivedACK = true
              resolve()
            } else {
              debugWS("ack not received", msg)
              reject("ack not received")
            }
          }
        })
        .catch((err) => {
          debugWS("Error connecting to websocket server", err)
          reject(err)
        })
    })
  }

  send(data) {
    if (this.state.isConnected) {
      this.socket.send(data)
    } else {
      debugWS("trying to send data without connection to websocket server")
    }
  }

  close() {
    this.intentionalClose = true
    this.clearNotifs()
    if (this.socket) {
      this.socket.close()
    }
    this.state.isConnected = false
    this.state.receivedACK = false
    this.state.connexionLost = false
  }
}
