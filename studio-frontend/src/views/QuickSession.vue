<template>
  <SessionSetupMicrophone
    v-if="state == 'microphone-selection'"
    @start-session="startSession"
    @back="backToStart"></SessionSetupMicrophone>
  <SessionLiveMicrophone
    v-else-if="state == 'session-live'"
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
  apiSearchSessionByName,
  apiCreateSession,
  apiUpdateSession,
  apiDeleteSession,
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
      this.isSavingSession = true
      const now = new Date()
      const conversationName = `Meeting from ${userName(this.userInfo)}, ${now.toLocaleString()} `

      await apiDeleteSession(this.currentOrganizationScope, this.session.id, {
        name: conversationName,
      })
      this.$router.push({ name: "inbox" })
    },
    async setupSession() {
      try {
        const sessionName = `@${this.userInfo._id}`
        const alreadyCreatedPersonalSessions = await apiSearchSessionByName(
          this.currentOrganizationScope,
          sessionName,
        )

        if (alreadyCreatedPersonalSessions.length > 0) {
          this.session = alreadyCreatedPersonalSessions[0]
        } else {
          const channels = [
            {
              name: "Main",
              transcriberProfileId: this.$route.query.transcriberProfileId,
              translations: this.$route.query.translations ?? [],
              diarization: this.$route.query.diarization ?? false,
            },
          ]
          const res = await apiCreateSession(this.currentOrganizationScope, {
            name: sessionName,
            channels: channels,
            visibility: "private",
          })

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
