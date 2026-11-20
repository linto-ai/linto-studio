import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { WebRecorder } from "@/mobile/services/recording/recorders/WebRecorder.ts"
import type { AbstractRecorder } from "@/mobile/services/recording/recorders/AbstractRecorder.ts"
import type { RecorderOptions } from "@/mobile/types/recorder.ts"

type NativeRecorderModule =
  typeof import("@/mobile/services/recording/recorders/NativeRecorder.ts")

// The recorder of this build: the native app records through the phone in
// a foreground service, so it goes on once the screen is locked; the web
// records in the page. Both take the same options (each reads its own:
// recordingId, deviceId, onMuted, onUnmuted for the web, notification for
// the app).
export async function createRecorder(
  options: RecorderOptions,
): Promise<AbstractRecorder> {
  const native = await importNativeRecorder()
  return native ? new native.NativeRecorder(options) : new WebRecorder(options)
}

// A ternary on the build constant: the web build drops the import (a
// switch case is not dropped).
function importNativeRecorder(): Promise<NativeRecorderModule | null> {
  return IS_NATIVE_APP
    ? import("@/mobile/services/recording/recorders/NativeRecorder.ts")
    : Promise.resolve(null)
}
