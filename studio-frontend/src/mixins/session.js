import { computed, watch } from "vue"
import {
  apiGetSession,
  apiStartSession,
  apiStopSession,
  apiClearSession,
  apiDeleteSession,
  apiGetPublicSession,
  apiGetSessionDataBySessionId,
  apiAddSessionData,
  apiUpdateSession,
  apiUpdateSessionData,
  apiPatchSession,
  apiRemovePasswordFromSessionData,
} from "../api/session"

import { sessionModelMixin } from "./sessionModel"
import { bus } from "../main"
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
      // The session object lives in the sessions store (kept up to date by
      // the websocket feed); the view only knows which one it shows.
      loadedSessionId: null,
    }

    return props
  },
  created() {
    // Plain instance field: a store subscription is not reactive state.
    this.unsubscribeSessionsFeed = this.$store.subscribeAction({
      after: (action) => this.onSessionsFeedAction(action),
    })
  },
  mounted() {
    if (this.session === null) this.fetchSession()
  },
  beforeDestroy() {
    this.unsubscribeSessionsFeed()
  },
  destroyed() {
    // After the children: the live editor stops using the public connection
    // during its own teardown. The app-wide connection is never closed here.
    if (this.websocketInstance && this.websocketInstance !== this.$apiEventWS) {
      this.websocketInstance.close()
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
          { withCaptions: false },
        )
      }

      if (!sessionRequest || sessionRequest.status === "error") {
        if (this?.privatePage) {
          this.$router.replace({ name: "not_found" })
          return
        }

        this.isFromPublicLink = true
        sessionRequest = await apiGetPublicSession(
          this.sessionId,
          this.usedPassword,
          { withCaptions: false },
        )
      }

      // Left while the requests were running: nothing to show, and no
      // connection to open that nobody would close.
      if (this._isDestroyed) return

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

      this.$store.dispatch(
        "sessions/updateOrCreateSession",
        sessionRequest.data,
      )
      this.loadedSessionId = sessionRequest.data.id

      // Chosen on the first load only: fetchSession runs again on
      // start/clear/password and must not swap or duplicate the connection.
      if (!this.websocketInstance) {
        this.websocketInstance = this.isFromPublicLink
          ? this.createPublicWebsocket()
          : this.$apiEventWS
      }

      // Aliases are organization scoped, a public link viewer cannot read them
      if (this.isFromPublicLink) this.sessionAliases = []
      else await this.fetchAliases()
      this.sessionLoaded = true
    },
    // Another connection for a public session, to avoid conflicts with the
    // app-wide one. Its sessions feed fills the same store.
    createPublicWebsocket() {
      const websocket = new ApiEventWebSocket()
      websocket.connect(this.session.publicSessionToken, { isPublic: true })
      websocket.subscribeSessionsUpdate(this.sessionOrganizationId)
      return websocket
    },
    // The websocket only pushes changes: one missed during an outage (the
    // session ended meanwhile) is caught up here. A session the API no
    // longer finds has ended; any other failure is left for the next try.
    async syncSessionAfterReconnect() {
      const sessionRequest = this.isFromPublicLink
        ? await apiGetPublicSession(this.sessionId, this.usedPassword, {
            withCaptions: false,
          })
        : await apiGetSession(this.organizationId, this.sessionId, {
            withCaptions: false,
          })
      if (sessionRequest.status !== "error") {
        if (typeof sessionRequest.data === "object") {
          this.$store.dispatch(
            "sessions/updateOrCreateSession",
            sessionRequest.data,
          )
        }
        return
      }
      if (sessionRequest.error?.status === 404) {
        this.$store.commit("sessions/markSessionTerminated", this.id)
      }
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
    async clearSession() {
      this.isClearing = true
      const res = await apiClearSession(this.organizationId, this.id)

      if (res.status === "error") {
        console.error("Error clearing session", res)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "session.detail_page.clear_session_error_message",
          ),
          timeout: null,
        })
        this.isClearing = false
        return
      }

      bus.$emit("app_notif", {
        status: "success",
        message: this.$i18n.t("session.detail_page.clear_session_success"),
        timeout: null,
      })
      await this.fetchSession()
      this.isClearing = false
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
    // Lets the host (onSessionUpdatePostProcess) react once the websocket
    // feed changed its session; the session itself is already up to date.
    onSessionsFeedAction({ type, payload }) {
      if (type !== "sessions/applySessionsUpdate") return
      if (!this.onSessionUpdatePostProcess || !this.id) return
      const changedSessions = [
        ...(payload.updated ?? []),
        ...(payload.removed ?? []),
      ]
      if (changedSessions.some((session) => session.id === this.id)) {
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
      this.$store.dispatch("sessions/updateOrCreateSession", {
        id: this.id,
        visibility,
      })
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
        req = await apiAddSessionData(this.currentOrganizationScope, {
          sessionId: this.sessionId,
          password,
        })
      } else {
        return
      }

      if (req.status === "error") {
        this.$store.dispatch("system/addNotification", {
          message: this.$i18n.t("session.settings_page.error_update_password"),
          type: "error",
        })
      }
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
      this.$store.dispatch("sessions/updateOrCreateSession", {
        id: this.id,
        meta: {
          ...this.session.meta,
          "@watermark": { frequency, duration, content, pinned, display },
        },
      })
    },
  },
  watch: {
    isWebsocketConnected(isConnected) {
      if (isConnected && this.sessionLoaded) this.syncSessionAfterReconnect()
    },
  },
  computed: {
    session() {
      if (!this.loadedSessionId) return null
      return (
        this.$store.getters["sessions/getSessionById"](this.loadedSessionId) ??
        null
      )
    },
    isWebsocketConnected() {
      return this.websocketInstance?.state.isConnected ?? false
    },
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
  },
}
