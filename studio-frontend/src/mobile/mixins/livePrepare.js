import { mapGetters } from "vuex"
import {
  loadLiveProfiles,
  startLiveSession,
  stopLiveSession,
} from "@/mobile/services/live/liveSession.js"
import { connectRealtime } from "@/mobile/services/realtime/mediaUpdates.js"
import { buildLiveChannel } from "@/mobile/tools/buildLiveChannel.js"
import { listProfileTranslations } from "@/mobile/tools/listProfileTranslations.js"
import { suggestTranslationTargets } from "@/mobile/tools/suggestTranslationTargets.js"
import { buildRecordingName } from "@/mobile/tools/buildRecordingName.js"

// State of the live preparation page: profiles, the running session if
// any (quickSession store, kept up to date by the sessions feed), the user's
// choices, and the start/stop calls. The live page itself is the in-app
// LiveSession view.
export const livePrepareMixin = {
  data() {
    return {
      loading: true,
      profiles: [],
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
    ...mapGetters("quickSession", { runningSession: "runningQuickSession" }),
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
    // Live feed: a session ended elsewhere leaves the running card by itself
    connectRealtime()
    const [profiles] = await Promise.all([
      loadLiveProfiles(this.liveOrganizationId),
      this.$store.dispatch("quickSession/loadQuickSession"),
    ])
    this.profiles = profiles
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
      this.$router.push({ name: "live-session" })
    },
    async stopRunning() {
      this.stopping = true
      const name = buildRecordingName(
        new Date(),
        this.$i18n.locale,
        this.$t("mobile.live.default_name"),
      )
      // The session's own organization: it may have been started elsewhere
      const result = await stopLiveSession(
        this.runningSession.organizationId,
        this.runningSession.id,
        name,
      )
      this.stopping = false
      if (result.ok) {
        this.$store.commit("quickSession/clearQuickSession")
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
