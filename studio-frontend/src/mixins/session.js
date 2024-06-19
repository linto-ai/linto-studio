import { computed } from "vue"
import {
  apiGetSession,
  apiStartSession,
  apiStopSession,
  apiDeleteSession,
} from "../api/session"

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
      isStarting: false,
      isStoping: false,
      isDeleting: false,
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
    async startSession() {
      this.isStarting = true
      const start = await apiStartSession(
        this.currentOrganizationScope,
        this.sessionId
      )

      if (start.status === "error") {
        console.error("Error starting session", start)
        return
      }

      await this.fetchSession()
      this.isStarting = false
    },
    async stopSession() {
      this.isStoping = true
      const start = await apiStopSession(
        this.currentOrganizationScope,
        this.sessionId
      )

      if (start.status === "error") {
        console.error("Error stoping session", start)
        return
      }

      await this.fetchSession()
      this.isStoping = false
    },
    async deleteSession() {
      this.isDeleting = true
      const deleteSession = await apiDeleteSession(
        this.currentOrganizationScope,
        this.sessionId
      )

      if (deleteSession.status === "error") {
        console.error("Error deleting session", deleteSession)
        return
      }

      // notif
      this.$router.replace(this.sessionListRoute)
      this.isDeleting = false
    },
  },
  computed: {
    sessionListRoute() {
      return `/interface/sessionsList`
    },
    settingsRoute() {
      return `/interface/sessions/${this.sessionId}/settings`
    },
    liveRoute() {
      return `/interface/sessions/${this.sessionId}`
    },
  },
}
