<template>
  <MainContentBackoffice :loading="loading">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <h2 class="dashboard-header__title">{{ $t("backoffice.dashboard.page_title") }}</h2>
    </div>

    <!-- Platform Stats (not affected by filters) -->
    <DashboardStats
      :usersCount="usersCount"
      :organizationCount="organizationCount" />

    <!-- Filters -->
    <DashboardFilters
      :organizations="organizations"
      :timePeriodOptions="timePeriodOptions"
      :timePeriod="currentTimePeriod"
      :selectedOrganization="selectedOrganization"
      :startDate="startDate"
      :endDate="endDate"
      @update:timePeriod="currentTimePeriod = $event"
      @update:selectedOrganization="selectedOrganization = $event"
      @update:startDate="startDate = $event"
      @update:endDate="endDate = $event"
      @clear="clearFilters" />

    <!-- Filtered Stats (affected by filters) -->
    <DashboardKPIs
      :sessionsCount="sessionsCount"
      :mediasCount="mediasCount"
      :loading="kpiLoading" />

    <!-- Charts Section -->
    <div class="dashboard-charts" v-if="!kpiLoading">
      <!-- Live/Real-time Charts Row -->
      <div class="dashboard-charts__row">
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">
            {{ $t("backoffice.dashboard.charts.sessions_title") }}
          </h4>
          <BarChart
            :labels="chartLabels"
            :data="sessionsData"
            :dataTitle="$t('backoffice.dashboard.charts.sessions_title')" />
        </div>
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">
            {{ $t("backoffice.dashboard.charts.active_users_title") }}
          </h4>
          <BarChart
            :labels="chartLabels"
            :data="activeUsersData"
            :dataTitle="$t('backoffice.dashboard.charts.active_users_title')" />
        </div>
      </div>
      <!-- Media/Offline Charts Row -->
      <div class="dashboard-charts__row">
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">
            {{ $t("backoffice.dashboard.charts.medias_title") }}
          </h4>
          <BarChart
            :labels="chartLabels"
            :data="mediasData"
            :dataTitle="$t('backoffice.dashboard.charts.medias_title')" />
        </div>
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">
            {{ $t("backoffice.dashboard.charts.duration_title") }}
          </h4>
          <BarChart
            :labels="chartLabels"
            :data="durationData"
            :dataTitle="$t('backoffice.dashboard.charts.duration_title')" />
        </div>
      </div>
    </div>
    <div v-else class="dashboard-charts-loading">
      <Loading />
      <span>{{ $t("backoffice.dashboard.loading") }}</span>
    </div>
  </MainContentBackoffice>
</template>
<script>
import { apiGetAllUsers, apiGetAllOrganizations } from "@/api/admin.js"
import { apiGetPlatformKpiSeries } from "@/api/kpi.js"

import { platformRoleMixin } from "@/mixins/platformRole.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import BarChart from "@/components/molecules/BarChart.vue"
import Loading from "@/components/atoms/Loading.vue"
import DashboardStats from "@/components/backoffice/DashboardStats.vue"
import DashboardFilters from "@/components/backoffice/DashboardFilters.vue"
import DashboardKPIs from "@/components/backoffice/DashboardKPIs.vue"

