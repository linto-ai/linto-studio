<template>
  <MainContentBackoffice :loading="loading">
    <!-- Summary Cards Row -->
    <div class="flex gap-medium flex-wrap">
      <StatCard
        :count="usersCount"
        title="Users"
        icon="profile"
        :to="{ name: 'backoffice-userList' }" />
      <StatCard
        :count="organizationCount"
        title="Organizations"
        icon="work"
        :to="{ name: 'backoffice-organizationList' }" />
      <StatCard
        :count="sessionsCount"
        :title="$t('backoffice.dashboard.sessions_count')"
        icon="broadcast" />
      <StatCard
        :count="mediasCount"
        :title="$t('backoffice.dashboard.medias_count')"
        icon="transcription" />
    </div>

    <!-- Time Period Tabs -->
    <div class="dashboard-section">
      <h3 class="dashboard-section__title">{{ $t('backoffice.dashboard.title') }}</h3>
      <Tabs :tabs="timePeriodTabs" v-model="currentTimePeriod" secondary />
    </div>

    <!-- Charts Section -->
    <div class="dashboard-charts" v-if="!chartsLoading">
      <div class="dashboard-charts__row">
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">{{ $t('backoffice.dashboard.charts.sessions_title') }}</h4>
          <BarChart
            :labels="chartLabels"
            :data="sessionsData"
            :dataTitle="$t('backoffice.dashboard.charts.sessions_title')" />
        </div>
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">{{ $t('backoffice.dashboard.charts.medias_title') }}</h4>
          <BarChart
            :labels="chartLabels"
            :data="mediasData"
            :dataTitle="$t('backoffice.dashboard.charts.medias_title')" />
        </div>
      </div>
      <div class="dashboard-charts__row">
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">{{ $t('backoffice.dashboard.charts.duration_title') }}</h4>
          <BarChart
            :labels="chartLabels"
            :data="durationData"
            :dataTitle="$t('backoffice.dashboard.charts.duration_title')" />
        </div>
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">{{ $t('backoffice.dashboard.charts.active_users_title') }}</h4>
          <BarChart
            :labels="chartLabels"
            :data="activeUsersData"
            :dataTitle="$t('backoffice.dashboard.charts.active_users_title')" />
        </div>
      </div>
    </div>
    <div v-else class="dashboard-charts-loading">
      <Loading />
      <span>{{ $t('backoffice.dashboard.loading') }}</span>
    </div>
  </MainContentBackoffice>
</template>
<script>
import { apiGetAllUsers, apiGetAllOrganizations } from "@/api/admin.js"
import { apiGetPlatformKpiSeries } from "@/api/kpi.js"

import { platformRoleMixin } from "@/mixins/platformRole.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import StatCard from "@/components/StatCard.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import BarChart from "@/components/molecules/BarChart.vue"
import Loading from "@/components/atoms/Loading.vue"

export default {
  mixins: [platformRoleMixin],
  props: {},
  data() {
    return {
      loading: true,
      chartsLoading: true,
      usersCount: 0,
      organizationCount: 0,
      sessionsCount: 0,
      mediasCount: 0,
      kpiSeries: [],
      currentTimePeriod: "daily",
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
    this.fetchAll()
  },
  methods: {
    async fetchAll() {
      this.loading = true
      await this.countUsers()
      await this.countOrganizations()
      this.loading = false
      await this.fetchKpiSeries()
    },
    async countUsers() {
      const req = await apiGetAllUsers()
      this.usersCount = req.count
    },
    async countOrganizations() {
      const req = await apiGetAllOrganizations()
      this.organizationCount = req.count
    },
    async fetchKpiSeries() {
      this.chartsLoading = true
      try {
        const res = await apiGetPlatformKpiSeries(this.currentTimePeriod)
        this.kpiSeries = res.data || []
        this.computeTotals()
      } catch (error) {
        console.error("Failed to fetch KPI series:", error)
        this.kpiSeries = []
      }
      this.chartsLoading = false
    },
    computeTotals() {
      this.sessionsCount = this.kpiSeries.reduce(
        (acc, item) => acc + (item.session?.totalConnections || 0),
        0
      )
      this.mediasCount = this.kpiSeries.reduce(
        (acc, item) => acc + (item.transcription?.generated || 0),
        0
      )
    },
    formatDate(dateStr) {
      if (!dateStr) return ""
      const date = new Date(dateStr)
      if (this.currentTimePeriod === "yearly") {
        return date.getFullYear().toString()
      } else if (this.currentTimePeriod === "monthly") {
        return date.toLocaleDateString(this.$i18n.locale, {
          month: "short",
          year: "2-digit",
        })
      } else {
        return date.toLocaleDateString(this.$i18n.locale, {
          month: "short",
          day: "numeric",
        })
      }
    },
  },
  watch: {
    currentTimePeriod() {
      this.fetchKpiSeries()
    },
  },
  computed: {
    timePeriodTabs() {
      return [
        { name: "daily", label: this.$t("backoffice.dashboard.time_period.day") },
        { name: "monthly", label: this.$t("backoffice.dashboard.time_period.month") },
        { name: "yearly", label: this.$t("backoffice.dashboard.time_period.year") },
      ]
    },
    chartLabels() {
      return this.kpiSeries.map((item) => this.formatDate(item.date))
    },
    sessionsData() {
      return this.kpiSeries.map((item) => item.session?.totalConnections || 0)
    },
    mediasData() {
      return this.kpiSeries.map((item) => item.transcription?.generated || 0)
    },
    durationData() {
      return this.kpiSeries.map((item) =>
        Math.round((item.transcription?.duration || 0) / 3600)
      )
    },
    activeUsersData() {
      return this.kpiSeries.map((item) => item.session?.totalConnections || 0)
    },
  },
  components: { MainContentBackoffice, StatCard, Tabs, BarChart, Loading },
}
</script>
<style lang="scss" scoped>
.dashboard-section {
  margin-top: 2rem;

  &__title {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.dashboard-charts {
  margin-top: 1.5rem;

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__item {
    flex: 1;
    min-width: 300px;
  }

  &__title {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-secondary);
  }
}

.dashboard-charts-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: var(--text-secondary);
}
</style>
