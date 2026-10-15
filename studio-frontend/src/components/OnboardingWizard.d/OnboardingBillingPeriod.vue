<template>
  <SegmentedControl
    :value="value"
    :options="periodOptions"
    :aria-label="$t('onboarding.billing_period.label')"
    @input="$emit('input', $event)" />
</template>
<script>
import SegmentedControl from "@/components/molecules/SegmentedControl.vue"

// Monthly or annual billing (v-model: "monthly" | "annual").
export default {
  name: "OnboardingBillingPeriod",
  components: { SegmentedControl },
  props: {
    value: { type: String, required: true },
  },
  computed: {
    periodOptions() {
      return [
        {
          name: "monthly",
          label: this.$t("onboarding.billing_period.monthly"),
        },
        { name: "annual", label: this.$t("onboarding.billing_period.annual") },
      ]
    },
  },
}
</script>