export default {
  mixins: [platformRoleMixin],
  props: {},
  data() {
    return {
      loading: true,
      kpiLoading: false,
      usersCount: 0,
      organizationCount: 0,
      sessionsCount: 0,
      mediasCount: 0,
      kpiSeries: [],
      currentTimePeriod: "daily",
      // Filter state
      selectedOrganization: null,
      startDate: null,
      endDate: null,
      organizations: [],
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
      return
    }
    this.loadFiltersFromUrl()
    this.fetchPlatformStats()
    this.fetchOrganizations()
    this.fetchFilteredData()
  },
  methods: {
    async fetchPlatformStats() {
      this.loading = true
      await Promise.all([this.countUsers(), this.countOrganizations()])
      this.loading = false
    },
    async countUsers() {
      const req = await apiGetAllUsers()
      this.usersCount = req.count
    },
    async countOrganizations() {
      const req = await apiGetAllOrganizations()
      this.organizationCount = req.count
    },
    async fetchFilteredData() {
      this.kpiLoading = true
      try {
        const res = await apiGetPlatformKpiSeries(this.currentFilters)
        this.kpiSeries = res.data || []
        this.computeTotals()
      } catch (error) {
        console.error("Failed to fetch KPI series:", error)
        this.kpiSeries = []
      }
      this.kpiLoading = false
    },
    async fetchOrganizations() {
      const res = await apiGetAllOrganizations(0, { pageSize: 1000 })
      this.organizations = res.list || []
    },
    clearFilters() {
      this.selectedOrganization = null
      this.startDate = null
      this.endDate = null
    },
    updateUrlParams() {
      const query = {}
      if (this.currentTimePeriod !== "daily") query.step = this.currentTimePeriod
      if (this.selectedOrganization) query.org = this.selectedOrganization
      if (this.startDate) query.from = this.startDate
      if (this.endDate) query.to = this.endDate

      this.$router.replace({ query }).catch(() => {})
    },
    loadFiltersFromUrl() {
      const { step, org, from, to } = this.$route.query
      if (step) this.currentTimePeriod = step
      if (org) this.selectedOrganization = org
      if (from) this.startDate = from
      if (to) this.endDate = to
    },
    computeTotals() {
      this.sessionsCount = this.kpiSeries.reduce(
        (acc, item) => acc + (item.session?.totalConnections || 0),
        0,
      )
      this.mediasCount = this.kpiSeries.reduce(
        (acc, item) => acc + (item.transcription?.generated || 0),
        0,
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
      this.fetchFilteredData()
      this.updateUrlParams()
    },
    selectedOrganization() {
      this.fetchFilteredData()
      this.updateUrlParams()
    },
    startDate() {
      this.fetchFilteredData()
      this.updateUrlParams()
    },
    endDate() {
      this.fetchFilteredData()
      this.updateUrlParams()
    },
  },
  computed: {
    currentFilters() {
      return {
        step: this.currentTimePeriod,
        organizationId: this.selectedOrganization,
        startDate: this.startDate,
        endDate: this.endDate,
      }
    },
    timePeriodOptions() {
      return [
        {
          name: "daily",
          label: this.$t("backoffice.dashboard.time_period.day"),
        },
        {
          name: "monthly",
          label: this.$t("backoffice.dashboard.time_period.month"),
        },
        {
          name: "yearly",
          label: this.$t("backoffice.dashboard.time_period.year"),
        },
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
        Math.round((item.transcription?.duration || 0) / 3600),
      )
    },
    activeUsersData() {
      return this.kpiSeries.map((item) => item.session?.totalConnections || 0)
    },
  },
  components: {
    MainContentBackoffice,
    BarChart,
    Loading,
    DashboardStats,
    DashboardFilters,
    DashboardKPIs,
  },
}
</script>
<style lang="scss" scoped>
/* Dashboard Header */
.dashboard-header {
  margin-bottom: var(--md-gap);
  padding-bottom: var(--sm-gap);
  border-bottom: var(--border-block);
  animation: fadeInDown 0.3s ease-out;

  &__title {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
  }
}

/* Charts Grid */
.dashboard-charts {
  margin-top: var(--md-gap);
  animation: fadeInUp 0.6s ease-out;

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md-gap);
    margin-bottom: var(--md-gap);
  }

  &__item {
    flex: 1;
    min-width: 300px;
  }

  &__title {
    margin-bottom: var(--sm-gap);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.03em;
  }
}

/* Charts Loading State */
.dashboard-charts-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--xl-gap);
  gap: var(--md-gap);
  color: var(--text-secondary);
  background: var(--neutral-10);
  border-radius: 12px;
  border: var(--border-block);
  animation: pulse 1.5s ease-in-out infinite;
}


/* Keyframe Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header {
    &__title {
      font-size: var(--text-xl);
    }
  }

  .dashboard-charts__row {
    flex-direction: column;
  }

  .dashboard-charts__item {
    min-width: 100%;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .dashboard-header,
  .dashboard-charts,
  .dashboard-charts-loading {
    animation: none;
  }
}
</style>
