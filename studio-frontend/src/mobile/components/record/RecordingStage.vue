<template>
  <div class="m-recording-stage">
    <RecordingNotice
      v-if="notice"
      :notice="notice"
      @dismiss="session.lastGap = null" />
    <section class="m-recording-stage__controls">
      <RecordTimer
        v-if="isRecording"
        :elapsed-ms="session.elapsedMs"
        :paused="session.state === 'paused'" />
      <LevelMeter v-if="session.state === 'recording'" :level="session.level" />
      <RecordButton :state="session.state" @click="onMainButton" />
      <Button
        v-if="isRecording"
        class="m-recording-stage__pause"
        :icon="session.state === 'paused' ? 'play' : 'pause'"
        icon-weight="fill"
        :disabled="session.state === 'paused' && session.microphoneMuted"
        :label="
          session.state === 'paused'
            ? $t('mobile.record.resume')
            : $t('mobile.record.pause')
        "
        @click="togglePause" />
      <p class="m-muted m-recording-stage__hint">
        {{ $t("mobile.record.local_only") }}
      </p>
      <slot />
    </section>
  </div>
</template>

<script>
import RecordButton from "@/mobile/components/record/RecordButton.vue"
import RecordTimer from "@/mobile/components/record/RecordTimer.vue"
import LevelMeter from "@/mobile/components/record/LevelMeter.vue"
import RecordingNotice from "@/mobile/components/record/RecordingNotice.vue"
import { createRecorder } from "@/mobile/services/recording/recorders/createRecorder.ts"
import { screenWakeLock } from "@/services/screenWakeLock/ScreenWakeLock.ts"
import { requestPersistentStorage } from "@/api/device/requestPersistentStorage.js"
import { readKeepAudioPreference } from "@/api/localStorage/keepAudioPreference.js"
import { buildRecordingName } from "@/mobile/tools/buildRecordingName.js"
import { buildLocalRecording } from "@/mobile/tools/buildLocalRecording.ts"
import { pickRecordingNotice } from "@/mobile/tools/pickRecordingNotice.js"
import { settleWithin } from "@/mobile/tools/settleWithin.js"
import { PAUSE_REASON } from "@/mobile/const/pauseReason.js"
import { generateId } from "@/tools/generateId.js"
import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"

const TICK_MS = 250
const MAX_DURATION_MS = 4 * 60 * 60 * 1000
// Saving the recording's row is local and fast: past this delay the
// database is stuck (another tab holding an older version of it) and
// recording would keep nothing.
const ROW_SAVE_TIMEOUT_MS = 10_000

