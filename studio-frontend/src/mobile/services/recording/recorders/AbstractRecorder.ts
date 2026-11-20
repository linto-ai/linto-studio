import type {
  RecorderStart,
  RecorderStopPatch,
} from "@/mobile/types/recorder.ts"

// What every recorder does: the page drives a recording through it without
// knowing where the audio is captured and saved (WebRecorder: in the page,
// chunks in IndexedDB; NativeRecorder: by the phone, in one file). The
// contract only, no shared code.
export abstract class AbstractRecorder {
  abstract start(): Promise<RecorderStart>

  // The audio captured so far is saved: the page may be frozen or killed
  // while paused (hidden page).
  abstract pause(): void

  abstract resume(): void

  // Resolves once the recording is finished and all its audio saved, with
  // what the recorder knows better than the page.
  abstract stop(): Promise<RecorderStopPatch>

  abstract get isActive(): boolean

  abstract get isMuted(): boolean

  // Releases every resource (microphone, timers, service).
  abstract destroy(): void
}
