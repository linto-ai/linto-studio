// Pause and resume of the user's quick session (microphone live) around a
// live pack purchase, shared by the classic and the mobile live pages.
// Leaving for the payment page stops the live server-side (and its credit
// count); any way back to recording resumes it. Expects the host to have
// `session` and sessionMicrophoneMixin (wantsRecording, pauseMicrophone,
// startMicrophone).
export const quickSessionPauseMixin = {
  data() {
    return {
      // What pauseForPackPurchase changed, undone if the purchase is dropped
      // (closed without leaving for the payment page).
      packPurchasePause: null,
    }
  },
  computed: {
    isSessionPaused() {
      return this.session?.status === "paused"
    },
  },
  watch: {
    // Any way back to recording (mute toggle, microphone restarted after the
    // payment page, dropped purchase) needs a live session.
    wantsRecording(wantsRecording) {
      if (wantsRecording && this.isSessionPaused) {
        this.resumeSessionForRecording()
      }
    },
  },
  methods: {
    // Leaving for the payment page: stop sending audio and stop the live
    // server-side (and its credit count).
    async pauseForPackPurchase() {
      this.packPurchasePause = {
        micWasRecording: this.wantsRecording,
        sessionPaused: false,
      }
      this.pauseMicrophone()
      if (this.isSessionPaused) return
      const paused = await this.$store.dispatch(
        "quickSession/pauseQuickSession",
      )
      if (this.packPurchasePause) {
        this.packPurchasePause.sessionPaused = paused
      } else if (paused) {
        // Purchase dropped while the pause was on its way
        this.resumeSession()
      }
    },
    undoPackPurchasePause() {
      if (!this.packPurchasePause) return
      const { micWasRecording, sessionPaused } = this.packPurchasePause
      this.packPurchasePause = null
      if (micWasRecording) {
        // The wantsRecording watcher resumes the session
        this.startMicrophone()
      } else if (sessionPaused) {
        this.resumeSession()
      }
    },
    async resumeSession() {
      const resumed = await this.$store.dispatch(
        "quickSession/resumeQuickSession",
      )
      if (!resumed) {
        this.$store.dispatch(
          "system/showError",
          this.$t("session.detail_page.resume_session_error_message"),
        )
      }
      return resumed
    },
    // Recording into a paused session would be lost: resume it, or give up
    // recording if the server refuses (e.g. live credit still spent).
    async resumeSessionForRecording() {
      if (await this.resumeSession()) return
      this.pauseMicrophone()
    },
  },
}
