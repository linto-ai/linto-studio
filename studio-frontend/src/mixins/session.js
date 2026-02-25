import { computed, watch } from "vue"
import {
  apiGetSession,
  apiStartSession,
  apiStopSession,
  apiDeleteSession,
  apiGetPublicSession,
  apiGetSessionDataBySessionId,
  apiUpdateSession,
  apiUpdateSessionData,
  apiPatchSession,
  apiRemovePasswordFromSessionData,
} from "../api/session"

import { sessionModelMixin } from "./sessionModel"
import { bus } from "../main"
import mergeSession from "../tools/mergeSession"
import EMPTY_FIELD from "@/const/emptyField"
import ApiEventWebSocket from "@/services/websocket/ApiEventWebSocket"

export const sessionMixin = {
  mixins: [sessionModelMixin],
  /*
  ### Orga id props
  - `currentOrganizationScope` is the current orgaId from the store (may be null in annonymous mode)
  - `organizationId` is the ID from the URL (normally it's identical to currentOrganizationScope, the router must ensure this)
  - there is also `sessionOrganizationId` from the sessionModelMixin which is the orgaId of the session. 
    this value is undefined until the session is loaded (this.sessionLoaded === true)

  In the best case scenario all these values are identical, but for public sessions these three values may differ.
  
  It is preferable to use “sessionOrganizationId” in order to ensure that the actual session ID is used during API/WS interactions
  */
  props: {
    userInfo: { type: Object, required: true },
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
      waitingPassword: false,
      passwordField: {
        ...EMPTY_FIELD,
        type: "password",
        label: this.$t("session.password_modal.password_label"),
      },
      usedPassword: null,
      websocketInstance: null,
    }

    if (!this.session) {
      props["session"] = null
    }

    return props
  },
  mounted() {
    if (this.session === null) this.fetchSession()
  },
  beforeDestroy() {
    //this.$apiEventWS.unSubscribeSessionsUpdate()
    bus.$off(`websocket/orga_${this.sessionOrganizationId}_session_update`)
    if (this.isFromPublicLink) {
      this.currentChannelMicrophone?.close()
    }
  },
  methods: {
    async fecthSessionWithPassword() {
      this.sessionLoaded = false
      this.usedPassword = this.passwordField.value
      await this.fetchSession()
    },
    async fetchSession() {
      let sessionRequest = null
      if (this.organizationId && !this.usedPassword) {
        sessionRequest = await apiGetSession(
          this.organizationId,
          this.sessionId,
        )
      }

      if (!sessionRequest || sessionRequest.status === "error") {
        if (this?.privatePage) {
          this.$router.replace({ name: "not_found" })
        }

        this.isFromPublicLink = true
        sessionRequest = await apiGetPublicSession(
          this.sessionId,
          this.usedPassword,
        )
      }

      if (
        sessionRequest.status === "error" ||
        typeof sessionRequest.data === "string"
      ) {
        if (sessionRequest?.error?.status === 401) {
          this.waitingPassword = true
        } else {
          this.$router.replace({ name: "not_found" })
        }
        return
      }

      this.session = sessionRequest.data
      this.$store.commit("sessions/addSession", this.session)

      // Use another WS instance for public session to avoid conflict with main app WS
      if (this.isFromPublicLink) {
        this.websocketInstance = new ApiEventWebSocket()
        this.websocketInstance.connect(this.session.publicSessionToken)
      } else {
        this.websocketInstance = this.$apiEventWS
      }

      await this.fetchAliases()
      this.sessionLoaded = true
    },
    async fetchAliases() {
      this.sessionAliases = await apiGetSessionDataBySessionId(
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
        console.error("Error stopping session", start)
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
      const deleteSession = await apiDeleteSession(
        this.sessionOrganizationId,
        this.id,
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
    subscribeToWebsocket() {
      this.websocketInstance.subscribeSessionsUpdate(this.sessionOrganizationId)
      bus.$on(
        `websocket/orga_${this.sessionOrganizationId}_session_update`,
        this.onSessionUpdateEvent.bind(this),
      )
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
      const req = await apiPatchSession(
        this.currentOrganizationScope,
        this.id,
        {
          visibility,
        },
      )
      if (req.status === "error") {
        console.error("Error updating session", req)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t("session.settings_page.error_update_message"),
          timeout: null,
        })
        return false
      }

      bus.$emit("app_notif", {
        status: "success",
        message: this.$i18n.t("session.settings_page.success_message"),
        timeout: 3000,
      })
      this.session.visibility = visibility
      return true
    },
    async syncPassword(password) {
      let req
      if (this.sessionAliases?.[0]) {
        if (password) {
          req = await apiUpdateSessionData(
            this.currentOrganizationScope,
            this.sessionAliases[0]._id,
            { password },
          )
        } else {
          req = await apiRemovePasswordFromSessionData(
            this.currentOrganizationScope,
            this.sessionAliases[0]._id,
          )
        }
      } else if (password) {
        req = await apiAddSessionData(organizationScope, {
          sessionId: this.sessionId,
          password: data.password,
        })
      }

      if (req.status === "error") {
        this.$store.dispatch("system/addNotification", {
          message: this.$i18n.t("session.settings_page.error_update_password"),
          type: "error",
        })
        return
      }

      this.$store.dispatch("system/addNotification", {
        message: this.$i18n.t("session.settings_page.success_update_password"),
        type: "success",
      })
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
      return this.sessionLoaded && this.websocketInstance.state.isConnected
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
