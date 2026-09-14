<template>
  <div
    class="live-credit-status"
    :class="{ 'live-credit-status--low': lowBalance }">
    <div class="live-credit-status__main">
      <span class="live-credit-status__label section-caption">{{
        $t("billing.live.title")
      }}</span>

      <p v-if="unmetered" class="live-credit-status__unmetered">
        {{ $t("billing.live.unmetered") }}
      </p>

      <template v-else>
        <p class="live-credit-status__value">
          <output>{{ balanceLabel }}</output>
          <span class="live-credit-status__suffix">{{
            $t("billing.live.remaining_suffix")
          }}</span>
        </p>

        <p class="live-credit-status__message">
          {{ lowBalance ? $t("billing.live.low") : $t("billing.live.no_renewal") }}
        </p>

        <p v-if="expiresAtLabel" class="live-credit-status__expiry">
          {{ $t("billing.live.expires") }} : {{ expiresAtLabel }}
        </p>
      </template>
    </div>

    <Button
      v-if="isOrgAdmin && !unmetered"
      variant="primary"
      size="sm"
      icon="plus"
      class="live-credit-status__buy"
      :disabled="!purchasable"
      :title="purchasable ? null : $t('billing.live.not_purchasable')"
      @click="$emit('buy')">
      {{ $t("billing.live.buy") }}
    </Button>
  </div>
</template>

<script>
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

// Live-transcription minutes are a prepaid credit balance, not a
// period quota: no used/limit ratio to show as a progress bar, so this
// stays a plain label/value display rather than reusing QuotaMeter.
export default {
  name: "LiveCreditStatus",
  props: {
    balance: { type: Number, required: true },
    // Pre-formatted date string (locale-aware), or null to hide the row.
    expiresAtLabel: { type: String, default: null },
    lowBalance: { type: Boolean, default: false },
    // comp/managed orgs: minutes aren't counted at all.
    unmetered: { type: Boolean, default: false },
    // Not surfaced in the copy yet (kept for a future tooltip explaining
    // the low-balance state in more detail).
    admissionMinutes: { type: Number, default: null },
    overdraftMinutes: { type: Number, default: null },
    // Purchase action is admin-only; shown disabled with a tooltip when
    // the plan doesn't allow buying packs.
    isOrgAdmin: { type: Boolean, default: false },
    purchasable: { type: Boolean, default: false },
  },
  emits: ["buy"],
  computed: {
    balanceLabel() {
      return formatMinutesDuration(this.balance)
    },
  },
}
</script>

<style lang="scss" scoped>
.live-credit-status {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1em;
  flex-wrap: wrap;
  padding-bottom: 1em;
  border-bottom: 1px solid var(--neutral-20);

  &__main {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }

  &__unmetered {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  &__value {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 0.4em;

    output {
      font-size: 1.4rem;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
    }
  }

  &__suffix {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  &__message {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  &__expiry {
    margin: 0;
    font-size: 0.78rem;
    color: var(--text-secondary);
  }

  &--low {
    .live-credit-status__value output,
    .live-credit-status__message {
      color: var(--warning-text);
    }
  }

  &__buy {
    flex-shrink: 0;
  }
}
</style>
