<template>
  <Loading v-if="loading || !quickSession" />
  <!-- <V2Layout
    v-else-if="state == 'microphone-selection'"
    :fullscreen="recover"
    box>
    <SessionSetupMicrophone
      ref="sessionSetupMicrophone"
      :recover="recover"
      @trash-session="trashSession"
      @save-session="onSaveSession"
      @start-session="startSession"
      @back="backToStart"></SessionSetupMicrophone>
  </V2Layout> -->

  <SessionLiveVisio
    v-else-if="quickSessionBot"
    :session="quickSession"
    :currentOrganizationScope="currentOrganizationScope">
    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small align-center">
        <div style="font-style: italic">
          {{ $t("quick_session.live_visio.status_recording_visio") }}
        </div>
        <div class="flex1"></div>
        <Button
          @click="onSaveBotSession"
          :disabled="isSavingSession"
          :label="$t('quick_session.live.save_button')"
          variant="primary"
          icon="stop"
          size="sm" />
      </div>
    </template>
  </SessionLiveVisio>

  <SessionLiveMicrophone
    v-else
    ref="sessionLiveMicrophone"
    @onSave="onSaveMicroSession"
    :currentOrganizationScope="currentOrganizationScope"
    :session="quickSession">
    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small align-center">
        <div class="flex1"></div>
        <button @click="onSaveMicroSession" :disabled="isSavingSession">
          <span class="label">{{ $t("quick_session.live.save_button") }}</span>
        </button>
      </div>
    </template>
  </SessionLiveMicrophone>
</template>
<script>
import { bus } from "@/main.js"
import { mapActions, mapGetters } from "vuex"

import {
  apiGetQuickSessionByOrganization,
  apiCreateQuickSession,
  apiDeleteQuickSession,
  getBotForChannelId,
  apiStopBot,
} from "@/api/session.js"
import { userName } from "@/tools/userName.js"
import { capitalizeFirstLetter } from "@/tools/capitalizeFirstLetter.js"

import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionLiveMicrophone from "@/components/SessionLiveMicrophone.vue"
import SessionLiveVisio from "@/components/SessionLiveVisio.vue"
import Loading from "@/components/atoms/Loading.vue"
import MainContent from "@/components/MainContent.vue"
import V2Layout from "@/layouts/v2-layout.vue"

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
      // selectedDeviceId: null,
      // state: null, // microphone-selection, session-live, session-live-visio
      // session: null,
      isSavingSession: false,
      // recover: sessionStorage.getItem("startQuickSession") !== "true",
      // selectedChannel: null,
      // selectedTranslations: null,
      // loading: true,
      // sessionBot: null,
    }
  },
  mounted() {
    // sessionStorage.setItem("startQuickSession", false)
    // this.fetchData()
  },
  computed: {
    ...mapGetters("quickSession", [
      "quickSession",
      "quickSessionBot",
      "loading",
    ]),
  },
  methods: {
    async fetchData() {
      this.session = await apiGetQuickSessionByOrganization(
        this.currentOrganizationScope,
      )

      if (this.session) {
        this.selectedChannel = this.session.channels[0]

        const botReq = await getBotForChannelId(
          this.currentOrganizationScope,
          this.selectedChannel.id,
        )
        if (
          botReq.status == "success" &&
          botReq.data &&
          botReq.data?.bots?.length > 0
        ) {
          this.sessionBot = botReq.data?.bots[0]
          this.state = "session-live-visio"
        } else {
          this.state = "microphone-selection"
        }

        this.loading = false
        this.selectedTranslations = "original"
      } else {
        // redirect to start page
        this.$router.push({
          name: "conversations create",
          query: {},
          params: {},
        })
      }
    },
    async startSession({ deviceId }) {
      this.selectedDeviceId = deviceId

      this.state = "session-live"
    },
    backToStart() {
      this.$router.push({ name: "conversations create" })
    },
    trashSession() {
      this.onSaveSession(true)
    },
    onSaveMicroSession(e) {
      this.onSaveSession(false)
    },
    async onSaveBotSession() {
      this.loading = true
      await apiStopBot(this.currentOrganizationScope, this.quickSessionBot.id)
      this.onSaveSession()
    },
    async onSaveSession(trash = false) {
      await this.$nextTick()
      this.isSavingSession = true
      const now = new Date()
      let conversationName = ""
      if (this.sessionBot) {
        conversationName = this.$t("quick_session.live_visio.default_name", {
          type: capitalizeFirstLetter(this.sessionBot.provider),
        })
      } else {
        conversationName = this.$t("quick_session.live.default_name")
      }

      const sessionToDelete = this.quickSession
      await apiDeleteQuickSession(
        this.currentOrganizationScope,
        sessionToDelete.id,
        {
          name: conversationName,
          trash,
          force: true,
        },
      )
      this.$router.push({
        name: "explore",
        params: { organizationId: this.currentOrganizationScope },
      })
    },
  },
  components: {
    SessionSetupMicrophone,
    SessionLiveMicrophone,
    SessionLiveVisio,
    MainContent,
    Loading,
    V2Layout,
  },
}
</script>
