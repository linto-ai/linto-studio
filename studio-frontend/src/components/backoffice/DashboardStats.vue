<template>
  <div class="dashboard-stats dashboard-stats--platform">
    <StatCard
      :count="usersCount"
      :title="$t('backoffice.dashboard.users')"
      icon="users"
      :to="{ name: 'backoffice-userList' }" />
    <StatCard
      :count="organizationCount"
      :title="$t('backoffice.dashboard.organizations')"
      icon="buildings"
      :to="{ name: 'backoffice-organizationList' }" />
  </div>
</template>

<script>
import StatCard from "@/components/StatCard.vue"

export default {
  name: "DashboardStats",
  props: {
    usersCount: {
      type: Number,
      required: false,
      default: 0,
    },
    organizationCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  components: { StatCard },
}
</script>

<style lang="scss" scoped>
.dashboard-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--md-gap);
  animation: fadeInUp 0.4s ease-out;
  justify-content: center;

  &--platform {
    margin-bottom: var(--sm-gap);
  }

  .stat-card {
    flex: 1 1 200px;
    max-width: 280px;
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
  .dashboard-stats {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-stats {
    animation: none;
  }
}
</style>
