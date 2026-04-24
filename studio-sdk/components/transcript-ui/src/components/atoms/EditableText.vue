<script setup lang="ts">
import { ref, watch, nextTick, useTemplateRef, computed } from "vue"
import FormInput, { type FormField } from "../molecules/FormInput.vue"

const props = withDefaults(
  defineProps<{
    modelValue: string
    disabled?: boolean
    placeholder?: string
    ariaLabel?: string
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
  commit: [value: string]
  cancel: []
}>()

const isEditing = ref(false)
const draft = ref(props.modelValue)
const inputRef = useTemplateRef<{ focus: () => void; select: () => void }>("input")

const field = computed<FormField>(() => ({
  placeholder: props.placeholder,
  customParams: props.ariaLabel ? { "aria-label": props.ariaLabel } : undefined,
}))

watch(
  () => props.modelValue,
  (v) => {
    if (!isEditing.value) draft.value = v
  },
)

async function startEdit(): Promise<void> {
  if (props.disabled) return
  draft.value = props.modelValue
  isEditing.value = true
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

function commit(): void {
  if (!isEditing.value) return
  const trimmed = draft.value.trim()
  isEditing.value = false
  if (!trimmed || trimmed === props.modelValue) return
  emit("update:modelValue", trimmed)
  emit("commit", trimmed)
}

function cancel(): void {
  if (!isEditing.value) return
  isEditing.value = false
  draft.value = props.modelValue
  emit("cancel")
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === "Enter") {
    e.preventDefault()
    commit()
  } else if (e.key === "Escape") {
    e.preventDefault()
    cancel()
  }
}
</script>

<template>
  <FormInput
    v-if="isEditing"
    ref="input"
    v-model="draft"
    :field="field"
    size="sm"
    full-width
    @keydown="onKeydown"
    @blur="commit" />
  <button
    v-else
    type="button"
    class="editable-text-display"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="startEdit">
    {{ modelValue || placeholder }}
  </button>
</template>

<style scoped>
.editable-text-display {
  all: unset;
  cursor: text;
  text-align: left;
  font: inherit;
  color: inherit;
  line-height: inherit;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  min-width: 0;
}

.editable-text-display:not(:disabled):hover {
  border-color: var(--color-border);
}

.editable-text-display:disabled {
  cursor: default;
}
</style>
