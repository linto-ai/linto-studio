<template>
  <li class="info-row">
    <div class="info-row__main">
      <PhIcon v-if="icon" :name="icon" size="sm" class="info-row__icon" />
      <span class="info-row__label">{{ label }}</span>
      <span
        class="info-row__value"
        :class="{ 'info-row__value--muted': muted }">
        <slot>
          <template v-if="Array.isArray(value)">
            <span
              v-for="(line, index) in value"
              :key="index"
              class="info-row__value-line"
              >{{ line }}</span
            >
          </template>
          <template v-else>{{ value }}</template>
        </slot>
      </span>
    </div>
    <div
      class="info-row__actions"
      v-if="$slots.actions || $scopedSlots.actions">
      <slot name="actions" />
    </div>
  </li>
</template>

<script>
// Generic presentational row: icon · label · value, with an optional `actions`
// slot rendered below the line. Value comes from the `value` prop or the
// default slot (for richer content).
export default {
  name: "InfoRow",
  props: {
    icon: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number, Array],
      default: "",
    },
    muted: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
}

.info-row__main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-row__icon {
  flex: 0 0 auto;
  color: var(--text-secondary, #666);
}

.info-row__label {
  flex: 1;
  min-width: 0;
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
}

.info-row__value {
  font-weight: 600;
  color: var(--text-primary, #222);
  text-align: right;
}

.info-row__value--muted {
  font-weight: 400;
  font-style: italic;
  color: var(--text-secondary, #666);
}

/* Array value: one item per line, right-aligned. */
.info-row__value-line {
  display: block;
}

.info-row__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
