<template>
  <label class="m-pack-option">
    <input
      type="radio"
      class="m-pack-option__radio"
      :name="name"
      :value="pack.packKey"
      :checked="value === pack.packKey"
      @change="$emit('input', pack.packKey)" />
    <span class="m-pack-option__amount">
      <span
        v-for="(part, index) in amountParts"
        :key="index"
        :class="`m-pack-option__${part.type}`"
        >{{ part.value }}</span
      >
    </span>
    <span class="m-pack-option__pricing">
      <span class="m-pack-option__price-row">
        <span v-if="badge" class="m-pack-option__badge">{{ badge }}</span>
        <span class="m-pack-option__price">{{ price }}</span>
      </span>
      <span class="m-pack-option__rate">{{ rate }}</span>
    </span>
  </label>
</template>

<script>
import { computeDurationParts } from "@/tools/computeDurationParts"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"

// One pack as a radio choice (v-model: the chosen packKey). The whole card is
// the radio's label; the fieldset around it names the group.
export default {
  name: "LivePackOption",
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
    amountParts() {
      return computeDurationParts(this.pack.minutes, this.$i18n.locale, "long")
    },
    badge() {
      if (!this.pack.savingPercent) return null
      return this.$t("billing.settings.packs.saving", {
        percent: this.pack.savingPercent,
      })
    },
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

<style scoped>
.m-pack-option {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 72px;
  padding: var(--m-space-3) var(--m-space-4);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius);
  background: var(--m-surface);
  cursor: pointer;
}

.m-pack-option:has(:checked) {
  border-color: var(--m-primary);
  box-shadow: 0 0 0 1px var(--m-primary);
  background: var(--m-primary-soft);
}

.m-pack-option:has(:focus-visible) {
  outline: 2px solid var(--m-primary);
  outline-offset: 2px;
}

/* A ring, filled with a primary dot once checked */
.m-pack-option__radio {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin: 0;
  border: 2px solid var(--m-text-disabled);
  border-radius: 50%;
  appearance: none;
  background: var(--m-surface);
}

.m-pack-option__radio:checked {
  border-color: var(--m-primary);
  background: var(--m-primary);
  box-shadow: inset 0 0 0 4px var(--m-surface);
}

.m-pack-option__radio:focus-visible {
  outline: none;
}

.m-pack-option__amount {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: var(--m-space-1);
}

.m-pack-option__number {
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.m-pack-option__unit {
  font-size: var(--m-font-size);
  font-weight: 600;
}

.m-pack-option__pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--m-space-1);
  text-align: right;
}

.m-pack-option__price-row {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
}

.m-pack-option__price {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.m-pack-option__badge {
  padding: 2px var(--m-space-2);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-round);
  background: var(--m-surface);
  color: var(--m-primary);
  font-size: var(--m-font-size-sm);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.m-pack-option__rate {
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}
</style>
