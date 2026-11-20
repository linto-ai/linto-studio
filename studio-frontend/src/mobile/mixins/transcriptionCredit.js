import { loadTranscriptionCredit } from "@/mobile/services/billing/loadTranscriptionCredit.js"
import { subscribeToNetwork } from "@/api/device/network.js"

// Transcription minutes on the Record page: read when the page opens and
// when the network comes back. A recording refused for a spent quota is
// never sent again by itself: the user decides what consumes the minutes.
// Expects organizationScope from the host (transcriptionSettingsMixin).
export const transcriptionCreditMixin = {
  data() {
    return { transcriptionCredit: null }
  },
  computed: {
    transcriptionCreditMinutes() {
      return this.transcriptionCredit?.minutes ?? null
    },
    transcriptionCreditExhausted() {
      return this.transcriptionCredit?.minutes === 0
    },
    transcriptionRowTitle() {
      if (!this.transcriptionCreditExhausted) return ""
      return this.$t("mobile.settings.title_credit_exhausted")
    },
  },
  created() {
    this.refreshTranscriptionCredit()
    this.stopWatchingNetwork = subscribeToNetwork(this.refreshWhenOnline)
  },
  beforeDestroy() {
    this.stopWatchingNetwork()
  },
  methods: {
    refreshWhenOnline(online) {
      if (online) this.refreshTranscriptionCredit()
    },
    async refreshTranscriptionCredit() {
      this.transcriptionCredit = await loadTranscriptionCredit(
        this.$store,
        this.organizationScope,
      )
    },
  },
}
