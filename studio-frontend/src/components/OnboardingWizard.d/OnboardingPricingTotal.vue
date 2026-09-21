<template>
  <Box
    type="flat"
    border-color="neutral-20"
    background-color="primary-soft"
    class="onboarding-pricing-total flex wrap align-center justify-between gap-medium">
    <div class="flex1 flex col gap-tiny">
      <p class="onboarding-pricing-total__title card-title">{{ title }}</p>
      <p class="onboarding-pricing-total__detail">{{ detail }}</p>
    </div>
    <output class="onboarding-pricing-total__amount">{{ amount }}</output>
  </Box>
</template>
<script>
import Box from "@/components/atoms/Box.vue"

export default {
  name: "OnboardingPricingTotal",
  components: { Box },
  props: {
    title: { type: String, required: true },
    detail: { type: String, default: "" },
    // Already formatted with its currency
    amount: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-pricing-total {
  padding: var(--medium-gap);
}

.onboarding-pricing-total__title,
.onboarding-pricing-total__detail {
  margin: 0;
}

.onboarding-pricing-total__detail {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.onboarding-pricing-total__amount {
  font-size: var(--text-2xl);
  font-weight: 700;
  white-space: nowrap;
}
</style>
