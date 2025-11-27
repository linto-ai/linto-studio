import AudioStreamWebSocket from "@/services/websocket/AudioStreamWebSocket.js"
import { customDebug } from "@/tools/customDebug.js"

const EVENT_TO_LISTEN = "downSamplerFrame"

export const sessionMicrophoneMixin = {
  data() {
    return {
      channelAudioWebsocket: new AudioStreamWebSocket(), // websocket to send audio data
      isRecording: false,
      debugSessionMicrophone: customDebug("vue:debug:sessionMicrophone"),
    }
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

      window.removeEventListener("beforeunload", this.onbeforeunload)
    },
    onbeforeunload(event) {
      event.preventDefault()
      event.returnValue = ""
    },
    async setupRecording(channel) {
      this.debugSessionMicrophone("Start recording")
      window.addEventListener("beforeunload", this.onbeforeunload)
      await this.connectToMicrophone(this.deviceId)
      try {
        await this.connectToChannelAudioWebsocket(channel)
        this.debugSessionMicrophone("Connected to websocket")
        this.setupRecordRaw()
      } catch (error) {
        console.error("Error while connecting to websocket", error)
      }
    },
    async connectToChannelAudioWebsocket(channel) {
      const initMessage = {
        type: "init",
        sampleRate: 16000,
        encoding: "pcm", // Spécifie que les données sont en PCM brut
      }

      await this.channelAudioWebsocket.changeChannel(channel, initMessage)
      console.log("l4")
    },
    async setupRecordRaw() {
      this.debugSessionMicrophone("Starting downsampler")
      await this.downSampler.start(this.mic)
      this.downSampler.addEventListener(EVENT_TO_LISTEN, this.onAudioFrameRaw)
      this.isRecording = true
    },
    onAudioFrameRaw(event) {
      if (this.vad.speaking && this.isRecording) {
        this.channelAudioWebsocket.send(event.detail)
      }
    },
    toggleMicrophone() {
      if (this.channelAudioWebsocket?.state?.isConnected) {
        this.isRecording = !this.isRecording
      }
    },
  },
}
