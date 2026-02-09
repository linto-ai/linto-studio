<template>
  <section class="flex col gap-small organization-stats">
    <h2>{{ $t("organisation.kpi.title") }}</h2>
    <Tabs :tabs="tabs" v-model="currentTab" variant="secondary"></Tabs>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="">
      <h3>{{ $t("organisation.kpi.sessions_title") }}</h3>
      <BarChart
        :labels="labels"
        :data="sessionAvgWatchTimeData"
        :dataTitle="$t('organisation.kpi.session_avg_watch_time')" />
      <BarChart
        :labels="labels"
        :data="sessionTotalConnectionsData"
        :dataTitle="$t('organisation.kpi.session_total_connections')" />
      <h3>{{ $t("organisation.kpi.media_title") }}</h3>
      <BarChart
        :labels="labels"
        :data="transcriptionAvgDurationData"
        :dataTitle="$t('organisation.kpi.transcription_avg_duration')" />
      <BarChart
        :labels="labels"
        :data="transcriptionCountData"
        :dataTitle="$t('organisation.kpi.transcription_count')" />
    </div>

    <!-- <StatCard
      :count="mediaCount"
      :title="$t('organisation.organization_stats.medias')"
      icon="transcription" /> -->
  </section>
</template>
<script>
import { bus } from "@/main.js"
import StatCard from "./StatCard.vue"
import { getKpiByOrganization } from "@/api/kpi.js"
import { apiCountConversation } from "@/api/conversation.js"
import BarChart from "./molecules/BarChart.vue"
import Tabs from "@/components/molecules/Tabs.vue"

export default {
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      mediaCount: null,
      kpiDaily: null,
      error: null,
      loading: true,
      tabs: [
        { name: "daily", label: this.$t("organisation.kpi.time_step.day") },
        { name: "monthly", label: this.$t("organisation.kpi.time_step.month") },
        // { name: "year", label: this.$t("organisation.kpi.time_step.year") },
      ],
      currentTab: "daily",
    }
  },
  mounted() {
    this.fetchStats()
  },
  methods: {
    async fetchStats() {
      this.loading = true
      const reqKpi = await getKpiByOrganization(
        this.organizationId,
        this.currentTab,
      )

      if (reqKpi.status === "success") {
        this.kpiDaily = reqKpi.data.result
      } else {
        this.error = this.$t("organisation.kpi.error")
      }
      this.loading = false
    },
  },
  computed: {
    sessionWatchTimeData() {
      return this.kpiDaily.map((item) => item.session.watchTime)
    },
    sessionAvgWatchTimeData() {
      return this.kpiDaily.map(
        (item) => item.session.watchTime / item.session.totalConnections,
      )
    },
    sessionTotalConnectionsData() {
      return this.kpiDaily.map((item) => item.session.totalConnections)
    },
    transcriptionCountData() {
      return this.kpiDaily.map((item) => item.transcription.generated)
    },
    transcriptionDurationData() {
      return this.kpiDaily.map((item) => item.transcription.duration)
    },
    transcriptionAvgDurationData() {
      return this.kpiDaily.map(
        (item) => item.transcription.duration / item.transcription.generated,
      )
    },
    labels() {
      return this.kpiDaily.map((item) => {
        const date = new Date(item.date)
        if (this.currentTab === "daily") {
          return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        } else if (this.currentTab === "monthly") {
          return date.toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })
        }
      })
    },
  },
  watch: {
    currentTab() {
      this.fetchStats()
    },
  },
  components: {
    StatCard,
    BarChart,
    Tabs,
  },
}
</script>
