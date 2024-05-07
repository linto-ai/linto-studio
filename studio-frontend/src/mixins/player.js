import {
  apiGetAudioFileFromConversation,
  apiGetAudioWaveFormFromConversation,
} from "../api/conversation.js"
import { bus } from "../main.js"
import { timeToHMS } from "../tools/timeToHMS.js"
export const playerMixin = {
  props: {
    conversationId: {
      type: String,
      required: true,
    },
    audio: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      player: null,
      playerReady: false,
      playerLoading: false,
      playerError: false,
      regionsReady: false,
      audioFile: "",
      state: "pause",
      currentTime: 0,
      duration: this.audio.duration,
      audiowaveform: [],
      fetchController: new AbortController(),
      instanceDestroyed: false,
    }
  },
  beforeDestroy() {
    this.instanceDestroyed = true
    this.destroy()
  },
  computed: {
    currentTimeHMS() {
      return timeToHMS(this.currentTime)
    },
    durationHMS() {
      return timeToHMS(this.duration)
    },
    regionsPlugin() {
      return this?.player?.plugins[0]
    },
  },
  methods: {
    seekTo(time) {
      if (this?.player?.isPlaying()) {
        this.player.pause()
      }
      let delta = time - this?.player?.getCurrentTime()
      this?.player?.skip(delta)
    },
    playPause() {
      if (this.state === "pause") {
        this.player?.play()
        this.state = "playing"
      } else {
        this.player?.pause()
        this.state = "pause"
      }
    },
    pause() {
      this.player?.pause()
      this.state = "pause"
    },
    async getAudioFile() {
      let req = await apiGetAudioFileFromConversation(
        this.conversationId,
        false
      )
      if (req?.status === "success") {
        this.audioFile = URL.createObjectURL(req.data)
      }
    },
    async getAudiowaveform() {
      try {
        let req = await apiGetAudioWaveFormFromConversation(
          this.conversationId,
          false
        )
        if (req.status === "success") {
          this.audiowaveform = req.data.data
        } else {
          throw req
        }
      } catch (error) {
        this.audiowaveform = []
      }
    },
  },
}
