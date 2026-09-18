import { mapGetters } from "vuex"
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"
import {
  connectRealtime,
  realtimeSocket,
} from "@/mobile/services/realtime/mediaUpdates.js"
import { stopLiveSession } from "@/mobile/services/live/liveSession.js"
import { loadEditor } from "@/mobile/services/editor/loadEditor.js"
import { buildRecordingName } from "@/mobile/tools/buildRecordingName.js"

const DEVICE_STORAGE_KEY = "mobile.record.deviceId"

// Lifecycle of the live page: load the running quick session, stream the
// microphone to its first channel, end it into a conversation.
export const liveSessionMixin = {
  mixins: [sessionMicrophoneMixin],
  data() {
    return {
      socket: realtimeSocket,
      deviceId: readStoredDeviceId(),
      editorReady: false,
      endSheetOpen: false,
      ending: false,
    }
  },
  computed: {
    ...mapGetters("quickSession", { session: "quickSession" }),
    organizationId() {
      return this.$store.getters["organizations/getCurrentOrganizationScope"]
    },
    channel() {
      return this.session?.channels?.[0] ?? null
    },
    defaultName() {
      return buildRecordingName(
        new Date(),
        this.$i18n.locale,
        this.$t("mobile.live.default_name"),
      )
    },
  },
  async created() {
    // The live component mounts <linto-editor> synchronously: the custom
    // element must be registered before it renders.
    await Promise.all([loadEditor(), connectRealtime()])
    this.editorReady = true
    await this.$store.dispatch("quickSession/loadQuickSession")
    if (!this.session) {
      this.$router.replace({ name: "live" })
      return
    }
    this.socket.subscribeSessionsUpdate(this.organizationId)
    this.startMicrophoneStream()
  },
  beforeDestroy() {
    this.socket.unSubscribeSessionsUpdate?.()
  },
  methods: {
    startMicrophoneStream() {
      this.initMicrophone()
      this.setupRecording(this.channel)
    },
    restartMicrophone() {
      this.startMicrophoneStream()
    },
    toggleMute() {
      if (this.wantsRecording) this.pauseMicrophone()
      else this.startMicrophone()
    },
    async endLive(name) {
      this.ending = true
      this.pauseMicrophone()
      const result = await stopLiveSession(
        this.organizationId,
        this.session.id,
        name,
      )
      this.ending = false
      if (!result.ok) {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.live.stop_failed"),
        )
        return
      }
      this.endSheetOpen = false
      this.$store.commit("quickSession/clearQuickSession")
      this.$store.dispatch("system/showSuccess", this.$t("mobile.live.stopped"))
      this.$router.replace({ name: "media" })
    },
  },
}

function readStoredDeviceId() {
  try {
    return localStorage.getItem(DEVICE_STORAGE_KEY) || null
  } catch {
    return null
  }
}
