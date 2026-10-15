<template>
  <PackCard
    tag="label"
    class="pack-offer"
    :color="look.color"
    :motif="look.motif"
    :amount="amount">
    <template #header-start>
      <input
        type="radio"
        class="pack-offer__radio"
        :name="name"
        :value="pack.packKey"
        :checked="value === pack.packKey"
        @change="$emit('input', pack.packKey)" />
    </template>
    <template v-if="badge" #header-end>
      <span class="pack-offer__badge">{{ badge }}</span>
    </template>
    <template #footer>
      <span class="pack-offer__price">{{ price }}</span>
      <span class="pack-offer__rate">{{ rate }}</span>
    </template>
  </PackCard>
</template>

<script>
import PackCard from "@/components/atoms/PackCard.vue"
import { computeDurationParts } from "@/tools/computeDurationParts"
import { computePackLook } from "@/tools/billing/pack/computePackLook"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"

// One pack of the catalog, as a radio choice (v-model: the chosen packKey).
// The whole card is the radio's label, so its text is the radio's name; the
// fieldset around it (the kind of pack) names the group, so no kind label
// nor icon. The AI credits a pack comes with are told by the group.
export default {
  name: "PackOffer",
  components: { PackCard },
  props: {
    // A pack of computePackGroups: catalog fields + hourlyCents, savingPercent,
    // savingCents
    pack: { type: Object, required: true },
    // packKey of the chosen pack
    value: { type: String, default: null },
    // Radio group name
    name: { type: String, required: true },
  },
  computed: {
    look() {
      return computePackLook(this.pack.kind)
    },
    amount() {
      return computeDurationParts(this.pack.minutes, this.$i18n.locale, "long")
    },
    badge() {
      if (!this.pack.savingPercent) return null
      return this.$t("billing.settings.packs.saving", {
        percent: this.pack.savingPercent,
      })
    },
    // Catalog prices, shown without a tax mention: whether Stripe Checkout
    // adds VAT depends on its tax settings.
    price() {
      return this.formatAmount(this.pack.amountCents)
    },
    // "9 € per hour", or "8 €/h, 20 € saved" once it beats the dearest pack
    rate() {
      const price = this.formatAmount(this.pack.hourlyCents)
      if (!this.pack.savingCents) {
        return this.$t("billing.settings.packs.hourly_rate", { price })
      }
      return this.$t("billing.settings.packs.hourly_rate_with_saving", {
        price,
        saving: this.formatAmount(this.pack.savingCents),
      })
    },
  },
  methods: {
    formatAmount(amountCents) {
      return formatCurrencyAmount(
        amountCents,
        this.pack.currency,
        this.$i18n.locale,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
// A ring, filled with a primary dot once checked. Focus shows on the whole
// card (PackCard), not on this small ring.
.pack-offer__radio {
  display: block;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  margin: 0;
  border: 2px solid var(--neutral-40);
  border-radius: 50%;
  appearance: none;
  background: var(--background-primary);
  cursor: pointer;

  &:checked {
    border-color: var(--primary-color);
    background: var(--primary-color);
    box-shadow: inset 0 0 0 3px var(--background-primary);
  }

  &:focus-visible {
    outline: none;
  }
}

.pack-offer__badge {
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 999px;
  background: var(--background-primary);
  color: var(--pack-accent);
  font-size: var(--text-xs);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.pack-offer__price {
  font-size: var(--text-md);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.pack-offer__rate {
  min-width: 0;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-align: right;
}
</style>
