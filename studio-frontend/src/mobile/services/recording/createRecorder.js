import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { LocalRecorder } from "@/mobile/services/recording/LocalRecorder.js"

// The recorder of this build: the native app records through the phone in
// a foreground service, so it goes on once the screen is locked; the web
// records in the page. Both take the same callbacks (each uses its own:
// onChunk for the web, onProgress and notification for the app).
export async function createRecorder(options) {
  const native = await importNativeRecorder()
  return native
    ? new native.NativeRecorder(options)
    : new LocalRecorder(options)
}

// A ternary on the build constant: the web build drops the import (a
// switch case is not dropped).
function importNativeRecorder() {
  return IS_NATIVE_APP
    ? import("@/mobile/services/recording/NativeRecorder.js")
    : Promise.resolve(null)
}
