import { computed } from "vue"
import { apiGetSession } from "../api/session"

import { orgaRoleMixin } from "./orgaRole"
import { sessionModelMixin } from "./sessionModel"

export const sessionMixin = {
  mixins: [orgaRoleMixin, sessionModelMixin],
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
