import { CapacitorAudioRecorder } from "@capgo/capacitor-audio-recorder"
import type {
  RecordingErrorEvent,
  RecordingInterruptionEndedEvent,
  StopRecordingResult,
} from "@capgo/capacitor-audio-recorder"
import type { PluginListenerHandle } from "@capacitor/core"
import {
  ForegroundService,
  Importance,
  ServiceType,
} from "@capawesome-team/capacitor-android-foreground-service"
import {
  findCurrentRecorderFile,
  locateRecordedFile,
  moveToRecordings,
  readAudioFileSize,
} from "@/api/device/nativeAudioFiles.js"
import { scaleNativeLevel } from "@/mobile/tools/scaleNativeLevel.js"
import { countStalledReports } from "@/mobile/tools/countStalledReports.js"
import { AbstractRecorder } from "@/mobile/services/recording/recorders/AbstractRecorder.ts"
import type {
  NativeRecorderOptions,
  RecorderStart,
  RecorderStopPatch,
} from "@/mobile/types/recorder.ts"
import type { NativeFile } from "@/mobile/types/localRecording.ts"

// AAC in ADTS: a stream of self-contained frames, readable up to the last
// one when the app is killed before the recording stops.
const FORMAT = "aac"
const MIME_TYPE = "audio/aac"
// Speech: 16 kHz is what transcription uses, 32 kbit/s matches the web
// recorder (about 58 MB for the 4 hour maximum).
const SAMPLE_RATE = 16_000
const BIT_RATE = 32_000
const LEVEL_INTERVAL_MS = 100
const PROGRESS_INTERVAL_MS = 10_000
// Two reports (about 20 s): one alone may follow a resume too closely.
const STALLED_REPORTS_LIMIT = 2
const NOTIFICATION_ID = 1
const CHANNEL_ID = "recording"
// res/drawable/ic_stat_recording.xml
const NOTIFICATION_ICON = "ic_stat_recording"

// Owns one recording of the native app: the foreground service that keeps
// the microphone allowed once the app is in the background or the screen
// locked, and the plugin recorder that writes the audio into one file.
// Same contract as WebRecorder, except for the audio: one file instead of
// chunks, whose size goes to onProgress, and stop() answers what the page
// cannot know (where the file ended up, its exact duration and size).
// The microphone is never muted here: no onMuted / onUnmuted.
export class NativeRecorder extends AbstractRecorder {
  onLevel: NativeRecorderOptions["onLevel"]
  onInterrupted: NativeRecorderOptions["onInterrupted"]
  onProgress: NativeRecorderOptions["onProgress"]
  notification: NativeRecorderOptions["notification"]
  active: boolean
  paused: boolean
  // iOS: the system took the microphone (a call, Siri); the plugin paused.
  systemInterrupted: boolean
  serviceStarted: boolean
  // The file the plugin writes now: on iOS, a new one after each
  // interruption (see handleInterruptionEnded).
  recorderFile: NativeFile | null
  levelTimer: ReturnType<typeof setTimeout> | undefined
  progressTimer: ReturnType<typeof setTimeout> | undefined
  errorListener: PluginListenerHandle | null
  interruptionBeganListener: PluginListenerHandle | null
  interruptionEndedListener: PluginListenerHandle | null
  lastSize: number | null
  stalledReports: number

  constructor({
    onLevel,
    onInterrupted,
    onProgress,
    notification,
  }: NativeRecorderOptions) {
    super()
    this.onLevel = onLevel
    this.onInterrupted = onInterrupted
    this.onProgress = onProgress
    this.notification = notification
    this.active = false
    this.paused = false
    this.systemInterrupted = false
    this.serviceStarted = false
    this.recorderFile = null
    this.levelTimer = undefined
    this.progressTimer = undefined
    this.errorListener = null
    this.interruptionBeganListener = null
    this.interruptionEndedListener = null
    this.lastSize = null
    this.stalledReports = 0
  }

