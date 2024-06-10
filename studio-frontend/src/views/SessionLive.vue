<template>
  <MainContent noBreadcrumb :organizationPage="false" fullwidthContent>
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
      <router-link :to="settingsRoute" class="btn">
        <span class="icon settings"></span>
        <span class="label">{{
          $t("session.detail_page.settings_button")
        }}</span>
      </router-link>
    </template>

    <SessionNotStarted v-if="isPending" />
  </MainContent>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import { sessionMixin } from "@/mixins/session.js"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "../components/SessionNotStarted.vue"

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
  components: { Fragment, MainContent, SessionNotStarted },
}
</script>
