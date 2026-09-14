import {
  loadLiveProfiles,
  loadRunningLiveSession,
  startLiveSession,
  stopLiveSession,
} from "@/mobile/services/live/liveSession.js"
import { buildLiveChannel } from "@/mobile/tools/buildLiveChannel.js"
import { listProfileTranslations } from "@/mobile/tools/listProfileTranslations.js"
import { suggestTranslationTargets } from "@/mobile/tools/suggestTranslationTargets.js"
import { buildStudioLiveUrl } from "@/mobile/tools/buildStudioLiveUrl.js"
import { buildRecordingName } from "@/mobile/tools/buildRecordingName.js"

// State of the live preparation page: profiles, the running session if
// any, the user's choices, and the start/stop calls. The live page itself
// is the classic quick session page, opened in this tab.
export const livePrepareMixin = {
  data() {
    return {
      loading: true,
      profiles: [],
      runningSession: null,
      profileId: null,
      translations: [],
      keepAudio: true,
      diarization: false,
      starting: false,
      stopping: false,
      failed: false,
    }
  },
  computed: {
    liveOrganizationId() {
      return this.$store.getters["organizations/getCurrentOrganizationScope"]
    },
    profile() {
      return this.profiles.find((item) => item.id === this.profileId) ?? null
    },
    translationOptions() {
      return listProfileTranslations(this.profile, this.$i18n.locale)
    },
    translationSuggestions() {
      return suggestTranslationTargets(this.profile, this.translationOptions)
    },
    supportsDiarization() {
      return !!this.profile?.config?.hasDiarization
    },
  },
  watch: {
    profileId() {
      this.translations = []
      this.diarization = false
    },
  },
  async created() {
    const [profiles, running] = await Promise.all([
      loadLiveProfiles(this.liveOrganizationId),
      loadRunningLiveSession(),
    ])
    this.profiles = profiles
    this.runningSession = running
    this.profileId = profiles[0]?.id ?? null
    this.loading = false
  },
  methods: {
    async start() {
      this.starting = true
      this.failed = false
      const channel = buildLiveChannel({
        profile: this.profile,
        translations: this.translations,
        keepAudio: this.keepAudio,
        transcriptionService: this.transcriptionSettings,
        diarization: this.diarization && this.supportsDiarization,
      })
      const result = await startLiveSession(this.liveOrganizationId, channel)
      this.starting = false
      if (!result.ok) {
        this.failed = true
        return
      }
      this.openLivePage()
    },
    openLivePage() {
      window.location.assign(buildStudioLiveUrl(this.liveOrganizationId))
    },
    async stopRunning() {
      this.stopping = true
      const name = buildRecordingName(
        new Date(),
        this.$i18n.locale,
        this.$t("mobile.live.default_name"),
      )
      const result = await stopLiveSession(
        this.liveOrganizationId,
        this.runningSession.id,
        name,
      )
      this.stopping = false
      if (result.ok) {
        this.runningSession = null
        this.$store.dispatch(
          "system/showSuccess",
          this.$t("mobile.live.stopped"),
        )
      } else {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.live.stop_failed"),
        )
      }
    },
  },
}
