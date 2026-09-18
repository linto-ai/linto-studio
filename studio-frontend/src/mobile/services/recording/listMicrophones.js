import { buildAudioConstraints } from "@/mobile/tools/buildAudioConstraints.js"

// Audio inputs with their labels. Labels are only revealed once the
// microphone permission is granted, so a short getUserMedia is opened and
// closed first. Returns [] when refused or unsupported.
export async function listMicrophones() {
  if (!navigator.mediaDevices?.enumerateDevices) return []
  try {
    const probe = await navigator.mediaDevices.getUserMedia(
      buildAudioConstraints(null),
    )
    probe.getTracks().forEach((track) => track.stop())
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices
      .filter((device) => device.kind === "audioinput")
      .map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `Micro ${index + 1}`,
      }))
  } catch (error) {
    console.error("cannot list microphones", error)
    return []
  }
}
