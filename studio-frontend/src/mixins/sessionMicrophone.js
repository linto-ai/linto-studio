import AudioStreamWebSocket from "@/services/websocket/AudioStreamWebSocket.js"
import { customDebug } from "@/tools/customDebug.js"
import { microphoneMixin } from "@/mixins/microphone.js"
import store from "@/store/index.js"
import i18n from "@/i18n"
import { watch } from "vue"

const EVENT_TO_LISTEN = "downSamplerFrame"
// The downsampler emits a frame every ~256ms as long as the PROCESSING graph
// (AudioContext + ScriptProcessor + worker) is alive — even a dead or muted
// track produces silent frames. Missing frames therefore mean a dead
// pipeline; capture health is tracked separately via MediaStreamTrack events.
const FRAME_WATCHDOG_INTERVAL = 2000
const FRAME_WATCHDOG_TIMEOUT = 3000

export const sessionMicrophoneMixin = {
  mixins: [microphoneMixin],
  data() {
    return {
      channelAudioWebsocket: new AudioStreamWebSocket(), // websocket to send audio data
      // User intent: "the microphone should be recording". The ONLY thing
      // pause/resume controls write. Whether audio actually flows is the
      // derived isRecording below.
      wantsRecording: false,
      // True once setupRecording has been called: gates the status UI.
      microphoneStarted: false,
      // Mic dead: track ended, acquisition failed, or frame watchdog fired.
      // Sticky by design — no self-heal, no permission guessing: only going
      // through the setup modal again (setupRecording) clears it.
      microphoneLost: false,
      // Transient system interruption (track muted): auto-resolves on unmute.
      microphoneInterrupted: false,
      // Audio websocket could not be (re)established during setup or retry.
      // The reconnect-loop give-up lives in channelAudioWebsocket.state.gaveUp.
      audioConnectionDead: false,
      debugSessionMicrophone: customDebug("vue:debug:sessionMicrophone"),
    }
  },
  computed: {
    // Effective recording state: intent AND a handshaked audio websocket AND
    // a live microphone. Drops to false during reconnection (honest UI) and
    // comes back by itself once the server acks again — no manual resume.
    isRecording() {
      return (
        this.wantsRecording &&
        this.channelAudioWebsocket.state.receivedACK &&
        !this.microphoneLost
      )
    },
    // Single source for every status surface (chip, banner, stage).
    // Order: broken states first, then transient, then intent.
    microphoneStatus() {
      if (!this.microphoneStarted) return "idle"
      if (this.microphoneLost) return "mic_lost"
      if (this.audioConnectionDead || this.channelAudioWebsocket.state.gaveUp)
        return "connection_lost"
      if (this.channelAudioWebsocket.state.reconnecting) return "reconnecting"
      if (this.microphoneInterrupted) return "mic_interrupted"
      if (!this.wantsRecording) return "muted"
      if (!this.channelAudioWebsocket.state.receivedACK) return "connecting"
      return "recording"
    },
  },
  methods: {
    onClose() {
      this.debugSessionMicrophone("Closing microphone")
      if (this.channelAudioWebsocket?.close) {
        this.channelAudioWebsocket.close()
      }

      if (this.downSampler) {
        this.downSampler.removeEventListener(
          EVENT_TO_LISTEN,
          this.onAudioFrameRaw,
        )
      }

      this.p_stopFrameWatchdog()
      window.removeEventListener("beforeunload", this.onbeforeunload)
    },
    onMicrophoneLost(reason) {
      this.debugSessionMicrophone(`microphone track lost (${reason})`)
      if (reason === "ended") {
        // Terminal: the track will never produce audio again. Intent is
        // preserved (wantsRecording untouched) so recording resumes after
        // the user reconfigures the microphone.
        this.microphoneLost = true
      } else {
        // "mute": transient system interruption. A muted track produces
        // silence so the VAD already gates every frame; audio resumes by
        // itself on unmute.
        this.microphoneInterrupted = true
      }
    },
    onMicrophoneRestored() {
      this.debugSessionMicrophone("microphone track restored")
      this.microphoneInterrupted = false
      store.dispatch("system/addNotification", {
        message: i18n.t("microphone_status.restored_toast"),
        type: "success",
      })
    },
    onbeforeunload(event) {
      event.preventDefault()
      event.returnValue = ""
    },
    async setupRecording(channel) {
      this.debugSessionMicrophone("Start recording")
      this.p_closed = false // re-arm: a previous failed attempt ran p_close()
      this.microphoneStarted = true
      this.microphoneLost = false
      this.microphoneInterrupted = false
      this.audioConnectionDead = false
      // Keep both the id (to re-resolve a FRESH channel from the session on
      // retry — streamEndpoints can rotate) and the object (fallback).
      this.p_recordingChannelId = channel?.id ?? null
      this.p_recordingChannel = channel
      this.p_stopFrameWatchdog()
      window.addEventListener("beforeunload", this.onbeforeunload)
      let microphoneReady = false
      try {
        await this.connectToMicrophone(this.deviceId)
        microphoneReady = true
        await this.connectToChannelAudioWebsocket(channel)
        this.debugSessionMicrophone("Connected to websocket")
        if (this.p_closed) {
          throw new Error("recording setup aborted: component destroyed")
        }
        this.setupRecordRaw()
      } catch (error) {
        const destroyedDuringSetup = this.p_closed
        console.error("Error while setting up recording", error)
        this.p_close()
        if (!destroyedDuringSetup) {
          // Classify for the status UI: mic acquisition vs audio websocket.
          if (microphoneReady) {
            this.audioConnectionDead = true
          } else {
            this.microphoneLost = true
          }
        }
      }
    },
    // Recovery action for the "connection_lost" status. Re-resolves the
    // channel from the current session state: the captured object may hold
    // stale streamEndpoints (e.g. transcriber redeployed).
    async retryAudioConnection() {
      const freshChannel =
        this.session?.channels?.find(
          (c) => c.id === this.p_recordingChannelId,
        ) || this.p_recordingChannel
      if (!freshChannel) {
        return
      }
      if (this.mic?.hookedOn) {
        // Mic pipeline is alive: only the websocket needs to come back.
        this.audioConnectionDead = false
        try {
          await this.connectToChannelAudioWebsocket(freshChannel)
          this.debugSessionMicrophone("audio connection retried successfully")
        } catch (error) {
          console.error("Error while retrying audio connection", error)
          this.audioConnectionDead = true
        }
      } else {
        // Setup failed early: the whole pipeline needs to restart.
        await this.setupRecording(freshChannel)
      }
    },
    async connectToChannelAudioWebsocket(channel) {
      const initMessage = {
        type: "init",
        sampleRate: 16000,
        encoding: "pcm", // Spécifie que les données sont en PCM brut
      }

      await this.channelAudioWebsocket.changeChannel(channel, initMessage)
    },
    async setupRecordRaw() {
      this.debugSessionMicrophone("Starting downsampler")
      await this.downSampler.start(this.mic)
      this.downSampler.addEventListener(EVENT_TO_LISTEN, this.onAudioFrameRaw)
      this.wantsRecording = true
      this.p_startFrameWatchdog()
    },
    onAudioFrameRaw(event) {
      this.p_lastFrameAt = Date.now()
      if (this.vad.speaking && this.isRecording) {
        this.channelAudioWebsocket.send(event.detail)
      }
    },
    p_startFrameWatchdog() {
      this.p_lastFrameAt = Date.now()
      if (!this.p_frameWatchdog) {
        this.p_frameWatchdog = setInterval(
          this.p_checkFramesFlowing,
          FRAME_WATCHDOG_INTERVAL,
        )
      }
    },
    p_stopFrameWatchdog() {
      if (this.p_frameWatchdog) {
        clearInterval(this.p_frameWatchdog)
        this.p_frameWatchdog = null
      }
    },
    p_checkFramesFlowing() {
      if (document.hidden) {
        // Background tabs throttle the whole pipeline together: skip the
        // check and re-arm so returning to the tab gets a grace period.
        this.p_lastFrameAt = Date.now()
        return
      }
      if (
        !this.microphoneLost &&
        Date.now() - this.p_lastFrameAt > FRAME_WATCHDOG_TIMEOUT
      ) {
        // Covers every silent death the track events cannot see: dead
        // downsampler worker, dead VAD wasm, suspended AudioContext.
        this.debugSessionMicrophone("no audio frame for 3s, pipeline dead")
        this.microphoneLost = true
      }
    },
    pauseMicrophone() {
      this.wantsRecording = false
    },
    startMicrophone() {
      this.wantsRecording = true
    },
  },
  watch: {
    microphoneStatus(newVal) {
      console.log("micro status", newVal)
    },
    microphoneLost(newVal) {
      console.log("micro status", newVal)
    },
  },
}
