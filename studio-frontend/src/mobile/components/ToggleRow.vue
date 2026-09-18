<template>
  <label class="m-toggle">
    <span class="m-toggle__text">
      <span class="m-toggle__label">{{ label }}</span>
      <span v-if="hint" class="m-muted">{{ hint }}</span>
    </span>
    <input
      type="checkbox"
      role="switch"
      class="m-toggle__input"
      :checked="value"
      :disabled="disabled"
      @change="$emit('input', $event.target.checked)" />
  </label>
</template>

<script>
// A settings row with a native switch. v-model on a boolean.
export default {
  name: "ToggleRow",
  props: {
    value: { type: Boolean, default: false },
    label: { type: String, required: true },
    hint: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.m-toggle {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 56px;
  padding: var(--m-space-2) var(--m-space-4);
  border-bottom: 1px solid var(--m-divider);
}

.m-toggle:last-child {
  border-bottom: none;
}

.m-toggle__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-toggle__label {
  font-weight: 500;
}

.m-toggle__input {
  appearance: none;
  width: 44px;
  height: 26px;
  border-radius: 13px;
  background: var(--m-border);
  position: relative;
  flex-shrink: 0;
  margin: 0;
  transition: background 150ms ease;
}

.m-toggle__input::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--m-surface);
  transition: transform 150ms ease;
}

.m-toggle__input:checked {
  background: var(--m-primary);
}

.m-toggle__input:checked::after {
  transform: translateX(18px);
}

.m-toggle__input:disabled {
  opacity: 0.5;
}
</style>
