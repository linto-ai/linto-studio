import { LocalRecorder } from "@/mobile/services/recording/LocalRecorder.js"
import { createScreenWakeLock } from "@/mobile/services/recording/screenWakeLock.js"
import { appendChunk } from "@/mobile/services/recording/queue.js"
import { requestPersistentStorage } from "@/mobile/services/recording/requestPersistentStorage.js"
import { buildRecordingName } from "@/mobile/tools/buildRecordingName.js"
import { RECORDING_STATUS } from "@/mobile/const/recordingStatus.js"
import { readKeepAudioPreference } from "@/mobile/services/preferences/keepAudioPreference.js"

const TICK_MS = 250
const MAX_DURATION_MS = 4 * 60 * 60 * 1000

// Drives one recording from the Record page: microphone, chunks to the
// queue, timer, wake lock, interruptions. The page only renders `recorder`
// and calls startRecording / togglePause / stopRecording.
export const recordingControllerMixin = {
  data() {
    return {
      recorder: {
        state: "idle",
        id: null,
        elapsedMs: 0,
        level: 0,
        sizeBytes: 0,
        peakLevel: 0,
        interruptedAt: null,
        wakeLockOk: true,
      },
    }
  },
  created() {
    this.localRecorder = null
    this.wakeLock = createScreenWakeLock()
    this.ticker = null
    this.tickStartedAt = 0
    document.addEventListener("visibilitychange", this.checkRecorderAlive)
    window.addEventListener("beforeunload", this.warnBeforeLeaving)
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.checkRecorderAlive)
    window.removeEventListener("beforeunload", this.warnBeforeLeaving)
    this.releaseRecorder()
  },
  methods: {
    async startRecording(transcription, deviceId = null, sharing = null) {
      this.recorder.state = "starting"
      const id = crypto.randomUUID()
      this.localRecorder = new LocalRecorder({
        onChunk: (index, blob) => this.storeChunk(id, index, blob),
        onLevel: (level) => this.trackLevel(level),
        onInterrupted: () => this.stopRecording({ interrupted: true }),
      })
      try {
        const mimeType = await this.localRecorder.start(deviceId)
        await this.createQueueEntry(id, mimeType, transcription, sharing)
      } catch (error) {
        console.error("cannot start recording", error)
        this.releaseRecorder()
        this.recorder.state =
          error?.name === "NotAllowedError" ? "denied" : "blocked"
        return
      }
      requestPersistentStorage()
      this.recorder.wakeLockOk = await this.wakeLock.acquire()
      Object.assign(this.recorder, {
        id,
        elapsedMs: 0,
        sizeBytes: 0,
        peakLevel: 0,
        interruptedAt: null,
        state: "recording",
      })
      this.startTicker()
    },
    togglePause() {
      if (this.recorder.state === "recording") {
        this.localRecorder.pause()
        this.stopTicker()
        this.recorder.state = "paused"
      } else if (this.recorder.state === "paused") {
        this.localRecorder.resume()
        this.startTicker()
        this.recorder.state = "recording"
      }
    },
    async stopRecording({ interrupted = false } = {}) {
      if (!this.localRecorder || this.recorder.state === "idle") return
      this.stopTicker()
      await this.localRecorder.stop()
      this.releaseRecorder()
      if (interrupted) this.recorder.interruptedAt = this.recorder.elapsedMs
      await this.$store.dispatch("mobileRecordings/patch", {
        id: this.recorder.id,
        status: RECORDING_STATUS.NAMING,
        durationMs: this.recorder.elapsedMs,
        sizeBytes: this.recorder.sizeBytes,
        peakLevel: this.recorder.peakLevel,
        interruptedAt: this.recorder.interruptedAt,
      })
      this.recorder.state = "idle"
      this.$emit("recording-stopped", this.recorder.id)
      this.onRecordingStopped(this.recorder.id)
    },
    trackLevel(level) {
      this.recorder.level = level
      if (level > this.recorder.peakLevel) this.recorder.peakLevel = level
    },
    async storeChunk(id, index, blob) {
      this.recorder.sizeBytes += blob.size
      await appendChunk(id, index, blob)
    },
    createQueueEntry(id, mimeType, transcription, sharing) {
      return this.$store.dispatch("mobileRecordings/create", {
        id,
        organizationId:
          this.$store.getters["organizations/getCurrentOrganizationScope"],
        name: buildRecordingName(
          new Date(),
          this.$i18n.locale,
          this.$t("mobile.record.default_name"),
        ),
        mimeType,
        transcription,
        sharing,
        keepAudio: readKeepAudioPreference(),
        conversationId: null,
        createdAt: Date.now(),
        status: RECORDING_STATUS.RECORDING,
        durationMs: 0,
        sizeBytes: 0,
        progress: 0,
        error: null,
        interruptedAt: null,
      })
    },
    startTicker() {
      this.tickStartedAt = Date.now() - this.recorder.elapsedMs
      this.ticker = setInterval(this.tick, TICK_MS)
    },
    stopTicker() {
      clearInterval(this.ticker)
      this.ticker = null
    },
    tick() {
      this.recorder.elapsedMs = Date.now() - this.tickStartedAt
      if (this.recorder.elapsedMs >= MAX_DURATION_MS) this.stopRecording()
    },
    checkRecorderAlive() {
      const cameBack = document.visibilityState === "visible"
      const died = this.localRecorder && !this.localRecorder.isActive
      if (cameBack && died && this.recorder.state !== "idle") {
        this.stopRecording({ interrupted: true })
      }
    },
    warnBeforeLeaving(event) {
      if (
        this.recorder.state === "recording" ||
        this.recorder.state === "paused"
      ) {
        event.preventDefault()
      }
    },
    releaseRecorder() {
      this.stopTicker()
      this.localRecorder?.destroy()
      this.localRecorder = null
      this.wakeLock.release()
    },
  },
}
