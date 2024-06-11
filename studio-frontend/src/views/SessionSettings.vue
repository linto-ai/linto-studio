<template>
  <MainContent noBreadcrumb :organizationPage="false" box>
    <template v-slot:breadcrumb-actions>
      <router-link :to="sessionListRoute" class="btn secondary">
        <span class="icon close"></span>
        <span class="label">{{
          $t("session.detail_page.back_to_listing")
        }}</span>
      </router-link>
      <div class="flex1 center-text" v-if="isPending">
        <span class="icon clock"></span>
        <span>{{ $t("session.detail_page.sessions_status.no_started") }}</span>
      </div>
      <router-link :to="settingsRoute" class="btn" v-if="isPending">
        <span class="label">{{ $t("session.detail_page.start_button") }}</span>
      </router-link>
    </template>

    <SessionSettingsContent v-if="sessionLoaded" :session="session" />
  </MainContent>
</template>
<script>
import { bus } from "../main.js"

import { sessionMixin } from "@/mixins/session.js"

import MainContent from "@/components/MainContent.vue"
import SessionSettingsContent from "../components/SessionSettingsContent.vue"

export default {
  mixins: [sessionMixin],
  props: {},
  data() {
    return {}
  },
  created() {
    // if not started, redirect to home
  },
  mounted() {},
  methods: {},
  components: {
    MainContent,
    SessionSettingsContent,
  },
}
</script>
