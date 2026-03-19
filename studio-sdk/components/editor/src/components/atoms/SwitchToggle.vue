<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  id?: string
}>(), {
  id: undefined,
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
  display: none;
}

.switch label {
  height: 20px;
  width: 40px;
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  cursor: pointer;
  background-color: var(--color-border);
  transition: background-color 150ms;
}

.switch .switch-slider {
  height: 22px;
  width: 22px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  position: relative;
  top: -2px;
  left: -2px;
  background-color: white;
  transition: left 150ms;
}

.switch input:checked + label {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.switch input:checked + label .switch-slider {
  left: 20px;
  border-color: var(--color-primary);
}
</style>
