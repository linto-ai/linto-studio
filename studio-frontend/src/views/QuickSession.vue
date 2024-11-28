<template>
  <Loading v-if="loading" />
  <SessionSetupMicrophone
    ref="sessionSetupMicrophone"
    v-else-if="state == 'microphone-selection'"
    :alreadyCreatedPersonalSession="alreadyCreatedPersonalSession"
    @trash-session="trashSession"
    @save-session="onSaveSession"
    @start-session="startSession"
    @back="backToStart"></SessionSetupMicrophone>
  <SessionLiveMicrophone
    v-else-if="state == 'session-live'"
    ref="sessionLiveMicrophone"
    :deviceId="selectedDeviceId"
    :currentOrganizationScope="currentOrganizationScope"
    :session="session">
    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small align-center">
        <div class="flex1"></div>
        <button @click="onSaveSession" :disabled="isSavingSession">
          <span class="label">{{ $t("quick_session.live.save_button") }}</span>
        </button>
      </div>
    </template>
  </SessionLiveMicrophone>
</template>
<script>
import { bus } from "../main.js"

import {
  apiGetQuickSessionByOrganization,
  apiCreateQuickSession,
  apiDeleteQuickSession,
} from "@/api/session.js"
import { userName } from "@/tools/userName.js"

import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionLiveMicrophone from "@/components/SessionLiveMicrophone.vue"
import Loading from "../components/Loading.vue"
export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedDeviceId: null,
      state: "microphone-selection", // microphone-selection, session-live
      session: null,
      isSavingSession: false,
      alreadyCreatedPersonalSession: null,
      loading: true,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.alreadyCreatedPersonalSession =
          await apiGetQuickSessionByOrganization(this.currentOrganizationScope)
        this.loading = false
      } catch (error) {
        console.error(error)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t("session.create_page.error_message"),
          timeout: null,
        })
      }
    },
    startSession({ deviceId }) {
      console.log("startSession", deviceId)
      this.selectedDeviceId = deviceId
      this.setupSession()
    },
    backToStart() {
      this.$router.push({ name: "conversations create" })
    },
    trashSession() {
      this.onSaveSession(true)
    },
    async onSaveSession(trash = false) {
      if (this.$refs.sessionLiveMicrophone) {
        await this.$refs.sessionLiveMicrophone.p_close()
      } else if (this.$refs.sessionSetupMicrophone) {
        await this.$refs.sessionSetupMicrophone.p_close()
      }
      await this.$nextTick()
      this.isSavingSession = true
      const now = new Date()
      const conversationName = `Meeting from ${userName(this.userInfo)}, ${now.toLocaleString()} `
      const sessionToDelete = this.session ?? this.alreadyCreatedPersonalSession
      await apiDeleteQuickSession(
        this.currentOrganizationScope,
        sessionToDelete.id,
        {
          name: conversationName,
          trash,
          force: true,
        },
      )
      this.$router.push({ name: "inbox" })
    },
    async setupSession() {
      try {
        if (this.alreadyCreatedPersonalSession) {
          this.session = this.alreadyCreatedPersonalSession
        } else {
          const channels = [
            {
              name: "Main",
              transcriberProfileId: this.$route.query.transcriberProfileId,
              translations: this.$route.query.translations ?? [],
              diarization: this.$route.query.diarization ?? false,
            },
          ]
          const res = await apiCreateQuickSession(
            this.currentOrganizationScope,
            {
              channels: channels,
            },
          )

          if (res.status == "success") {
            this.session = res.data
          } else {
            throw new Error("api error")
          }
        }

        this.selectedChannel = this.session.channels[0]
        this.selectedTranslations = "original"
        this.state = "session-live"
        //this.connectToWebsocket()
      } catch (error) {
        console.error(error)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t("session.create_page.error_message"),
          timeout: null,
        })
      }
    },
  },
  components: {
    SessionSetupMicrophone,
    SessionLiveMicrophone,
    Loading,
  },
}
</script>
