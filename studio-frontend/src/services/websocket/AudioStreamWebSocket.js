import Vue from "vue"
import { customDebug } from "../../tools/customDebug"
import store from "@/store/index.js"
import i18n from "@/i18n"

const debugWS = customDebug("Websocket:AudioStream:debug")

// Bounded exponential backoff: ~1+2+4+8+8 = 23s of waiting across attempts.
const RECONNECT_BASE_DELAY = 1000
const RECONNECT_MAX_DELAY = 8000
const MAX_RECONNECT_ATTEMPTS = 6
// Max wait for the server ack after the socket opens. Without it a socket that
// opens but never acks would leave the connect/reconnect promise pending
// forever, stalling the bounded retry loop.
const ACK_TIMEOUT = 8000

// Websocket to session transcriber to send audio
export default class AudioStreamWebSocket {
  constructor() {
    this.state = Vue.observable({
      isConnected: false,
      receivedACK: false,
      connexionLost: false,
      reconnecting: false,
      // All reconnect attempts exhausted: terminal until an explicit retry.
      // Persistent UI (status chip / recovery banner) is driven by this state,
      // not by notifications.
      gaveUp: false,
    })

    this.socket = null
    this.channel = null
    this.currentConfig = null
    // Tells apart a close() we triggered (stop recording, channel change)
    // from a network drop, so we only reconnect/notify on the latter.
    this.intentionalClose = false
    // Only a connection that once reached ACK is worth reconnecting; an
    // initial connect failure is propagated to the caller instead.
    this.hadSuccessfulConnection = false
    this.reconnectAttempts = 0
    this.reconnectTimer = null
  }

  // Transition toast only — persistent states live in the status UI.
  notifyRestored() {
    store.dispatch("system/addNotification", {
      message: i18n.t("websocket.restored"),
      type: "success",
    })
  }

  // Entry point from the socket onerror/onclose handlers.
  handleConnexionLost() {
    if (this.intentionalClose) {
      return
    }
    // A reconnection loop is already running: this is just a failed attempt,
    // its own promise rejection drives the retry.
    if (this.state.reconnecting) {
      return
    }

    this.state.connexionLost = true

    if (this.hadSuccessfulConnection) {
      this.scheduleReconnect()
    }
    // Initial connection never succeeded: the rejected connect promise is
    // classified by the caller (setupRecording / retryAudioConnection).
  }

  scheduleReconnect() {
    this.state.reconnecting = true
    this.state.gaveUp = false
    this.reconnectAttempts = 0
    this.tryReconnect()
  }

  tryReconnect() {
    if (this.intentionalClose) {
      return
    }
    this.reconnectAttempts++
    debugWS(
      `reconnect attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`,
    )

    this.connectWithConfig(this.currentConfig)
      .then(() => this.handleReconnected())
      .catch(() => {
        if (this.intentionalClose || !this.state.reconnecting) {
          return
        }
        if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          this.handleReconnectFailed()
          return
        }
        const delay = Math.min(
          RECONNECT_BASE_DELAY * 2 ** (this.reconnectAttempts - 1),
          RECONNECT_MAX_DELAY,
        )
        this.reconnectTimer = setTimeout(() => this.tryReconnect(), delay)
      })
  }

  handleReconnected() {
    debugWS("reconnected")
    this.state.reconnecting = false
    this.state.connexionLost = false
    this.reconnectAttempts = 0
    this.notifyRestored()
  }

  handleReconnectFailed() {
    debugWS("reconnection failed, giving up")
    this.state.reconnecting = false
    this.state.gaveUp = true
    this.hadSuccessfulConnection = false
  }

  async changeChannel(channel, newConfig) {
    this.channel = channel

    // Always tear down first: this also cancels an in-flight reconnection loop
    // (which runs while isConnected is false), avoiding a zombie loop.
    this.close()

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

    // Drop any lingering socket (e.g. one left open after an invalid ack)
    // before opening a new one. Detach handlers first so its close does not
    // re-enter the reconnection logic.
    this.discardSocket()

    this.intentionalClose = false
    // While reconnecting we keep connexionLost state across attempts.
    if (!this.state.reconnecting) {
      this.state.connexionLost = false
      this.state.gaveUp = false
      this.hadSuccessfulConnection = false
    }

    return new Promise((resolve, reject) => {
      const url = this.channel?.streamEndpoints?.ws
      if (!url) {
        debugWS("No valid websocket url")
        reject("No websocket url")
        return
      }
      const socket = new WebSocket(url)
      this.socket = socket
      socket.onopen = () => {
        // Ignore events from a socket that is no longer the current one.
        if (socket !== this.socket) return
        debugWS("connected to websocket server")
        this.state.isConnected = true
        resolve()
      }
      socket.onerror = (event) => {
        if (socket !== this.socket) return
        debugWS("websocket error", event)
        this.state.isConnected = false
        this.handleConnexionLost()
        // No-op if the connection promise already resolved.
        reject("websocket error")
      }
      socket.onclose = () => {
        if (socket !== this.socket) return
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
          const socket = this.socket
          socket.send(JSON.stringify(config))

          const ackTimer = setTimeout(() => {
            debugWS("ack timeout")
            socket.close()
            reject("ack timeout")
          }, ACK_TIMEOUT)

          socket.onmessage = (event) => {
            // Ignore messages from a socket that is no longer the current one.
            if (socket !== this.socket) return
            const msg = JSON.parse(event.data)
            if (msg.type === "ack") {
              clearTimeout(ackTimer)
              // Handshake done: stop handling messages so a later non-ack
              // message can't close this (upstream-only) socket.
              socket.onmessage = null
              debugWS("ack received")
              this.state.receivedACK = true
              this.hadSuccessfulConnection = true
              resolve()
            } else {
              clearTimeout(ackTimer)
              debugWS("ack not received", msg)
              socket.close()
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

  // Detach handlers and close any current socket without re-triggering the
  // connexion-lost logic.
  discardSocket() {
    if (!this.socket) {
      return
    }
    this.socket.onopen = null
    this.socket.onerror = null
    this.socket.onclose = null
    this.socket.onmessage = null
    this.socket.close()
    this.socket = null
  }

  send(data) {
    if (this.state.receivedACK) {
      this.socket.send(data)
    } else {
      debugWS("trying to send data without connection to websocket server")
    }
  }

  close() {
    this.intentionalClose = true
    this.state.reconnecting = false
    this.state.gaveUp = false
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.socket) {
      this.socket.close()
    }
    this.state.isConnected = false
    this.state.receivedACK = false
    this.state.connexionLost = false
  }
}
