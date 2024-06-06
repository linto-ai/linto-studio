<template>
  <MainContent sidebar>
    <Tabs v-model="activeTab" :tabs="tabs"></Tabs>
    <Loading v-if="loading" />
    <ErrorPage v-else-if="error" :error="error" />
    <div v-else>
      <div v-if="startedSessions.length > 0" class="flex col gap-medium">
        <SessionListLine
          v-for="session in startedSessions"
          :key="session.id"
          :session="session"></SessionListLine>
      </div>
      <div class="flex col align-center justify-center flex1" v-else>
        <h2 class="center-text">
          {{ $t("session.list_page.no_sessions") }}
        </h2>
        <!-- <router-link
          :title="$t('navigation.conversation.create')"
          to="/interface/conversations/create"
          class="btn green-border">
          <span class="label">{{ $t("navigation.conversation.create") }}</span>
          <span class="icon new"></span>
        </router-link> -->
      </div>
    </div>
  </MainContent>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import { apiGetStartedSessions, apiGetFutureSessions } from "@/api/session.js"

import MainContent from "@/components/MainContent.vue"
import Tabs from "@/components/Tabs.vue"
import Loading from "../components/Loading.vue"
import ErrorPage from "../components/ErrorPage.vue"
import SessionListLine from "../components/SessionListLine.vue"

export default {
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activeTab: "started",
      tabs: [
        {
          name: "started",
          label: this.$i18n.t("session.list_page.tabs.ongoing_sessions"),
          icon: "reload",
        },
        {
          name: "completed",
          label: this.$i18n.t("session.list_page.tabs.scheduled_sessions"),
          icon: "clock",
        },
      ],
      loading: false,
      error: null,
      startedSessions: [],
    }
  },
  mounted() {
    this.fetchStartedSessions()
  },
  methods: {
    async fetchStartedSessions() {
      this.loading = true
      try {
        const sessions = await apiGetStartedSessions(
          this.currentOrganizationScope
        )
        this.startedSessions = sessions.sessions
      } catch (e) {
        console.error(e)
        this.error = e
      } finally {
        this.loading = false
      }
    },
    async fetchFutureSessions() {
      this.loading = true
      try {
        const sessions = await apiGetFutureSessions(
          this.currentOrganizationScope
        )
        this.startedSessions = sessions.sessions
      } catch (e) {
        console.error(e)
        this.error = e
      } finally {
        this.loading = false
      }
    },
  },
  watch: {
    activeTab(value) {
      if (value === "started") {
        this.fetchStartedSessions()
      } else if (value === "completed") {
        this.fetchFutureSessions()
      }
    },
  },
  components: {
    Fragment,
    MainContent,
    Tabs,
    Loading,
    ErrorPage,
    SessionListLine,
  },
}
</script>
