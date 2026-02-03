<template>
  <div class="dashboard-kpis">
    <!-- Loading overlay -->
    <div v-if="loading" class="dashboard-kpis__loading-overlay">
      <Loading />
    </div>

    <!-- KPI Cards -->
    <div class="dashboard-kpis__cards" :class="{ 'dashboard-kpis__cards--loading': loading }">
      <StatCard
        :count="sessionsCount"
        :title="$t('backoffice.dashboard.sessions_count')"
        icon="broadcast" />
      <StatCard
        :count="mediasCount"
        :title="$t('backoffice.dashboard.medias_count')"
        icon="file-audio" />
    </div>
  </div>
</template>

<script>
import StatCard from "@/components/StatCard.vue"
import Loading from "@/components/atoms/Loading.vue"

export default {
  name: "DashboardKPIs",
  props: {
    sessionsCount: {
      type: Number,
      required: false,
      default: 0,
    },
    mediasCount: {
      type: Number,
      required: false,
      default: 0,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { StatCard, Loading },
}
</script>

<style lang="scss" scoped>
.dashboard-kpis {
  position: relative;
  margin-top: var(--sm-gap);
  margin-bottom: var(--md-gap);

  &__loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--background-primary-rgb, 255, 255, 255), 0.7);
    border-radius: 12px;
    z-index: 10;
  }

  &__cards {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md-gap);
    animation: fadeInUp 0.4s ease-out;
    transition: opacity 0.2s ease;
    justify-content: center;

    &--loading {
      opacity: 0.5;
    }

    .stat-card {
      flex: 1 1 200px;
      max-width: 280px;
    }
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

@media (max-width: 768px) {
  .dashboard-kpis__cards {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-kpis__cards {
    animation: none;
  }
}
</style>
