<template>
  <LayoutV2>
    <Tabs v-model="activeTab" :tabs="tabs"></Tabs>
    <SessionWeekList
      v-if="activeTab == 'timeline'"
      :currentOrganizationScope="currentOrganizationScope"></SessionWeekList>
    <SessionActiveList
      v-else
      :currentOrganizationScope="currentOrganizationScope"></SessionActiveList>
  </LayoutV2>
</template>
<script>
import { bus } from "@/main.js"

import {
  apiCountFutureSessions,
  apiCountActiveSessions,
} from "@/api/session.js"

import MainContent from "@/components/MainContent.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import Loading from "@/components/atoms/Loading.vue"
import ErrorPage from "@/components/ErrorPage.vue"
import SessionListLine from "@/components/SessionListLine.vue"
import SessionWeekList from "@/components/SessionWeekList.vue"
import SessionActiveList from "@/components/SessionActiveList.vue"
import LayoutV2 from "@/layouts/v2-layout.vue"

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

      loading: false,
      error: null,
      countActiveSessions: 0,
      countFutureSessions: 0,
      // startedSessions: [],
      // activeSessions: [],
    }
  },
  mounted() {
    //this.fetchCountActiveSessions()
  },
  methods: {
    async fetchCountActiveSessions() {
      this.loading = true
      try {
        const count = await apiCountActiveSessions(
          this.currentOrganizationScope,
        )
        this.countActiveSessions = count
      } catch (e) {
        console.error(e)
        this.error = e
      } finally {
        this.loading = false
      }
    },
    async fetchCountFutureSessions() {
      this.loading = true
      try {
        const count = await apiCountFutureSessions(
          this.currentOrganizationScope,
        )
        this.countFutureSessions = count
      } catch (e) {
        console.error(e)
        this.error = e
      } finally {
        this.loading = false
      }
    },
    // async fetchFutureSessions() {
    //   this.loading = true
    //   try {
    //     const sessions = await apiGetFutureSessions(
    //       this.currentOrganizationScope,
    //     )
    //     this.startedSessions = sessions.sessions
    //   } catch (e) {
    //     console.error(e)
    //     this.error = e
    //   } finally {
    //     this.loading = false
    //   }
    // },
  },
  watch: {
    activeTab(value) {},
  },
  computed: {
    tabs() {
      return [
        {
          name: "started",
          label: this.$i18n.global.t("session.list_page.tabs.ongoing_sessions"),
          icon: "broadcast",
          //badge: this.countActiveSessions,
        },
        {
          name: "timeline",
          label: this.$i18n.global.t("session.list_page.tabs.scheduled_sessions"),
          icon: "clock",
          //badge: this.countFutureSessions,
        },
      ]
    },
  },
  components: {
    Fragment,
    MainContent,
    Tabs,
    Loading,
    ErrorPage,
    SessionListLine,
    SessionWeekList,
    SessionActiveList,
    LayoutV2,
  },
}
</script>
