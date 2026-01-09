<template>
  <div class="dashboard-controls">
    <!-- Time Period Dropdown -->
    <FormInput
      :field="{ label: $t('backoffice.dashboard.time_period_label'), error: null }"
      class="dashboard-controls__field">
      <template #custom-input="{ id, disabled }">
        <select
          :id="id"
          :value="timePeriod"
          @change="$emit('update:timePeriod', $event.target.value)"
          :disabled="disabled"
          class="dashboard-controls__select">
          <option
            v-for="option in timePeriodOptions"
            :key="option.name"
            :value="option.name">
            {{ option.label }}
          </option>
        </select>
      </template>
    </FormInput>

    <!-- Organization Filter -->
    <FormInput
      :field="{ label: $t('backoffice.dashboard.filters.organization'), error: null }"
      class="dashboard-controls__field">
      <template #custom-input="{ id, disabled }">
        <select
          :id="id"
          :value="selectedOrganization"
          @change="$emit('update:selectedOrganization', $event.target.value || null)"
          :disabled="disabled"
          class="dashboard-controls__select">
          <option :value="null">{{ $t("backoffice.dashboard.filters.all_organizations") }}</option>
          <option v-for="org in organizations" :key="org._id" :value="org._id">
            {{ org.name }}
          </option>
        </select>
      </template>
    </FormInput>

    <!-- Date Range - Start -->
    <FormInput
      :value="startDate"
      @input="$emit('update:startDate', $event)"
      :field="{ label: $t('backoffice.dashboard.filters.start_date'), type: 'date', error: null, max: endDate || today }"
      class="dashboard-controls__field" />

    <!-- Date Range - End -->
    <FormInput
      :value="endDate"
      @input="$emit('update:endDate', $event)"
      :field="{ label: $t('backoffice.dashboard.filters.end_date'), type: 'date', error: null, min: startDate, max: today }"
      class="dashboard-controls__field" />

    <!-- Clear Filters Button -->
    <Button
      v-if="hasActiveFilters"
      @click="$emit('clear')"
      secondary
      small
      class="dashboard-controls__clear-btn">
      {{ $t("backoffice.dashboard.filters.clear") }}
    </Button>
  </div>
</template>

<script>
import FormInput from "@/components/molecules/FormInput.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "DashboardFilters",
  props: {
    organizations: {
      type: Array,
      required: true,
    },
    timePeriodOptions: {
      type: Array,
      required: true,
    },
    timePeriod: {
      type: String,
      required: true,
    },
    selectedOrganization: {
      type: String,
      default: null,
    },
    startDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
  },
  computed: {
    hasActiveFilters() {
      return this.selectedOrganization || this.startDate || this.endDate
    },
    today() {
      return new Date().toISOString().split("T")[0]
    },
  },
  components: { FormInput, Button },
}
</script>

<style lang="scss" scoped>
.dashboard-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--md-gap);
  align-items: center;
  margin: var(--md-gap) 0;
  padding: var(--md-gap);
  background: var(--neutral-10);
  border-radius: 12px;
  border: var(--border-block);
  animation: fadeIn 0.4s ease-out;

  &__field {
    flex: 0 1 auto;
    min-width: 150px;
    max-width: 200px;
  }

  &__select {
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .dashboard-controls {
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
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-controls {
    animation: none;
  }
}
</style>
