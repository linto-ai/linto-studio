<template>
  <!-- The whole card is a <label> for the underlying radio: native click/keyboard
       toggling, no custom role/keydown handling needed. -->
  <label
    :for="radioId"
    class="plan-card flex col gap-medium"
    :class="{
      'plan-card--selected': isSelected,
      'plan-card--featured': badge,
    }">
    <span v-if="badge" class="plan-card__badge">{{ badge }}</span>
    <header
      class="plan-card__header flex row align-top justify-between gap-small">
      <div class="plan-card__heading flex row align-center gap-small">
        <ph-icon :name="icon" weight="bold" color="primary" size="md" />
        <div class="plan-card__titles flex col">
          <span class="plan-card__name">{{ name }}</span>
          <span v-if="tagline" class="plan-card__tagline">{{ tagline }}</span>
        </div>
      </div>
      <Radio
        :id="radioId"
        :name="radioName"
        :value="selectedValue"
        :radio-value="radioValue"
        @input="$emit('select', $event)" />
    </header>

    <section class="plan-card__price">
      <p class="plan-card__price-line">
        <span class="plan-card__price-amount">{{ priceLabel }}</span>
        <span v-if="priceSuffix" class="plan-card__price-suffix">{{
          priceSuffix
        }}</span>
      </p>
      <p v-if="priceNote" class="plan-card__price-note">{{ priceNote }}</p>
    </section>

    <section class="plan-card__features">
      <p v-if="featuresLabel" class="plan-card__features-label">
        {{ featuresLabel }}
      </p>
      <ul class="flex col gap-small">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex row align-center gap-small">
          <ph-icon
            :name="feature.icon || 'check'"
            :weight="feature.weight || 'bold'"
            size="sm"
            color="primary" />
          <span>{{ feature.text }}</span>
        </li>
      </ul>
    </section>
  </label>
</template>

<script>
import Radio from "@/components/atoms/Radio.vue"

export default {
  name: "PlanCard",
  components: { Radio },
  props: {
    // Header
    icon: { type: String, required: true },
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    // Small ribbon shown above the card (e.g. "Most popular"). Empty = none.
    badge: { type: String, default: "" },
    // Price section
    priceLabel: { type: String, required: true },
    priceSuffix: { type: String, default: "" },
    priceNote: { type: String, default: "" },
    // Features section
    featuresLabel: { type: String, default: "" },
    // [{ text, icon, weight }] — icon/weight default to a bold checkmark
    features: { type: Array, default: () => [] },
    // Radio group wiring: same radioName across the sibling cards, the group's
    // current value in selectedValue, and this card's own value in radioValue.
    radioName: { type: String, required: true },
    radioValue: { type: [String, Number], required: true },
    selectedValue: { type: [String, Number], default: null },
  },
  computed: {
    radioId() {
      return `${this.radioName}-${this.radioValue}-${this._uid}`
    },
    isSelected() {
      return this.selectedValue === this.radioValue
    },
  },
}
</script>

<style lang="scss" scoped>
.plan-card {
  position: relative;
  padding: 1.25rem;
  background: var(--background-primary);
  border-radius: 10px;
  // Border width stays constant to avoid a layout shift on selection; only
  // the color changes.
  border: 2px solid var(--neutral-30);
  cursor: pointer;

  &--selected {
    border-color: var(--primary-color);
  }

  // The badge and the selection border are two independent signals (a
  // featured plan isn't necessarily the selected one), so they can combine:
  // the selected border wins when both apply.
  &--featured {
  }
}

.plan-card__badge {
  position: absolute;
  top: -0.7em;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25em 0.9em;
  border-radius: 999px;
  background: var(--primary-color);
  color: var(--background-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}

.plan-card__heading,
.plan-card__titles {
  // Let long names/taglines ellipsize instead of forcing the header to grow
  // (flex children default to a min-width of their content otherwise).
  min-width: 0;
}

.plan-card__name {
  font-weight: 600;
  font-size: var(--text-md);
  color: var(--text-primary);
}

.plan-card__tagline {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.plan-card__price-line {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.25em;
}

.plan-card__price-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.plan-card__price-suffix {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.plan-card__price-note {
  margin: 0.25em 0 0;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.plan-card__features {
  padding-top: var(--medium-gap);
  border-top: 1px solid var(--neutral-20);
}

.plan-card__features-label {
  margin: 0 0 var(--small-gap);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.plan-card__features ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.plan-card__features li {
  font-size: var(--text-sm);
  color: var(--text-primary);

  .icon-svg {
    flex-shrink: 0;
  }
}
</style>
