import ChannelWS from "@/models/ChannelWS.js"
import { customDebug } from "@/tools/customDebug.js"

const EVENT_TO_LISTEN = "downSamplerFrame"

export const sessionMicrophoneMixin = {
  data() {
    return {
      channelAudioWebsocket: new ChannelWS(), // websocket to send audio data
      isRecording: false,
      debugSessionMicrophone: customDebug("vue:debug:sessionMicrophone"),
    }
  },
  methods: {
    onClose() {
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
      window.addEventListener("beforeunload", this.onbeforeunload)
      await this.connectToMicrophone(this.deviceId)
      this.connectToChannelAudioWebsocket(channel)
        .then(() => {
          this.debugSessionMicrophone("Connected to websocket")
          this.setupRecordRaw()
        })
        .catch((error) => {
          console.error("Error while connecting to websocket", error)
        })
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
