import { computed } from "vue"
import {
  apiGetSession,
  apiStartSession,
  apiStopSession,
  apiDeleteSession,
  apiGetPublicSession,
} from "../api/session"

import { sessionModelMixin } from "./sessionModel"
import { bus } from "../main"

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
    const props = {
      sessionLoaded: false,
      sessionId: this.$route.params.sessionId,
      isStarting: false,
      isStoping: false,
      isDeleting: false,
      isFromPublicLink: false,
    }

    if (!this.session) {
      props["session"] = null
    }

    return props
  },
  created() {
    // TODO: check rights
    // then fetch session
    if (this.session === null) this.fetchSession()
  },
  methods: {
    async fetchSession() {
      let sessionRequest = null
      if (this.organizationId) {
        sessionRequest = await apiGetSession(
          this.organizationId,
          this.sessionId,
        )
      }

      if (!sessionRequest || sessionRequest.status === "error") {
        this.isFromPublicLink = true
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
        this.sessionId,
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
        this.sessionId,
      )

      if (start.status === "error") {
        console.error("Error stoping session", start)
        this.isStoping = false
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "session.detail_page.stop_session_error_message",
          ),
          timeout: null,
        })
        return
      }

      await this.fetchSession()
      this.isStoping = false
    },
    async deleteSession() {
      this.isDeleting = true
      const deleteSession = await apiDeleteSession(
        this.currentOrganizationScope,
        this.sessionId,
      )

      if (deleteSession.status === "error") {
        console.error("Error deleting session", deleteSession)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "session.detail_page.delete_session_error_message",
          ),
          timeout: null,
        })
        this.isDeleting = false
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
