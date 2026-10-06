<template>
  <PackCard
    tag="label"
    class="pack-offer"
    :color="look.color"
    :icon="look.icon"
    :motif="look.motif"
    :label="kindLabel"
    :amount="amount"
    :badge="badge"
    :details="details">
    <template #header-end>
      <input
        type="radio"
        class="pack-offer__radio"
        :name="name"
        :value="pack.packKey"
        :checked="value === pack.packKey"
        @change="$emit('input', pack.packKey)" />
    </template>
  </PackCard>
</template>

<script>
import PackCard from "@/components/atoms/PackCard.vue"
import { computeDurationParts } from "@/tools/computeDurationParts"
import { computePackLook } from "@/tools/computePackLook"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"

// One pack of the catalog, as a radio choice (v-model: the chosen packKey).
// The whole card is the radio's label, so its text is the radio's name.
export default {
  name: "PackOffer",
  components: { PackCard },
  props: {
    // A pack of computePackGroups: catalog fields + hourlyCents, savingPercent
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
    kindLabel() {
      const key = `billing.settings.packs.kind.${this.pack.kind}`
      return this.$te(key) ? this.$t(key) : this.pack.displayName
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
    // Catalog prices are excluding VAT: Stripe Checkout adds the tax.
    details() {
      return [
        {
          label: this.$t("billing.settings.packs.price"),
          value: this.$t("billing.settings.packs.price_excl_tax", {
            price: this.formatAmount(this.pack.amountCents),
          }),
        },
        {
          label: this.$t("billing.settings.packs.rate"),
          value: this.$t("billing.settings.packs.per_hour", {
            price: this.formatAmount(this.pack.hourlyCents),
          }),
        },
      ]
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
// Wide enough to never read as a square
.pack-offer {
  width: 16rem;
  max-width: 100%;
}

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
</style>
