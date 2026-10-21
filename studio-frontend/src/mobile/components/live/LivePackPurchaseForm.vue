<template>
  <form class="m-pack-purchase" @submit.prevent="submit">
    <LivePackChoice v-model="selectedPackKey" :packs="packs" />
    <button
      type="submit"
      class="m-pack-purchase__buy"
      :disabled="!selectedPack || buying">
      {{ buying ? $t("mobile.common.loading") : buyLabel }}
    </button>
  </form>
</template>

<script>
import LivePackChoice from "@/mobile/components/live/LivePackChoice.vue"
import { computeRecommendedPackKey } from "@/mobile/tools/computeRecommendedPackKey"
import { computeDurationParts } from "@/tools/computeDurationParts"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"

// Picks a live pack and asks for its purchase: emits buy with the chosen
// packKey, the parent leaves for the payment page.
export default {
  name: "LivePackPurchaseForm",
  components: { LivePackChoice },
  props: {
    // Live packs of computePackGroups, smallest first
    packs: { type: Array, required: true },
    // The purchase on its way to the payment page
    buying: { type: Boolean, default: false },
  },
  data() {
    return {
      selectedPackKey: computeRecommendedPackKey(this.packs),
    }
  },
  computed: {
    selectedPack() {
      return (
        this.packs.find((pack) => pack.packKey === this.selectedPackKey) ?? null
      )
    },
    // "Buy 5 hours · 45 €"
    buyLabel() {
      if (!this.selectedPack) return this.$t("mobile.live.buy_pack")
      const duration = computeDurationParts(
        this.selectedPack.minutes,
        this.$i18n.locale,
        "long",
      )
        .map((part) => part.value)
        .join(" ")
      const price = formatCurrencyAmount(
        this.selectedPack.amountCents,
        this.selectedPack.currency,
        this.$i18n.locale,
      )
      return this.$t("mobile.live.buy_pack_selected", { duration, price })
    },
  },
  watch: {
    // The catalog may load after the form: never keep a pack that left it
    packs(packs) {
      if (packs.some((pack) => pack.packKey === this.selectedPackKey)) return
      this.selectedPackKey = computeRecommendedPackKey(packs)
    },
  },
  methods: {
    submit() {
      if (this.selectedPackKey) this.$emit("buy", this.selectedPackKey)
    },
  },
}
</script>

<style scoped>
.m-pack-purchase {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}

/* Always within reach of the thumb, over the packs when they scroll */
.m-pack-purchase__buy {
  position: sticky;
  bottom: calc(var(--m-space-4) + var(--m-safe-bottom));
  margin-top: auto;
  min-height: 52px;
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary);
  color: var(--m-on-primary);
  font: inherit;
  font-weight: 600;
  box-shadow: var(--m-shadow-3);
}

.m-pack-purchase__buy:disabled {
  opacity: 0.6;
}
</style>
