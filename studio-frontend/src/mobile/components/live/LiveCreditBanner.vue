<template>
  <InfoBanner :tone="tone">
    <span class="m-credit-banner">
      <span>{{ message }}</span>
      <button
        v-if="canRecharge"
        type="button"
        class="m-credit-banner__recharge"
        @click="$emit('recharge')">
        {{ $t("mobile.live.recharge") }}
      </button>
    </span>
  </InfoBanner>
</template>

<script>
import InfoBanner from "@/mobile/components/InfoBanner.vue"
import { computeLiveCreditLevel } from "@/tools/billing/computeLiveCreditLevel"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

// What is left of the organization's prepaid live minutes, before a live is
// started, with a way to buy more for whoever may.
export default {
  name: "LiveCreditBanner",
  components: { InfoBanner },
  props: {
    // live block of GET /cloud/usage/:orgId, metered, not exhausted
    live: { type: Object, required: true },
    canRecharge: { type: Boolean, default: false },
  },
  computed: {
    isLow() {
      return computeLiveCreditLevel(this.live) === "low"
    },
    tone() {
      return this.isLow ? "warning" : "info"
    },
    message() {
      const key = this.isLow
        ? "mobile.live.credit_low"
        : "mobile.live.credit_remaining"
      return this.$t(key, {
        duration: formatMinutesDuration(this.live.balance),
      })
    },
  },
}
</script>

<style scoped>
.m-credit-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-space-1) var(--m-space-3);
}

.m-credit-banner__recharge {
  min-height: var(--m-tap);
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 700;
  text-decoration: underline;
}
</style>
