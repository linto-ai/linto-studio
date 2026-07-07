// TODO: Fix webvoicesdk compatibility with Vite (parcel-specific imports)
import WebVoiceSDK from "@linto-ai/webvoicesdk"
//const WebVoiceSDK = null

export const microphoneMixin = {
  data() {
    return {
      recorder: null,
      downSampler: null,
      mic: null,
      vad: null,
      speaking: false,
      p_closed: false,
    }
  },
  mounted() {},
  destroyed() {
    this.p_close()
  },
  methods: {
    initMicrophone() {
      // TODO: Re-enable when webvoicesdk is fixed
      if (!WebVoiceSDK) {
        console.warn("WebVoiceSDK disabled - microphone features unavailable")
        return
      }
      if (this.mic) {
        // Re-setup (e.g. "reconfigure microphone" recovery): release the
        // previous pipeline first, otherwise the old mic/worker keep running
        // orphaned, duplicate frames and blind the frame watchdog.
        this.p_close()
      }
      this.recorder = new WebVoiceSDK.Recorder()
      this.downSampler = new WebVoiceSDK.DownSampler({
        targetSampleRate: 16000,
        targetFrameSize: 4096,
        Int16Convert: true,
      })
      this.mic = new WebVoiceSDK.Mic({
        frameSize: 4096,
      })
      this.vad = new WebVoiceSDK.Vad({
        threshold: 0.85,
        timeAfterStop: 1000,
      })
      this.vad.addEventListener("speakingStatus", this.p_onVadEvent.bind(this))
      // A fresh pipeline is alive: re-arm the destroy guard.
      this.p_closed = false
    },
    p_close() {
      this.p_closed = true
      if (this?.vad) {
        this.vad.removeEventListener("speakingStatus", this.p_onVadEvent)
        if (this?.vad?.stop) {
          this.vad.stop()
        }
      }

      if (this?.mic?.stop) {
        this.mic.stop()
      }

      if (this.downSampler) {
        this.downSampler?.stop()
      }

      if (this?.recorder?.stop) {
        this.recorder.stop()
      }

      if (this?.onClose) {
        this.onClose()
      }
    },
    p_onVadEvent(e) {
      const speaking = !!e.detail
      this.speaking = speaking
      if (this.onVadEvent) {
        this.onVadEvent(speaking)
      }
    },
    async connectToMicrophone(deviceId) {
      const deviceIdConfig =
        deviceId && deviceId !== "default" ? { exact: deviceId } : null
      await this.mic.stop()

      await this.downSampler.stop()
      await this.mic.start(deviceIdConfig, {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: true,
      })
      if (this.p_closed) {
        this.mic.stop()
        throw new Error("microphone setup aborted: component destroyed")
      }
      this.p_watchMicTrack()

      await this.vad.stop()
      this.vad.start(this.mic)
      this.microphoneWorked = false
    },
    p_watchMicTrack() {
      const track = this.mic.stream?.getAudioTracks?.()[0]
      if (!track) {
        return
      }
      // track.stop() (normal teardown) never fires "ended": these handlers
      // only catch external causes (device unplugged, permission revoked,
      // system interruption). Property assignment so the handlers die with
      // the track, no removal bookkeeping needed.
      track.onended = () => this.p_onMicTrackLost("ended")
      track.onmute = () => this.p_onMicTrackLost("mute")
      track.onunmute = () => this.p_onMicTrackRestored()
    },
    p_onMicTrackLost(reason) {
      if (this.p_closed) {
        return
      }
      this.speaking = false
      if (this.onMicrophoneLost) {
        this.onMicrophoneLost(reason)
      }
    },
    p_onMicTrackRestored() {
      if (this.p_closed) {
        return
      }
      if (this.onMicrophoneRestored) {
        this.onMicrophoneRestored()
      }
    },
  },
}
