<template>
  <label class="m-instance-option">
    <input
      type="radio"
      class="m-instance-option__radio"
      :name="name"
      :value="optionValue"
      :checked="value === optionValue"
      @change="$emit('input', optionValue)" />
    <span class="m-instance-option__body">
      <span class="m-instance-option__label">{{ label }}</span>
      <span class="m-instance-option__address">{{ address }}</span>
    </span>
    <span v-if="badge" class="m-instance-option__badge">{{ badge }}</span>
  </label>
</template>

<script>
// One instance as a radio choice (v-model: the chosen option value). The
// whole card is the radio's label; the fieldset around it names the group.
export default {
  name: "InstanceOption",
  props: {
    value: { type: String, default: null },
    optionValue: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    // Address, or a hint for the free entry
    address: { type: String, default: "" },
    badge: { type: String, default: "" },
  },
}
</script>

<style scoped>
.m-instance-option {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 56px;
  padding: var(--m-space-2) var(--m-space-4);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius);
  background: var(--m-surface);
  cursor: pointer;
}

.m-instance-option:has(:checked) {
  border-color: var(--m-primary);
  box-shadow: 0 0 0 1px var(--m-primary);
  background: var(--m-primary-soft);
}

.m-instance-option:has(:focus-visible) {
  outline: 2px solid var(--m-primary);
  outline-offset: 2px;
}

/* A ring, filled with a primary dot once checked */
.m-instance-option__radio {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin: 0;
  border: 2px solid var(--m-text-disabled);
  border-radius: 50%;
  appearance: none;
  background: var(--m-surface);
}

.m-instance-option__radio:checked {
  border-color: var(--m-primary);
  background: var(--m-primary);
  box-shadow: inset 0 0 0 4px var(--m-surface);
}

.m-instance-option__radio:focus-visible {
  outline: none;
}

.m-instance-option__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-instance-option__label {
  font-weight: 600;
}

.m-instance-option__address {
  font-family: monospace;
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-instance-option__badge {
  flex-shrink: 0;
  padding: 2px var(--m-space-2);
  border-radius: var(--m-radius-sm);
  background: var(--m-primary-soft);
  color: var(--m-primary);
  font-size: var(--m-font-size-sm);
  font-weight: 600;
}
</style>
