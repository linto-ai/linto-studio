<template>
  <MainContent noBreadcrumb :organizationPage="false" fullwidthContent sidebar>
    <template v-slot:breadcrumb-actions>
      <router-link :to="sessionListRoute" class="btn secondary">
        <span class="icon close"></span>
        <span class="label">{{
          $t("session.detail_page.back_to_listing")
        }}</span>
      </router-link>

      <div
        class="flex flex1 center-text align-center justify-center"
        v-if="isPending">
        <span class="icon clock"></span>
        <span>{{ $t("session.detail_page.sessions_status.no_started") }}</span>
      </div>

      <div
        class="flex flex1 center-text align-center justify-center"
        v-if="isStarted">
        <span class="icon reload"></span>
        <span>{{ $t("session.detail_page.sessions_status.started") }}</span>
      </div>

      <router-link :to="settingsRoute" class="btn" v-if="isAtLeastMaintainer">
        <span class="icon settings"></span>
        <span class="label">{{
          $t("session.detail_page.settings_button")
        }}</span>
      </router-link>
    </template>

    <template v-slot:sidebar>
      <div class="flex col medium-padding">
        <SessionChannelsSelector
          v-if="sessionLoaded && selectedChannel"
          :channels="channels"
          v-model="selectedChannel"
          class="session-selector"></SessionChannelsSelector>
      </div>
    </template>

    <div class="relative flex flex1 col">
      <SessionNotStarted v-if="isPending" />

      <Loading v-else-if="!sessionLoaded || !selectedChannel" />

      <SessionLiveContent
        v-else
        :session="session"
        :selectedChannel="selectedChannel" />
    </div>
  </MainContent>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import { sessionMixin } from "@/mixins/session.js"
import { orgaRoleMixin } from "@/mixins/orgaRole"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "@/components/SessionNotStarted.vue"
import SessionChannelsSelector from "@/components/SessionChannelsSelector.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import Loading from "@/components/Loading.vue"

export default {
  mixins: [sessionMixin, orgaRoleMixin],
  props: {},
  data() {
    return {
      selectedChannel: null,
    }
  },
  created() {
    // TODO:
    // if not started, redirect to home
    // if stopped, redirect to conversation
  },
  mounted() {},
  watch: {
    sessionLoaded() {
      if (this.sessionLoaded) {
        this.selectedChannel = this.channels[0]
      }
    },
  },
  methods: {},
  components: {
    Fragment,
    MainContent,
    SessionNotStarted,
    SessionChannelsSelector,
    SessionLiveContent,
    Loading,
  },
}
</script>
