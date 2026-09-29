<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  id?: string
  disabled?: boolean
}>(), {
  id: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputId = props.id ?? useId()
</script>

<template>
  <div class="switch">
    <input
      type="checkbox"
      :id="inputId"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label :for="inputId">
      <div class="switch-slider"></div>
    </label>
  </div>
</template>

<style scoped>
.switch {
  display: inline-block;
  flex-shrink: 0;
}

.switch input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* Track and outline are two roles, hence two tokens: reusing --color-border
   for both collapsed into a white blob once that token went white for the
   dark theme. The outline is what makes the knob readable. */
.switch label {
  height: 20px;
  width: 40px;
  display: block;
  border: 1px solid var(--color-switch-border);
  border-radius: 20px;
  cursor: pointer;
  background-color: var(--color-switch-track);
  transition: background-color var(--transition-duration);
}

.switch .switch-slider {
  height: 22px;
  width: 22px;
  border: 1px solid var(--color-switch-border);
  border-radius: 50%;
  position: relative;
  top: -2px;
  left: -2px;
  background-color: var(--color-white);
  transition: left var(--transition-duration);
}

.switch input:checked + label {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.switch input:checked + label .switch-slider {
  left: 20px;
  border-color: var(--color-primary);
}

.switch input:disabled + label {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
