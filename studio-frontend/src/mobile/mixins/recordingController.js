import { LocalRecorder } from "@/mobile/services/recording/LocalRecorder.js"
import { createScreenWakeLock } from "@/mobile/services/recording/screenWakeLock.js"
import { appendChunk } from "@/mobile/services/recording/queue.js"
import { requestPersistentStorage } from "@/mobile/services/recording/requestPersistentStorage.js"
import { buildRecordingName } from "@/mobile/tools/buildRecordingName.js"
import { RECORDING_STATUS } from "@/mobile/const/recordingStatus.js"
import { PAUSE_REASON } from "@/mobile/const/pauseReason.js"
import { readKeepAudioPreference } from "@/mobile/services/preferences/keepAudioPreference.js"
import { generateId } from "@/tools/generateId.js"

const TICK_MS = 250
const MAX_DURATION_MS = 4 * 60 * 60 * 1000

// Drives one recording from the Record page: microphone, chunks to the
// queue, timer, wake lock, interruptions. The page only renders `recorder`
// and calls startRecording / togglePause / stopRecording.
//
// A web page cannot record in the background: iOS mutes the microphone as
// soon as the page is hidden, Android feeds it silence. So the recording
// pauses itself when the page is hidden (or the microphone muted) and
// resumes itself when both are back; the time in between is stored as a
// gap. Pausing the same MediaRecorder keeps one continuous file.
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
        microphoneMuted: false,
        pauseReason: null,
        gaps: [],
        lastGap: null,
      },
    }
  },
  created() {
    this.localRecorder = null
    this.wakeLock = createScreenWakeLock()
    this.ticker = null
    this.tickStartedAt = 0
    this.pausedAt = null
    this.isStopping = false
    // Chunk writes run one after the other, and stopRecording waits for
    // them: a late chunk write never lands after the stop patch.
    this.chunkWrites = Promise.resolve()
    document.addEventListener("visibilitychange", this.onVisibilityChange)
    window.addEventListener("beforeunload", this.warnBeforeLeaving)
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange)
    window.removeEventListener("beforeunload", this.warnBeforeLeaving)
    this.releaseRecorder()
  },
  methods: {
    async startRecording(deviceId = null) {
      this.recorder.state = "starting"
      const id = generateId()
      this.localRecorder = new LocalRecorder({
        onChunk: (index, blob) => this.storeChunk(id, index, blob),
        onLevel: (level) => this.trackLevel(level),
        onInterrupted: () => this.stopRecording({ interrupted: true }),
        onMuted: () => this.onMicrophoneMuted(),
        onUnmuted: () => this.onMicrophoneUnmuted(),
      })
      try {
        const mimeType = await this.localRecorder.start(deviceId)
        await this.createQueueEntry(id, mimeType)
      } catch (error) {
        console.error("cannot start recording", error)
        this.releaseRecorder()
        this.recorder.state =
          error?.name === "NotAllowedError" ? "denied" : "blocked"
        return
      }
      requestPersistentStorage()
      this.pausedAt = null
      this.chunkWrites = Promise.resolve()
      Object.assign(this.recorder, {
        id,
        elapsedMs: 0,
        sizeBytes: 0,
        peakLevel: 0,
        interruptedAt: null,
        pauseReason: null,
        gaps: [],
        lastGap: null,
        microphoneMuted: this.localRecorder.isMuted,
        state: "recording",
      })
      this.startTicker()
      this.pauseIfCannotCapture()
      await this.acquireWakeLock()
    },
    // Hidden or muted while starting: those transitions fired before the
    // recording was live and were ignored.
    pauseIfCannotCapture() {
      if (document.visibilityState === "hidden") {
        this.onPageHidden()
      } else if (this.localRecorder.isMuted) {
        this.pauseRecording(PAUSE_REASON.MICROPHONE)
      }
    },
    // Resuming on a muted microphone would record silence as if it were
    // sound: the automatic resume takes over when the microphone is back.
    togglePause() {
      if (this.recorder.state === "recording") {
        this.pauseRecording(PAUSE_REASON.USER)
      } else if (
        this.recorder.state === "paused" &&
        !this.localRecorder.isMuted
      ) {
        this.resumeRecording()
      }
    },
    pauseRecording(reason) {
      this.localRecorder.pause()
      this.stopTicker()
      this.pausedAt = Date.now()
      this.recorder.pauseReason = reason
      this.recorder.state = "paused"
    },
    resumeRecording() {
      this.recordAutomaticPauseGap()
      this.localRecorder.resume()
      this.localRecorder.resumeLevelMeter()
      this.startTicker()
      this.recorder.pauseReason = null
      this.recorder.state = "recording"
    },
    // A pause the user did not ask for is a hole in the audio: kept on the
    // recording so the user can be told how much is missing.
    recordAutomaticPauseGap() {
      const automatic =
        this.recorder.state === "paused" &&
        this.recorder.pauseReason !== PAUSE_REASON.USER
      if (automatic && this.pausedAt !== null) {
        const gap = {
          atMs: this.recorder.elapsedMs,
          durationMs: Date.now() - this.pausedAt,
          reason: this.recorder.pauseReason,
        }
        this.recorder.gaps.push(gap)
        this.recorder.lastGap = gap
        this.$store.dispatch("mobileRecordings/patch", {
          id: this.recorder.id,
          gaps: [...this.recorder.gaps],
        })
      }
      this.pausedAt = null
    },
    dismissLastGap() {
      this.recorder.lastGap = null
    },
    async stopRecording({ interrupted = false } = {}) {
      if (!this.localRecorder || this.recorder.state === "idle") return
      // Several causes can ask at once (track ended, page visible again).
      if (this.isStopping) return
      this.isStopping = true
      try {
        await this.finishRecording(interrupted)
      } finally {
        this.isStopping = false
      }
    },
    async finishRecording(interrupted) {
      this.recordAutomaticPauseGap()
      this.stopTicker()
      await this.localRecorder.stop()
      await this.chunkWrites
      this.releaseRecorder()
      if (interrupted) this.recorder.interruptedAt = this.recorder.elapsedMs
      await this.$store.dispatch("mobileRecordings/patch", {
        id: this.recorder.id,
        status: RECORDING_STATUS.NAMING,
        durationMs: this.recorder.elapsedMs,
        sizeBytes: this.recorder.sizeBytes,
        peakLevel: this.recorder.peakLevel,
        interruptedAt: this.recorder.interruptedAt,
        gaps: [...this.recorder.gaps],
      })
      this.recorder.state = "idle"
      this.recorder.pauseReason = null
      this.$emit("recording-stopped", this.recorder.id)
      this.onRecordingStopped(this.recorder.id)
    },
    onVisibilityChange() {
      const isRecording =
        this.recorder.state === "recording" || this.recorder.state === "paused"
      if (!this.localRecorder || !isRecording || this.isStopping) return
      if (document.visibilityState === "hidden") {
        this.onPageHidden()
      } else {
        this.onPageVisible()
      }
    },
    // Last moment the page surely runs: save the pending audio, then pause
    // before the system mutes or silences the microphone.
    // A microphone pause becomes a background one once the page is hidden
    // (iOS may mute the track just before): pausedAt stays, the gap still
    // starts at the mute.
    onPageHidden() {
      this.localRecorder.flush()
      if (this.recorder.state === "recording") {
        this.pauseRecording(PAUSE_REASON.BACKGROUND)
      } else if (this.recorder.pauseReason === PAUSE_REASON.MICROPHONE) {
        this.recorder.pauseReason = PAUSE_REASON.BACKGROUND
      }
    },
    onPageVisible() {
      if (!this.localRecorder.isActive) {
        this.stopRecording({ interrupted: true })
        return
      }
      this.acquireWakeLock()
      this.resumeAfterAutomaticPause()
    },
    onMicrophoneMuted() {
      this.recorder.microphoneMuted = true
      if (this.recorder.state !== "recording") return
      this.pauseRecording(
        document.visibilityState === "hidden"
          ? PAUSE_REASON.BACKGROUND
          : PAUSE_REASON.MICROPHONE,
      )
    },
    onMicrophoneUnmuted() {
      this.recorder.microphoneMuted = false
      this.resumeAfterAutomaticPause()
    },
    resumeAfterAutomaticPause() {
      const pausedAutomatically =
        this.recorder.state === "paused" &&
        this.recorder.pauseReason !== PAUSE_REASON.USER
      const canCapture =
        document.visibilityState === "visible" && !this.localRecorder?.isMuted
      if (pausedAutomatically && canCapture && !this.isStopping) {
        this.resumeRecording()
      }
    },
    async acquireWakeLock() {
      this.recorder.wakeLockOk = await this.wakeLock.acquire()
    },
    trackLevel(level) {
      this.recorder.level = level
      if (level > this.recorder.peakLevel) this.recorder.peakLevel = level
    },
    // Size and duration are saved with each chunk: a recording cut short by
    // the system (app killed in the background) is found again at the next
    // launch with what it captured.
    storeChunk(id, index, blob) {
      this.recorder.sizeBytes += blob.size
      const progress = {
        id,
        sizeBytes: this.recorder.sizeBytes,
        durationMs: this.recorder.elapsedMs,
      }
      this.chunkWrites = this.chunkWrites.then(() =>
        this.persistChunk(index, blob, progress),
      )
    },
    async persistChunk(index, blob, progress) {
      try {
        await appendChunk(progress.id, index, blob)
        await this.$store.dispatch("mobileRecordings/patch", progress)
      } catch (error) {
        console.error("cannot store recording chunk", error)
      }
    },
    // Transcription and sharing are set when the stop sheet closes: the
    // recording never waits for the services list.
    createQueueEntry(id, mimeType) {
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
        transcription: null,
        sharing: null,
        keepAudio: readKeepAudioPreference(),
        conversationId: null,
        createdAt: Date.now(),
        status: RECORDING_STATUS.RECORDING,
        durationMs: 0,
        sizeBytes: 0,
        progress: 0,
        error: null,
        interruptedAt: null,
        gaps: [],
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
