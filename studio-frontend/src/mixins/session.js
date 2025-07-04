import { computed, watch } from "vue"
import {
  apiGetSession,
  apiStartSession,
  apiStopSession,
  apiDeleteSession,
  apiGetPublicSession,
  apiGetSessionAliasesBySessionId,
  apiUpdateSession,
  apiPatchSession,
} from "../api/session"

import { sessionModelMixin } from "./sessionModel"
import { bus } from "../main"
import mergeSession from "../tools/mergeSession"

export const sessionMixin = {
  mixins: [sessionModelMixin],
  props: {
    userInfo: { type: Object, required: true },
    // orga id from scope (cookie) => could be null in annonymous mode so better to use "organizationId".
    // If no null, organizationId and currentOrganizationScope should be equal
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
      sessionAliases: null,
    }

    if (!this.session) {
      props["session"] = null
    }

    return props
  },
  mounted() {
    // TODO: check rights
    // then fetch session
    if (this.session === null) this.fetchSession()

    bus.$on(
      `websocket/orga_${this.organizationId}_session_update`,
      this.onSessionUpdateEvent.bind(this),
    )
  },
  beforeDestroy() {
    //this.$sessionWS.unSubscribeOrganization()
    bus.$off(`websocket/orga_${this.organizationId}_session_update`)
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

      if (
        sessionRequest.status === "error" ||
        typeof sessionRequest.data === "string"
      ) {
        this.$router.replace({ name: "not_found" })
        return
      }

      this.session = sessionRequest.data
      await this.fetchAliases()
      this.sessionLoaded = true
    },
    async fetchAliases() {
      this.sessionAliases = await apiGetSessionAliasesBySessionId(
        this.organizationId,
        this.session.id,
      )
    },
    async startSession() {
      this.isStarting = true
      const start = await apiStartSession(this.organizationId, this.id)

      if (start.status === "error") {
        console.error("Error starting session", start)
        return
      }

      await this.fetchSession()
      this.isStarting = false
    },
    async stopSession() {
      this.isStoping = true
      const start = await apiDeleteSession(this.organizationId, this.id)

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

      bus.$emit("app_notif", {
        status: "success",
        message: this.$i18n.t("session.detail_page.stop_session_success"),
        timeout: null,
      })
      this.$router.push(this.sessionListRoute)
      //await this.fetchSession()
      this.isStoping = false
    },
    async deleteSession() {
      this.isDeleting = true
      const deleteSession = await apiDeleteSession(this.organizationId, this.id)

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
    subscribeToWebsocket() {
      this.$sessionWS.subscribeOrganization(this.organizationId)
    },
    onSessionUpdateEvent(value) {
      for (const updatedSession of value.updated) {
        if (updatedSession.id === this.id) {
          this.session = mergeSession(this.session, updatedSession)
        }
      }

      if (this.onSessionUpdatePostProcess) {
        this.onSessionUpdatePostProcess(this.session)
      }
    },
    async syncVisibility(visibility) {
      let req = await apiPatchSession(this.currentOrganizationScope, this.id, {
        visibility,
      })
      if (req.status === "error") {
        console.error("Error updating session", req)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t("session.settings_page.error_update_message"),
          timeout: null,
        })
        return
      }
      bus.$emit("app_notif", {
        status: "success",
        message: this.$i18n.t("session.settings_page.success_message"),
        timeout: 3000,
      })
      this.session.visibility = visibility
    },
    async syncWatermarkSettings(
      { frequency, duration, content, pinned, display },
      silent = false,
    ) {
      let req = await apiPatchSession(this.currentOrganizationScope, this.id, {
        meta: {
          ...this.session.meta,
          "@watermark": { frequency, duration, content, pinned, display },
        },
      })

      if (req.status === "error") {
        console.error("Error updating session", req)
        if (!silent) {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("session.settings_page.error_update_message"),
            timeout: null,
          })
        }
        return
      }
      if (!silent) {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$i18n.t("session.settings_page.success_message"),
          timeout: 3000,
        })
      }
      this.session.meta["@watermark"] = {
        frequency,
        duration,
        content,
        pinned,
        display,
      }
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
      return {
        name: "sessions live",
        params: {
          sessionId: this.sessionId,
          organizationId: this.sessionOrganizationId,
        },
      }
    },
    readyForWSConnection() {
      return this.sessionLoaded && this.$sessionWS.state.isConnected
    },
  },
  watch: {
    readyForWSConnection(newValue, oldValue) {
      if (newValue) {
        this.subscribeToWebsocket()
      }
    },
  },
}
