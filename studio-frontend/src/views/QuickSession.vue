<template>
  <div class="flex1 flex col">
    <div v-if="loading || !quickSession || systemLoading"></div>
    <Loading v-else-if="saving" />

    <SessionLiveVisio
      v-else-if="quickSessionBot"
      :quickSessionBot="quickSessionBot"
      @onSave="saveSession"
      :session="quickSession"
      :currentOrganizationScope="currentOrganizationScope">
    </SessionLiveVisio>

    <SessionLiveMicrophone
      v-else
      ref="sessionLiveMicrophone"
      @onSave="saveSession"
      :currentOrganizationScope="currentOrganizationScope"
      :session="quickSession">
    </SessionLiveMicrophone>
    <ModalSaveQuickSession
      v-model="isModalSaveOpen"
      :placeholder="defaultName" />
  </div>
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

import SessionLiveMicrophone from "@/components/SessionLiveMicrophone.vue"
import SessionLiveVisio from "@/components/SessionLiveVisio.vue"
import Loading from "@/components/atoms/Loading.vue"
import ModalSaveQuickSession from "@/components/ModalSaveQuickSession.vue"

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
      isSavingSession: false,
      isModalSaveOpen: false,
      defaultName: "",
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
      "saving",
    ]),
    ...mapGetters("system", {
      systemLoading: "isLoading",
    }),
  },
  methods: {
    ...mapActions("quickSession", ["saveQuickSession"]),
    async saveSession() {
      if (this.quickSessionBot) {
        this.defaultName = this.$t("quick_session.live_visio.default_name", {
          type: this.quickSessionBot.provider,
        })
      } else {
        this.defaultName = this.$t("quick_session.live.default_name")
        this.$refs.sessionLiveMicrophone.pauseMicrophone()
      }

      this.isSavingSession = true
      this.isModalSaveOpen = true
    },
  },
  watch: {},
  components: {
    SessionLiveMicrophone,
    SessionLiveVisio,
    Loading,
    ModalSaveQuickSession,
  },
}
</script>
