<template>
  <SessionSetupMicrophone
    v-if="state == 'microphone-selection'"
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
  apiGetQuickSession,
  apiCreateQuickSession,
  apiDeleteQuickSession,
} from "@/api/session.js"
import { userName } from "@/tools/userName.js"

import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionLiveMicrophone from "@/components/SessionLiveMicrophone.vue"
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
    }
  },
  mounted() {},
  methods: {
    startSession({ deviceId }) {
      console.log("startSession", deviceId)
      this.selectedDeviceId = deviceId
      this.setupSession()
    },
    backToStart() {
      this.$router.push({ name: "conversations create" })
    },
    async onSaveSession() {
      await this.$refs.sessionLiveMicrophone.p_close()
      await this.$nextTick()
      this.isSavingSession = true
      const now = new Date()
      const conversationName = `Meeting from ${userName(this.userInfo)}, ${now.toLocaleString()} `

      await apiDeleteQuickSession(
        this.currentOrganizationScope,
        this.session.id,
        {
          name: conversationName,
        },
      )
      this.$router.push({ name: "inbox" })
    },
    async setupSession() {
      try {
        const alreadyCreatedPersonalSession = await apiGetQuickSession(
          this.currentOrganizationScope,
        )

        if (alreadyCreatedPersonalSession) {
          this.session = alreadyCreatedPersonalSession
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
  },
}
</script>
