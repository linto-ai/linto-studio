import { CapacitorAudioRecorder } from "@capgo/capacitor-audio-recorder"
import { ForegroundService } from "@capawesome-team/capacitor-android-foreground-service"

// Native app only (the web build never loads this module).

// Stopping what a previous page left running, once per page.
let leftoverStop = null

// A page that just started runs no recording yet: one the plugin still
// holds belongs to a page that reloaded or crashed under it. It is stopped
// so its file is finished before being recovered, and the service goes
// with its notification. Never throws.
export function stopLeftoverRecording() {
  leftoverStop ??= stopPluginAndService()
  return leftoverStop
}

async function stopPluginAndService() {
  try {
    const { status } = await CapacitorAudioRecorder.getRecordingStatus()
    if (status !== "INACTIVE") await CapacitorAudioRecorder.stopRecording()
  } catch (error) {
    console.error("cannot stop the leftover recording", error)
  }
  await ForegroundService.stopForegroundService().catch((error) =>
    console.error("cannot stop the leftover recording service", error),
  )
}
