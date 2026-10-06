<template>
  <UsageTile
    class="quota-meter"
    :label="label"
    :icon="icon"
    :value="formatAmount(used)"
    :detail="detailLabel">
    <UsageBar v-if="!isUnlimited" :value="used" :max="limit" />
  </UsageTile>
</template>

<script>
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"
import { isQuotaUnlimited } from "@/tools/billingMeters"
import UsageBar from "./UsageBar.vue"

export default {
  name: "QuotaMeter",
  components: { UsageBar },
  props: {
    label: { type: String, required: true },
    icon: { type: String, default: null },
    used: { type: Number, default: 0 },
    // null/undefined limit means unlimited, as does a minutes limit above
    // UNLIMITED_MINUTES_THRESHOLD (see isQuotaUnlimited).
    limit: { type: Number, default: null },
    unit: { type: String, default: "count" }, // "minutes" | "count"
  },
  computed: {
    isUnlimited() {
      return isQuotaUnlimited(this.limit, this.unit)
    },
    detailLabel() {
      if (this.isUnlimited) return this.$t("billing.unlimited")
      return this.$t("billing.quota_limit_this_month", {
        limit: this.formatAmount(this.limit),
      })
    },
  },
  methods: {
    formatAmount(value) {
      return this.unit === "minutes"
        ? formatMinutesDuration(value)
        : String(value)
    },
  },
}
</script>
