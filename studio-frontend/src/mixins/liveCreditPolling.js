import { getEnv } from "@/tools/getEnv"

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"
const POLL_INTERVAL_MS = 60 * 1000

// Keeps the org's live credit fresh while a live is displayed, so the view
// can warn before the server cuts the live for lack of credit. For now the
// source is a usage fetch every minute (the server debits once a minute);
// a pushed event can replace it later without touching the consumers, which
// only read `liveCredit`.
// Expects the host component to have `isFromPublicLink` and
// `currentOrganizationScope` props.
export const liveCreditPollingMixin = {
  computed: {
    // Only the org's own members watch its credit: a public viewer, or a
    // viewer whose store holds another org's usage, would see a wrong figure.
    isLiveCreditWatched() {
      return (
        IS_MODE_CLOUD &&
        !this.isFromPublicLink &&
        !!this.currentOrganizationScope
      )
    },
    // live block of the org usage summary, null when not watched.
    liveCredit() {
      if (!this.isLiveCreditWatched) return null
      return this.$store.getters["billing/live"]
    },
  },
  created() {
    // Plain instance field: a timer handle has no business being reactive.
    this.liveCreditTimer = null
  },
  mounted() {
    this.startLiveCreditPolling()
  },
  beforeDestroy() {
    this.stopLiveCreditPolling()
  },
  methods: {
    startLiveCreditPolling() {
      if (!this.isLiveCreditWatched) return
      this.refreshLiveCredit()
      this.liveCreditTimer = setInterval(
        this.refreshLiveCredit,
        POLL_INTERVAL_MS,
      )
    },
    stopLiveCreditPolling() {
      clearInterval(this.liveCreditTimer)
      this.liveCreditTimer = null
    },
    refreshLiveCredit() {
      this.$store.dispatch("billing/fetchUsage", this.currentOrganizationScope)
    },
  },
}