  // Rejects like getUserMedia when the microphone is refused (a
  // NotAllowedError), so the page reacts the same way.
  async start(): Promise<RecorderStart> {
    await requestMicrophone()
    await this.startService()
    try {
      await CapacitorAudioRecorder.startRecording({
        format: FORMAT,
        sampleRate: SAMPLE_RATE,
        bitRate: BIT_RATE,
      })
    } catch (error) {
      await this.stopService()
      throw error
    }
    this.active = true
    this.recorderFile = await findCurrentRecorderFile()
    this.errorListener = await CapacitorAudioRecorder.addListener(
      "recordingError",
      (event) => this.handleRecorderError(event),
    )
    this.interruptionBeganListener = await CapacitorAudioRecorder.addListener(
      "recordingInterruptionBegan",
      () => this.handleInterruptionBegan(),
    )
    this.interruptionEndedListener = await CapacitorAudioRecorder.addListener(
      "recordingInterruptionEnded",
      (event) => this.handleInterruptionEnded(event),
    )
    this.scheduleLevel()
    this.scheduleProgress()
    return {
      mimeType: MIME_TYPE,
      storage: { kind: "file", file: this.recorderFile },
    }
  }

  pause(): void {
    if (this.active && !this.paused) {
      this.paused = true
      CapacitorAudioRecorder.pauseRecording().catch((error) =>
        console.error("cannot pause the recording", error),
      )
    }
  }

  resume(): void {
    if (this.active && this.paused) {
      this.paused = false
      CapacitorAudioRecorder.resumeRecording().catch((error) =>
        console.error("cannot resume the recording", error),
      )
    }
  }

  // Resolves with the recording's audio patch once the file is finished
  // and moved out of the recorder's folder: { storage, durationMs?, sizeBytes? }.
  async stop(): Promise<RecorderStopPatch> {
    switch (true) {
      case !this.active:
        return {}
      default:
        this.active = false
        this.clearTimers()
        return this.finishFile(await stopPluginRecording())
    }
  }

  get isActive(): boolean {
    return this.active
  }

  get isMuted(): boolean {
    return false
  }

  // Also called when the page goes away while recording (the router keeps
  // it from happening, a reload does not): the plugin stops so the file is
  // finished, and the next start of the app queues it.
  destroy(): void {
    this.clearTimers()
    this.removeListeners()
    if (this.active) {
      this.active = false
      CapacitorAudioRecorder.stopRecording().catch(() => {})
    }
    this.stopService()
  }

  // The plugin tells where its file is (an absolute URI); without an
  // answer it can locate (a stop that failed, a folder it moved), the file
  // it was last seen writing is kept.
  async finishFile(stopped: StopRecordingResult): Promise<RecorderStopPatch> {
    await this.stopService()
    const recorded =
      (stopped.uri && locateRecordedFile(stopped.uri)) || this.recorderFile
    const file = recorded && ((await moveToRecordings(recorded)) ?? recorded)
    const sizeBytes = file ? await readAudioFileSize(file) : null
    return {
      storage: { kind: "file", file },
      ...(Number.isFinite(stopped.duration) && {
        durationMs: stopped.duration,
      }),
      ...(sizeBytes !== null && { sizeBytes }),
    }
  }

  // A notification denied only hides it: the service, and the recording,
  // go on. Without the service, recording still works while the app is
  // shown, so a failure there does not stop the start.
  async startService(): Promise<void> {
    try {
      await ForegroundService.requestPermissions()
      await ForegroundService.createNotificationChannel({
        id: CHANNEL_ID,
        name: this.notification.channelName,
        description: this.notification.channelDescription,
        importance: Importance.Low,
      })
      await ForegroundService.startForegroundService({
        id: NOTIFICATION_ID,
        title: this.notification.title,
        body: this.notification.body,
        smallIcon: NOTIFICATION_ICON,
        serviceType: ServiceType.Microphone,
        notificationChannelId: CHANNEL_ID,
        silent: true,
      })
      this.serviceStarted = true
    } catch (error) {
      console.error("cannot start the recording service", error)
    }
  }

