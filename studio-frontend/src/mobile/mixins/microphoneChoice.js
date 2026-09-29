import { listMicrophones } from "@/mobile/services/recording/listMicrophones.js"

const STORAGE_KEY = "mobile.record.deviceId"

// Which audio input the Record page uses. Remembered on this phone; the
// list is fetched when the user opens the picker (permission prompt then).
export const microphoneChoiceMixin = {
  data() {
    return {
      microphones: [],
      microphonesLoaded: false,
      microphoneId: readStoredDeviceId(),
      microphoneSheetOpen: false,
    }
  },
  computed: {
    microphoneLabel() {
      const chosen = this.microphones.find(
        (microphone) => microphone.deviceId === this.microphoneId,
      )
      return chosen?.label ?? this.$t("mobile.record.microphone_default")
    },
  },
  methods: {
    async openMicrophonePicker() {
      this.microphoneSheetOpen = true
      if (this.microphonesLoaded) return
      this.microphones = await listMicrophones()
      this.microphonesLoaded = true
    },
    chooseMicrophone(deviceId) {
      this.microphoneId = deviceId
      this.microphoneSheetOpen = false
      try {
        localStorage.setItem(STORAGE_KEY, deviceId ?? "")
      } catch (error) {
        console.error("cannot persist microphone choice", error)
      }
    },
  },
}

function readStoredDeviceId() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null
  } catch {
    return null
  }
}
