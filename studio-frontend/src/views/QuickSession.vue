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
  <SessionSetupVisio
    v-else-if="state == 'visio-setup'"
    @start-session="startSessionVisio"
    @back="backToStart"></SessionSetupVisio>

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

  <SessionLiveVisio
    v-else-if="state == 'session-live-visio'"
    :session="session"
    :currentOrganizationScope="currentOrganizationScope"
    :visioType="visioType"
    :visioUrl="visioUrl">
    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small align-center">
        <div class="flex1"></div>
        <button @click="onSaveSession" :disabled="isSavingSession">
          <span class="label">{{ $t("quick_session.live.save_button") }}</span>
        </button>
      </div>
    </template>
  </SessionLiveVisio>
</template>
<script>
import { bus } from "../main.js"

import {
  apiGetQuickSessionByOrganization,
  apiCreateQuickSession,
  apiDeleteQuickSession,
  apiStartBot,
  apiStopBot,
} from "@/api/session.js"
import { userName } from "@/tools/userName.js"

import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionLiveMicrophone from "@/components/SessionLiveMicrophone.vue"
import SessionSetupVisio from "@/components/SessionSetupVisio.vue"
import SessionLiveVisio from "@/components/SessionLiveVisio.vue"
import Loading from "@/components/Loading.vue"
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
    let state = "microphone-selection"
    if (this.$route.query.source === "visio") {
      state = "visio-setup"
    }
    return {
      selectedDeviceId: null,
      state, // microphone-selection, session-live, visio-setup
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
      const isSetup = await this.setupSession()
      if (isSetup) {
        this.state = "session-live"
      }
    },
    async startSessionVisio({ visioType, visioLink }) {
      console.log("startSessionVisio", visioType, visioLink)
      const isSetup = await this.setupSession()
      if (isSetup) {
        let resBot = await apiStartBot(
          this.currentOrganizationScope,
          this.session.id,
          {
            channelId: this.session.channels[0].id,
            botType: visioType,
            url: visioLink,
          },
        )

        if (resBot.status == "success") {
          this.state = "session-live-visio"
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t("quick_session.setup_visio.error_bot_setup"),
            timeout: null,
          })
        }
      }
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
        //this.connectToWebsocket()
        return true
      } catch (error) {
        console.error(error)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t("session.create_page.error_message"),
          timeout: null,
        })
        return false
      }
    },
  },
  components: {
    SessionSetupMicrophone,
    SessionLiveMicrophone,
    SessionSetupVisio,
    SessionLiveVisio,
    Loading,
  },
}
</script>