  async stopService(): Promise<void> {
    if (this.serviceStarted) {
      this.serviceStarted = false
      await ForegroundService.stopForegroundService().catch((error) =>
        console.error("cannot stop the recording service", error),
      )
    }
  }

  // Emitted by the plugin on iOS only; on Android a failure shows as a
  // file that stops growing (reportProgress).
  handleRecorderError(event: RecordingErrorEvent): void {
    console.error("native recorder error", event?.message)
    this.onInterrupted("recorder-error")
  }

  // Emitted on iOS only. The file does not grow until the end: not a
  // stall.
  handleInterruptionBegan(): void {
    this.systemInterrupted = true
  }

  // Resumed, the plugin writes a new file (a segment, joined to the others
  // at the stop): the size reports follow it from scratch. Not resumed,
  // the file stops growing and the stall ends the recording.
  async handleInterruptionEnded({
    shouldResume,
  }: RecordingInterruptionEndedEvent): Promise<void> {
    this.systemInterrupted = false
    this.lastSize = null
    this.stalledReports = 0
    if (shouldResume) {
      this.recorderFile = (await findCurrentRecorderFile()) ?? this.recorderFile
    }
  }

  removeListeners(): void {
    this.errorListener?.remove()
    this.interruptionBeganListener?.remove()
    this.interruptionEndedListener?.remove()
    this.errorListener = null
    this.interruptionBeganListener = null
    this.interruptionEndedListener = null
  }

  // One reading at a time: the next one is planned once the previous
  // answered. Not read while the page is hidden, nobody sees the meter.
  scheduleLevel(): void {
    this.levelTimer = setTimeout(() => this.readLevel(), LEVEL_INTERVAL_MS)
  }

  async readLevel(): Promise<void> {
    if (document.visibilityState === "visible" && !this.paused) {
      try {
        const { value } = await CapacitorAudioRecorder.getCurrentAmplitude()
        if (this.active) this.onLevel(scaleNativeLevel(value))
      } catch (error) {
        console.error("cannot read the microphone level", error)
      }
    }
    if (this.active) this.scheduleLevel()
  }

  // The size saved along the way tells the next start of the app, after a
  // crash, that the recording holds audio. A file that stopped growing
  // means the recorder stopped writing: the recording is interrupted, as
  // when the web microphone is lost.
  scheduleProgress(): void {
    this.progressTimer = setTimeout(
      () => this.reportProgress(),
      PROGRESS_INTERVAL_MS,
    )
  }

  async reportProgress(): Promise<void> {
    const sizeBytes = this.recorderFile
      ? await readAudioFileSize(this.recorderFile)
      : null
    this.stalledReports = countStalledReports({
      count: this.stalledReports,
      previousSize: this.lastSize,
      sizeBytes,
      paused: this.paused || this.systemInterrupted,
    })
    this.lastSize = sizeBytes
    switch (true) {
      case !this.active:
        break
      case this.stalledReports >= STALLED_REPORTS_LIMIT:
        this.onInterrupted("recorder-stalled")
        break
      default:
        if (sizeBytes !== null) this.onProgress(sizeBytes)
        this.scheduleProgress()
    }
  }

  clearTimers(): void {
    clearTimeout(this.levelTimer)
    clearTimeout(this.progressTimer)
    this.levelTimer = undefined
    this.progressTimer = undefined
  }
}

async function requestMicrophone(): Promise<void> {
  const { recordAudio } = await CapacitorAudioRecorder.requestPermissions()
  if (recordAudio !== "granted") {
    throw new DOMException("microphone refused", "NotAllowedError")
  }
}

// A recorder that cannot stop cleanly keeps its file (readable up to its
// last frame): the rejection carries where it is.
async function stopPluginRecording(): Promise<StopRecordingResult> {
  try {
    return await CapacitorAudioRecorder.stopRecording()
  } catch (error) {
    console.error("the recording did not stop cleanly", error)
    return (error as { data?: StopRecordingResult } | null)?.data ?? {}
  }
}
