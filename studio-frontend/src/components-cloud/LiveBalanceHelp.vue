<template>
  <p v-if="available > 0" class="live-balance-help__note">
    <PhIcon name="info" />
    <span>{{ $t("billing.settings.balances.live.prepaid") }}</span>
  </p>
  <div v-else class="live-balance-help">
    <p class="live-balance-help__text">
      {{ $t("billing.settings.balances.live.prepaid") }}
    </p>
    <template v-if="offer">
      <Button
        variant="secondary"
        size="sm"
        icon="microphone"
        block
        @click="$emit('buy')">
        {{ $t("billing.settings.balances.live.buy") }}
      </Button>
      <p class="live-balance-help__price">
        {{
          $t("billing.settings.balances.live.from_hourly_price", {
            price: hourlyPrice,
          })
        }}
      </p>
    </template>
  </div>
</template>

<script>
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"

// Live is never part of a plan: it runs on prepaid packs. Says so next to
// the live balance, and offers the packs once it is spent.
export default {
  name: "LiveBalanceHelp",
  props: {
    // Live minutes left
    available: { type: Number, required: true },
    // The live offer of computePackKindOffers, null when none is sold
    offer: { type: Object, default: null },
  },
  computed: {
    hourlyPrice() {
      return formatCurrencyAmount(
        this.offer.lowestHourlyCents,
        this.offer.pack.currency,
        this.$i18n.locale,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.live-balance-help {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);

  &__text {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  &__price {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--text-secondary);
    text-align: center;
  }
}

// Root of its own branch, hence outside the block above
.live-balance-help__note {
  display: flex;
  align-items: flex-start;
  gap: var(--small-gap);
  margin: 0;
  padding: var(--small-gap) var(--medium-gap);
  border-radius: var(--border-radius-sm);
  background: var(--neutral-10);
  font-size: var(--text-xs);
  color: var(--text-secondary);

  .icon-svg {
    flex-shrink: 0;
  }
}
</style>
