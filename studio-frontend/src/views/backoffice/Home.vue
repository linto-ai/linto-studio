<template>
  <MainContentBackoffice :loading="loading">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <h2 class="dashboard-header__title">{{ $t("backoffice.dashboard.page_title") }}</h2>
    </div>

    <!-- Summary Cards Row -->
    <div class="dashboard-stats">
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

    <!-- Filters Section -->
    <div class="dashboard-filters">
      <!-- Organization Filter -->
      <FormInput
        :field="{ label: $t('backoffice.dashboard.filters.organization') }"
        class="dashboard-filters__field">
        <template #custom-input="{ id, disabled }">
          <select
            :id="id"
            v-model="selectedOrganization"
            :disabled="disabled"
            class="dashboard-filters__select">
            <option :value="null">{{ $t("backoffice.dashboard.filters.all_organizations") }}</option>
            <option v-for="org in organizations" :key="org._id" :value="org._id">
              {{ org.name }}
            </option>
          </select>
        </template>
      </FormInput>

      <!-- Date Range - Start -->
      <FormInput
        :field="{ label: $t('backoffice.dashboard.filters.start_date'), type: 'date' }"
        class="dashboard-filters__field">
        <template #custom-input="{ id, disabled }">
          <input
            :id="id"
            type="date"
            v-model="startDate"
            :max="endDate || today"
            :disabled="disabled"
            class="dashboard-filters__date-input"
          />
        </template>
      </FormInput>

      <!-- Date Range - End -->
      <FormInput
        :field="{ label: $t('backoffice.dashboard.filters.end_date'), type: 'date' }"
        class="dashboard-filters__field">
        <template #custom-input="{ id, disabled }">
          <input
            :id="id"
            type="date"
            v-model="endDate"
            :min="startDate"
            :max="today"
            :disabled="disabled"
            class="dashboard-filters__date-input"
          />
        </template>
      </FormInput>

      <!-- Clear Filters Button -->
      <Button
        v-if="hasActiveFilters"
        @click="clearFilters"
        secondary
        small
        class="dashboard-filters__clear-btn">
        {{ $t("backoffice.dashboard.filters.clear") }}
      </Button>
    </div>

    <!-- Time Period Tabs -->
    <div class="dashboard-section">
      <h3 class="dashboard-section__title">
        {{ $t("backoffice.dashboard.title") }}
      </h3>
      <Tabs :tabs="timePeriodTabs" v-model="currentTimePeriod" secondary />
    </div>

    <!-- Charts Section -->
    <div class="dashboard-charts" v-if="!chartsLoading">
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
            {{ $t("backoffice.dashboard.charts.medias_title") }}
          </h4>
          <BarChart
            :labels="chartLabels"
            :data="mediasData"
            :dataTitle="$t('backoffice.dashboard.charts.medias_title')" />
        </div>
      </div>
      <div class="dashboard-charts__row">
        <div class="dashboard-charts__item">
          <h4 class="dashboard-charts__title">
            {{ $t("backoffice.dashboard.charts.duration_title") }}
          </h4>
          <BarChart
            :labels="chartLabels"
            :data="durationData"
            :dataTitle="$t('backoffice.dashboard.charts.duration_title')" />
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
import StatCard from "@/components/StatCard.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import BarChart from "@/components/molecules/BarChart.vue"
import Loading from "@/components/atoms/Loading.vue"
import Button from "@/components/atoms/Button.vue"
import FormInput from "@/components/molecules/FormInput.vue"

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
    this.fetchAll()
    this.fetchOrganizations()
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
        const res = await apiGetPlatformKpiSeries(this.currentFilters)
        this.kpiSeries = res.data || []
        this.computeTotals()
      } catch (error) {
        console.error("Failed to fetch KPI series:", error)
        this.kpiSeries = []
      }
      this.chartsLoading = false
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
      this.fetchKpiSeries()
      this.updateUrlParams()
    },
    selectedOrganization() {
      this.fetchKpiSeries()
      this.updateUrlParams()
    },
    startDate() {
      this.fetchKpiSeries()
      this.updateUrlParams()
    },
    endDate() {
      this.fetchKpiSeries()
      this.updateUrlParams()
    },
  },
  computed: {
    hasActiveFilters() {
      return this.selectedOrganization || this.startDate || this.endDate
    },
    today() {
      return new Date().toISOString().split('T')[0]
    },
    currentFilters() {
      return {
        step: this.currentTimePeriod,
        organizationId: this.selectedOrganization,
        startDate: this.startDate,
        endDate: this.endDate,
      }
    },
    timePeriodTabs() {
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
  components: { MainContentBackoffice, StatCard, Tabs, BarChart, Loading, Button, FormInput },
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

/* Stats Cards Grid */
.dashboard-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--md-gap);
  animation: fadeInUp 0.4s ease-out;
}

/* Dashboard Section */
.dashboard-section {
  margin-top: var(--lg-gap);
  animation: fadeIn 0.5s ease-out;

  &__title {
    margin-bottom: var(--md-gap);
    font-size: var(--text-lg);
    font-weight: 600;
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
    text-transform: uppercase;
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

/* Filters Section */
.dashboard-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--md-gap);
  align-items: flex-end;
  margin-top: var(--md-gap);
  margin-bottom: var(--md-gap);
  padding: var(--md-gap);
  background: var(--neutral-10);
  border-radius: 12px;
  border: var(--border-block);
  box-shadow: var(--shadow-1);
  transition: box-shadow 0.2s ease;
  animation: fadeIn 0.4s ease-out;

  &:hover {
    box-shadow: var(--shadow-2);
  }

  &__field {
    flex: 0 1 auto;
    min-width: 180px;
    max-width: 220px;
  }

  &__select,
  &__date-input {
    padding: 0.625rem 0.75rem;
    border: var(--border-input);
    border-radius: 6px;
    background: var(--background-primary);
    font-size: var(--text-sm);
    color: var(--text-primary);
    width: 100%;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover:not(:disabled) {
      border-color: var(--neutral-40);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-soft);
    }
  }

  &__clear-btn {
    align-self: flex-end;
    margin-bottom: 2px;
  }
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

  .dashboard-stats {
    flex-direction: column;
  }

  .dashboard-filters {
    flex-direction: column;
    align-items: stretch;

    &__field {
      max-width: none;
      width: 100%;
    }

    &__clear-btn {
      align-self: stretch;
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
  .dashboard-stats,
  .dashboard-section,
  .dashboard-charts,
  .dashboard-filters,
  .dashboard-charts-loading {
    animation: none;
  }

  .dashboard-filters {
    transition: none;
  }
}
</style>
