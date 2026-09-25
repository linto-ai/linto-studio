<template>
  <UsageTile
    class="live-credit-status"
    :label="$t('billing.live.title')"
    :value="valueLabel"
    :detail="detailLabel">
    <span
      v-if="expiresAtLabel && !unmetered"
      class="live-credit-status__expiry">
      {{ $t("billing.live.expires") }} : {{ expiresAtLabel }}
    </span>
  </UsageTile>
</template>

<script>
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

// Live-transcription minutes are a prepaid credit balance, not a
// period quota: no used/limit ratio to show as a progress bar, so this
// is a plain value tile rather than a QuotaMeter.
export default {
  name: "LiveCreditStatus",
  props: {
    balance: { type: Number, required: true },
    // Pre-formatted date string (locale-aware), or null to hide the row.
    expiresAtLabel: { type: String, default: null },
    // comp/managed orgs: minutes aren't counted at all.
    unmetered: { type: Boolean, default: false },
  },
  computed: {
    valueLabel() {
      if (this.unmetered) return this.$t("billing.unlimited")
      return formatMinutesDuration(this.balance)
    },
    detailLabel() {
      if (this.unmetered) return this.$t("billing.live.unmetered")
      return this.$t("billing.live.no_renewal")
    },
  },
}
</script>

<style lang="scss" scoped>
.live-credit-status__expiry {
  font-size: 0.78rem;
  color: var(--text-secondary);
}
</style>
