<template>
  <button
    type="button"
    class="pack-offer-shortcut"
    @click="$emit('select', offer.kind)">
    <PhIcon name="plus" color="var(--primary-color)" />
    <span class="pack-offer-shortcut__text">
      <strong>{{ contentLabel }}</strong>
      <span>{{ termsLabel }}</span>
    </span>
  </button>
</template>

<script>
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"
import { formatPackValidity } from "@/tools/formatPackValidity"

// A pack offered right where its minutes would show: what it adds, for how
// much and how long ("+5 h and 50 AI credits, for €10, valid 12
// months"). Emits select with the kind of the pack.
export default {
  name: "PackOfferShortcut",
  props: {
    // An offer of computePackKindOffers
    offer: { type: Object, required: true },
  },
  computed: {
    pack() {
      return this.offer.pack
    },
    contentLabel() {
      const duration = formatMinutesDuration(this.pack.minutes)
      if (!this.pack.aiCredits) {
        return this.$t("billing.settings.balances.shortcut.minutes", {
          duration,
        })
      }
      return this.$t("billing.settings.balances.shortcut.minutes_and_ai", {
        duration,
        credits: this.pack.aiCredits,
      })
    },
    termsLabel() {
      const price = formatCurrencyAmount(
        this.pack.amountCents,
        this.pack.currency,
        this.$i18n.locale,
      )
      const validity = formatPackValidity([this.pack], this.$i18n.locale)
      if (!validity) {
        return this.$t("billing.settings.balances.shortcut.price", { price })
      }
      return this.$t("billing.settings.balances.shortcut.price_and_validity", {
        price,
        validity,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
// Overrides the global button layout (centered, single line)
.pack-offer-shortcut {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  white-space: normal;
  gap: var(--small-gap);
  width: 100%;
  padding: var(--small-gap) var(--medium-gap);
  border: 1px dashed var(--primary-color);
  border-radius: var(--border-radius-sm);
  background: var(--primary-soft);
  color: var(--text-primary);
  font: inherit;
  font-size: var(--text-xs);
  text-align: start;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-style: solid;
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  .icon-svg {
    flex-shrink: 0;
  }

  &__text {
    display: flex;
    flex-direction: column;
  }
}
</style>