// The recording in progress on the Record page: microphone, timer, level,
// pause, notices, wake lock, interruptions. The page never sees the
// recorder: it hands over the microphone and the settings to freeze on the
// recording, and hears the state ("state-change": idle, starting,
// recording, paused, denied, blocked) and the id of a stopped recording
// ("stopped"). The recording's row (mobileRecordings) is created when the
// microphone starts and completed along the way.
//
// A web page cannot record in the background: iOS mutes the microphone as
// soon as the page is hidden, Android feeds it silence. So the recording
// pauses itself when the page is hidden (or the microphone muted) and
// resumes itself when both are back; the time in between is stored as a
// gap. Pausing the same MediaRecorder keeps one continuous file.
//
// The native app records through the phone, in a foreground service: it
// goes on in the background and with the screen locked (no screen kept
// on). It pauses itself only when the system takes the microphone (iOS: a
// call, Siri), and resumes by itself when the system gives it back, or
// waits for the user when the system did not advise to resume.
//
// Leaving the page would cut the microphone without stopping: while it
// records, the stage keeps the router from leaving and stops instead (the
// page then opens its stop sheet); while the microphone starts, it waits.
export default {
  name: "RecordingStage",
  components: { RecordButton, RecordTimer, LevelMeter, RecordingNotice },
  props: {
    // Audio input picked by the user; null for the default one.
    microphoneId: { type: String, default: null },
    // Frozen on the recording when it starts (or at its stop, for what was
    // still unknown): ConversationSettings, null while the page loads.
    conversationSettings: { type: Object, default: null },
  },
  data() {
    return {
      session: {
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
        capturesInBackground: IS_NATIVE_APP,
      },
    }
  },
  computed: {
    isRecording() {
      return (
        this.session.state === "recording" || this.session.state === "paused"
      )
    },
    notice() {
      return pickRecordingNotice(this.session)
    },
  },
  created() {
    this.audioRecorder = null
    this.ticker = null
    this.tickStartedAt = 0
    this.pausedAt = null
    this.isStopping = false
    // The recorder reported an interruption before the recording was live:
    // handled once it is.
    this.interruptedWhileStarting = false
    // Progress writes run one after the other, and the stop waits for
    // them: a late write never lands after the stop patch.
    this.audioWrites = Promise.resolve()
    if (!this.session.capturesInBackground) {
      document.addEventListener("visibilitychange", this.onVisibilityChange)
    }
    window.addEventListener("beforeunload", this.warnBeforeLeaving)
    this.removeLeaveGuard = this.$router.beforeEach(this.guardLeaving)
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange)
    window.removeEventListener("beforeunload", this.warnBeforeLeaving)
    this.removeLeaveGuard()
    this.releaseRecorder()
  },
  methods: {
    onMainButton() {
      switch (true) {
        case this.isRecording:
          this.stopRecording()
          break
        case this.session.state === "idle":
          this.startRecording()
          break
      }
    },
    changeState(state) {
      this.session.state = state
      this.$emit("state-change", state)
    },
    async startRecording() {
      this.changeState("starting")
      this.interruptedWhileStarting = false
      const id = generateId()
      const outcome = await this.openMicrophone(id)
      switch (true) {
        case outcome === "started":
          await this.beginRecording(id)
          break
        default:
          this.releaseRecorder()
          this.changeState(outcome)
      }
    },
    // The microphone on and the row saved: "started"; else the state to
    // show ("denied" when the microphone is refused, "blocked" otherwise).
    async openMicrophone(id) {
      try {
        this.audioRecorder = await createRecorder({
          recordingId: id,
          deviceId: this.microphoneId,
          onProgress: (sizeBytes) => this.storeProgress(id, sizeBytes),
          onLevel: (level) => this.trackLevel(level),
          onInterrupted: () => this.onRecorderInterrupted(),
          onMuted: () => this.onMicrophoneMuted(),
          onUnmuted: () => this.onMicrophoneUnmuted(),
          onResumeNeeded: () => this.onResumeNeeded(),
          notification: this.buildRecordingNotification(),
        })
        const audio = await this.audioRecorder.start()
        return this.describeRowSaving(
          await settleWithin(this.createRow(id, audio), ROW_SAVE_TIMEOUT_MS),
        )
      } catch (error) {
        console.error("cannot start recording", error)
        return error?.name === "NotAllowedError" ? "denied" : "blocked"
      }
    },
    describeRowSaving(saving) {
      switch (saving.status) {
        case "done":
          return "started"
        default:
          console.error("cannot save the recording", saving)
          return "blocked"
      }
    },
    async beginRecording(id) {
      requestPersistentStorage()
      this.pausedAt = null
      this.audioWrites = Promise.resolve()
      Object.assign(this.session, {
        id,
        elapsedMs: 0,
        sizeBytes: 0,
        peakLevel: 0,
        interruptedAt: null,
        pauseReason: null,
        gaps: [],
        lastGap: null,
        microphoneMuted: this.audioRecorder.isMuted,
      })
      this.changeState("recording")
      this.startTicker()
      switch (true) {
        case this.interruptedWhileStarting:
          this.stopRecording({ interrupted: true })
          break
        default:
          this.pauseIfCannotCapture()
          if (!this.session.capturesInBackground) await this.acquireWakeLock()
      }
    },
    // Before the recording is live, an interruption waits for it.
    onRecorderInterrupted() {
      switch (true) {
        case this.session.state === "starting":
          this.interruptedWhileStarting = true
          break
        default:
          this.stopRecording({ interrupted: true })
      }
    },
    // The row exists from the first second: a recording cut short by the
    // system (app killed in the background) is found again at the next
    // launch with what it captured.
    createRow(id, { mimeType, storage }) {
      return this.$store.dispatch(
        "mobileRecordings/create",
        buildLocalRecording({
          id,
          organizationId:
            this.$store.getters["organizations/getCurrentOrganizationScope"],
          name: buildRecordingName(
            new Date(),
            this.$i18n.locale,
            this.$t("mobile.record.default_name"),
          ),
          keepAudio: readKeepAudioPreference(),
          locale: this.$i18n.locale,
          mimeType,
          storage,
          settings: this.conversationSettings,
          createdAt: Date.now(),
        }),
      )
    },
    // Hidden or muted while starting: those transitions fired before the
    // recording was live and were ignored.
    pauseIfCannotCapture() {
      switch (true) {
        case !this.session.capturesInBackground &&
          document.visibilityState === "hidden":
          this.onPageHidden()
          break
        case this.audioRecorder.isMuted:
          this.pauseRecording(PAUSE_REASON.MICROPHONE)
          break
      }
    },
    // Resuming on a muted microphone would record silence as if it were
    // sound: the automatic resume takes over when the microphone is back.
    togglePause() {
      switch (true) {
        case this.session.state === "recording":
          this.pauseRecording(PAUSE_REASON.USER)
          break
        case this.session.state === "paused" && !this.audioRecorder.isMuted:
          this.resumeRecording()
          break
      }
    },
    pauseRecording(reason) {
      this.audioRecorder.pause()
      this.stopTicker()
      this.pausedAt = Date.now()
      this.session.pauseReason = reason
      this.changeState("paused")
    },
    resumeRecording() {
      this.recordAutomaticPauseGap()
      this.audioRecorder.resume()
      this.startTicker()
      this.session.pauseReason = null
      this.changeState("recording")
    },
    // A pause the user did not ask for is a hole in the audio: kept on the
    // recording so the user can be told how much is missing.
    recordAutomaticPauseGap() {
      const automatic =
        this.session.state === "paused" &&
        this.session.pauseReason !== PAUSE_REASON.USER
      if (automatic && this.pausedAt !== null) {
        const gap = {
          atMs: this.session.elapsedMs,
          durationMs: Date.now() - this.pausedAt,
          reason: this.session.pauseReason,
        }
        this.session.gaps.push(gap)
        this.session.lastGap = gap
        this.$store.dispatch("mobileRecordings/patchAudio", {
          id: this.session.id,
          audio: { gaps: [...this.session.gaps] },
        })
      }
      this.pausedAt = null
    },
    async stopRecording({ interrupted = false } = {}) {
      // Several causes can ask at once (track ended, page visible again).
      if (!this.audioRecorder || !this.isRecording || this.isStopping) return
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
      // What the recorder knows better than the page (native file: where
      // it ended up, exact duration and size).
      const recorderPatch = await this.audioRecorder.stop()
      await this.audioWrites
      this.releaseRecorder()
      if (interrupted) this.session.interruptedAt = this.session.elapsedMs
      await this.$store.dispatch("mobileRecordings/finishRecording", {
        id: this.session.id,
        audio: {
          durationMs: this.session.elapsedMs,
          sizeBytes: this.session.sizeBytes,
          peakLevel: this.session.peakLevel,
          interruptedAt: this.session.interruptedAt,
          gaps: [...this.session.gaps],
          ...recorderPatch,
        },
        settings: this.conversationSettings,
      })
      this.session.pauseReason = null
      this.changeState("idle")
      if (interrupted) {
        this.$store.dispatch(
          "system/showWarning",
          this.$t("mobile.record.interrupted"),
        )
      }
      this.$emit("stopped", this.session.id)
    },
    guardLeaving(to, from, next) {
      switch (true) {
        case this.isRecording:
          next(false)
          this.stopRecording()
          break
        case this.session.state === "starting":
          next(false)
          break
        default:
          next()
      }
    },
    onVisibilityChange() {
      switch (true) {
        case !this.audioRecorder || !this.isRecording || this.isStopping:
          break
        case document.visibilityState === "hidden":
          this.onPageHidden()
          break
        default:
          this.onPageVisible()
      }
    },
    // Last moment the page surely runs: pause (the recorder saves the
    // pending audio) before the system mutes or silences the microphone.
    // A microphone pause becomes a background one once the page is hidden
    // (iOS may mute the track just before): pausedAt stays, the gap still
    // starts at the mute.
    onPageHidden() {
      switch (true) {
        case this.session.state === "recording":
          this.pauseRecording(PAUSE_REASON.BACKGROUND)
          break
        case this.session.pauseReason === PAUSE_REASON.MICROPHONE:
          this.session.pauseReason = PAUSE_REASON.BACKGROUND
          break
      }
    },
    onPageVisible() {
      switch (true) {
        case !this.audioRecorder.isActive:
          this.stopRecording({ interrupted: true })
          break
        default:
          this.acquireWakeLock()
          this.resumeAfterAutomaticPause()
      }
    },
    onMicrophoneMuted() {
      this.session.microphoneMuted = true
      if (this.session.state !== "recording") return
      this.pauseRecording(
        !this.session.capturesInBackground &&
          document.visibilityState === "hidden"
          ? PAUSE_REASON.BACKGROUND
          : PAUSE_REASON.MICROPHONE,
      )
    },
    onMicrophoneUnmuted() {
      this.session.microphoneMuted = false
      this.resumeAfterAutomaticPause()
    },
    resumeAfterAutomaticPause() {
      const pausedAutomatically =
        this.session.state === "paused" &&
        this.session.pauseReason !== PAUSE_REASON.USER &&
        this.session.pauseReason !== PAUSE_REASON.INTERRUPTED
      if (
        pausedAutomatically &&
        this.audioRecorder?.canCapture &&
        !this.isStopping
      ) {
        this.resumeRecording()
      }
    },
    // The microphone is back but the system did not advise to resume
    // (native app, iOS): the recording waits for the user, who can now
    // resume. A pause of the user stays one.
    onResumeNeeded() {
      this.session.microphoneMuted = false
      switch (true) {
        case this.session.state === "recording":
          this.pauseRecording(PAUSE_REASON.INTERRUPTED)
          break
        case this.session.state === "paused" &&
          this.session.pauseReason !== PAUSE_REASON.USER:
          this.session.pauseReason = PAUSE_REASON.INTERRUPTED
          break
      }
    },
    async acquireWakeLock() {
      this.session.wakeLockOk = await screenWakeLock.lock()
    },
    trackLevel(level) {
      this.session.level = level
      if (level > this.session.peakLevel) this.session.peakLevel = level
    },
    // The recorder saves the audio itself and reports the size saved. Size
    // and duration are saved with it: a recording cut short by the system
    // is found again with what it captured.
    storeProgress(id, sizeBytes) {
      this.session.sizeBytes = sizeBytes
      const audio = { sizeBytes, durationMs: this.session.elapsedMs }
      this.audioWrites = this.audioWrites.then(() =>
        this.saveProgress(id, audio),
      )
    },
    async saveProgress(id, audio) {
      try {
        await this.$store.dispatch("mobileRecordings/patchAudio", { id, audio })
      } catch (error) {
        console.error("cannot store recording progress", error)
      }
    },
    startTicker() {
      this.tickStartedAt = Date.now() - this.session.elapsedMs
      this.ticker = setInterval(this.tick, TICK_MS)
    },
    stopTicker() {
      clearInterval(this.ticker)
      this.ticker = null
    },
    tick() {
      this.session.elapsedMs = Date.now() - this.tickStartedAt
      if (this.session.elapsedMs >= MAX_DURATION_MS) this.stopRecording()
    },
    // Shown by the native app while it records (foreground service).
    buildRecordingNotification() {
      return {
        title: this.$t("mobile.record.notification.title"),
        body: this.$t("mobile.record.notification.body"),
        channelName: this.$t("mobile.record.notification.channel_name"),
        channelDescription: this.$t(
          "mobile.record.notification.channel_description",
        ),
      }
    },
    warnBeforeLeaving(event) {
      if (this.isRecording) event.preventDefault()
    },
    releaseRecorder() {
      this.stopTicker()
      this.audioRecorder?.destroy()
      this.audioRecorder = null
      screenWakeLock.unlock()
    },
  },
}
</script>

<style scoped>
.m-recording-stage {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}

.m-recording-stage__controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-space-4);
  padding: var(--m-space-4) 0;
}

.m-recording-stage__pause {
  min-width: 160px;
}

.m-recording-stage__hint {
  text-align: center;
  max-width: 320px;
}
</style>
