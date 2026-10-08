// Session lists keep their order and pagination (ids from the API) and read
// the session objects from the sessions store, kept up to date by the
// websocket feed (App.vue): an update or an end shows up by itself.
// The host defines fetchSessions(), which calls setSessionList().
// Quick sessions ("@" names) are never listed.
function isListedSession(session) {
  return session.name?.[0] !== "@"
}

export const genericSessionList = {
  data() {
    return {
      loading: true,
      error: null,
      sessionIds: [],
    }
  },
  created() {
    // Plain instance field: a store subscription is not reactive state.
    this.unsubscribeSessionsFeed = this.$store.subscribeAction({
      after: (action) => this.onSessionsFeedAction(action),
    })
  },
  mounted() {
    this.fetchSessions()
  },
  beforeDestroy() {
    this.unsubscribeSessionsFeed()
  },
  computed: {
    sessionList() {
      const getSessionById = this.$store.getters["sessions/getSessionById"]
      return this.sessionIds.map((id) => getSessionById(id)).filter(Boolean)
    },
  },
  methods: {
    setSessionList(sessions) {
      this.$store.dispatch("sessions/updateOrCreateSessions", sessions)
      this.sessionIds = sessions.map((session) => session.id)
    },
    // A new session may belong to this list (and to this page): the API
    // knows its place.
    onSessionsFeedAction({ type, payload }) {
      if (type !== "sessions/applySessionsUpdate") return
      if (payload.added?.some(isListedSession)) this.fetchSessions()
    },
  },
  watch: {
    // Changes pushed during a websocket outage are lost: reload.
    "$apiEventWS.state.isConnected"(isConnected) {
      if (isConnected) this.fetchSessions()
    },
  },
}
