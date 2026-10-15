<template>
  <form class="flex col" novalidate @submit.prevent="submit">
    <div class="onboarding-reactivation__body flex col gap-medium">
      <header class="flex col gap-tiny">
        <h1 class="onboarding-reactivation__title">
          {{ $t("onboarding.reactivation.title", { plan: plan.displayName }) }}
        </h1>
        <p class="onboarding-reactivation__description">
          {{
            $t("onboarding.reactivation.description", {
              name: organizationName,
            })
          }}
        </p>
      </header>

      <OnboardingBillingPeriod
        class="onboarding-reactivation__period"
        :value="billingPeriod"
        @input="$emit('change-period', $event)" />

      <OnboardingSeatsPricing
        v-model="seats"
        :plan="plan"
        :billing-period="billingPeriod"
        :min-seats="minSeats" />
    </div>

    <footer
      class="onboarding-reactivation__footer flex wrap align-center justify-between gap-small">
      <p v-if="error" class="onboarding-reactivation__error" role="alert">
        {{ error }}
      </p>
      <Button
        type="button"
        variant="secondary"
        :disabled="loading"
        @click="$emit('cancel')">
        {{ $t("billing.cancel") }}
      </Button>
      <Button
        type="submit"
        variant="primary"
        icon-right="lock"
        :loading="loading"
        :disabled="loading">
        {{ $t("onboarding.organization.submit") }}
      </Button>
    </footer>
  </form>
</template>
<script>
import OnboardingBillingPeriod from "./OnboardingBillingPeriod.vue"
import OnboardingSeatsPricing from "./OnboardingSeatsPricing.vue"

// Buys back the per-seat plan a team organization lost, for that same
// organization: its name is known, only the period and the seats are asked.
export default {
  name: "OnboardingReactivationStep",
  components: { OnboardingBillingPeriod, OnboardingSeatsPricing },
  props: {
    // Per-seat entry of the plan catalog (Business)
    plan: { type: Object, required: true },
    organizationName: { type: String, required: true },
    billingPeriod: { type: String, required: true },
    // Seats the step starts on (computeReactivationDefaults)
    defaultSeats: { type: Number, required: true },
    minSeats: { type: Number, required: true },
    loading: { type: Boolean, default: false },
    error: { type: String, default: "" },
  },
  data() {
    return {
      seats: Math.max(this.defaultSeats, this.minSeats),
    }
  },
  methods: {
    submit() {
      this.$emit("submit", this.seats)
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-reactivation__body {
  padding: var(--large-gap);
}

.onboarding-reactivation__title {
  margin: 0;
  font-size: var(--text-2xl);
}

.onboarding-reactivation__description {
  margin: 0;
  color: var(--text-secondary);
}

.onboarding-reactivation__period {
  align-self: flex-start;
}

.onboarding-reactivation__footer {
  padding: var(--medium-gap) var(--large-gap);
  border-top: var(--border-block);
  background: var(--neutral-10);
}

.onboarding-reactivation__error {
  flex-basis: 100%;
  margin: 0;
  font-size: var(--text-sm);
  color: var(--danger-color);
}
</style>
