import { computed } from "vue"
import { apiGetSession } from "../api/session"

import { sessionModelMixin } from "./sessionModel"

export const sessionMixin = {
  mixins: [sessionModelMixin],
  props: {
    userInfo: { type: Object, required: true },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      session: null,
      sessionLoaded: false,
      sessionId: this.$route.params.sessionId,
    }
  },
  created() {
    // TODO: check rights
    // then fetch session
    this.fetchSession()
  },
  methods: {
    async fetchSession() {
      const session = await apiGetSession(
        this.currentOrganizationScope,
        this.sessionId
      )

      if (session.status === "error") {
        this.$router.replace({ name: "not_found" })
        return
      }

      this.session = session.data
      this.sessionLoaded = true
      console.log(session)
    },
  },
  computed: {
    sessionListRoute() {
      return `/interface/sessionsList`
    },
    settingsRoute() {
      return `/interface/sessions/${this.sessionId}/settings`
    },
  },
}
