<template>
  <div v-if="loading || !quickSession"></div>
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
      isSavingSession: false,
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
  },
  methods: {
    ...mapActions("quickSession", ["saveQuickSession"]),
    async saveSession() {
      await this.saveQuickSession()
      this.$router.push({
        name: "explore",
        params: { organizationId: this.currentOrganizationScope },
      })
    },
  },
  watch: {},
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
