import { computed } from "vue"
import {
  apiGetSession,
  apiStartSession,
  apiStopSession,
  apiDeleteSession,
  apiGetPublicSession,
} from "../api/session"

import { sessionModelMixin } from "./sessionModel"

export const sessionMixin = {
  mixins: [sessionModelMixin],
  props: {
    userInfo: { type: Object, required: true },
    // orga id from scope (cookie)
    currentOrganizationScope: {
      type: String,
      required: false,
    },
    //orga id from url
    organizationId: {
      type: String,
      required: false,
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
      let sessionRequest = null
      if (this.currentOrganizationScope || this.organizationId) {
        sessionRequest = await apiGetSession(
          this.organizationId,
          this.sessionId
        )
      }

      if (!sessionRequest || sessionRequest.status === "error") {
        sessionRequest = await apiGetPublicSession(this.sessionId)
      }

      if (sessionRequest.status === "error") {
        this.$router.replace({ name: "not_found" })
        return
      }

      this.session = sessionRequest.data
      this.sessionLoaded = true
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
      return `/interface/${this.sessionOrganizationId}/sessions/${this.sessionId}/settings`
    },
    liveRoute() {
      return `/interface/${this.sessionOrganizationId}/sessions/${this.sessionId}`
    },
  },
}
