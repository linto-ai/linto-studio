<template>
  <Box
    type="flat"
    border-color="neutral-20"
    class="onboarding-pricing-row flex wrap align-center justify-between gap-medium">
    <div class="flex1 flex col gap-tiny">
      <h2 :id="titleId" class="onboarding-pricing-row__title card-title">
        {{ title }}
      </h2>
      <div :id="detailsId" class="flex col gap-tiny">
        <p
          v-for="detail in details"
          :key="detail"
          class="onboarding-pricing-row__detail">
          {{ detail }}
        </p>
      </div>
    </div>
    <div class="flex col align-end gap-tiny">
      <!-- The ids let an interactive value (a counter) be labelled by the row -->
      <slot name="value" :title-id="titleId" :details-id="detailsId">
        <span class="card-title">{{ value }}</span>
      </slot>
      <p
        v-if="note"
        class="onboarding-pricing-row__note"
        :class="`onboarding-pricing-row__note--${noteVariant}`">
        {{ note }}
      </p>
    </div>
  </Box>
</template>
<script>
import Box from "@/components/atoms/Box.vue"
import { generateId } from "@/tools/generateId"

export default {
  name: "OnboardingPricingRow",
  components: { Box },
  props: {
    title: { type: String, required: true },
    // Muted lines under the title
    details: { type: Array, default: () => [] },
    // Shown on the right unless the value slot replaces it
    value: { type: String, default: "" },
    // Small line under the value
    note: { type: String, default: "" },
    noteVariant: {
      type: String,
      default: "muted",
      validator: (value) => ["muted", "highlight"].includes(value),
    },
  },
  data() {
    const id = generateId()
    return {
      titleId: `pricing-row-title-${id}`,
      detailsId: `pricing-row-details-${id}`,
    }
  },
}
</script>

<style lang="scss" scoped>
.onboarding-pricing-row {
  padding: var(--medium-gap);
}

.onboarding-pricing-row__title,
.onboarding-pricing-row__detail,
.onboarding-pricing-row__note {
  margin: 0;
}

.onboarding-pricing-row__detail,
.onboarding-pricing-row__note--muted {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.onboarding-pricing-row__note--highlight {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--primary-color);
}
</style>
