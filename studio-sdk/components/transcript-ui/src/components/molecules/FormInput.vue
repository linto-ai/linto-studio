<script lang="ts">
export interface FormField {
  // Consumed by FormInput
  label?: string
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "search"
    | "tel"
    | "url"
    | "date"
  placeholder?: string
  autocomplete?: string
  error?: string | null
  value?: string
  /** Additional HTML attributes spread onto the input (v-bind). */
  customParams?: Record<string, unknown>

  // Consumed by external form logic (validators, state management).
  // Accepted by FormInput for migration compatibility.
  required?: boolean
  valid?: boolean
  loading?: boolean
  name?: string
  id?: string
  testField?: (field: FormField, t: (key: string) => string) => boolean
  disabled?: boolean
  disabledReason?: string
}

export const EMPTY_FIELD: FormField = {
  label: "",
  value: "",
  error: null,
  valid: false,
  loading: false,
}
</script>

<script setup lang="ts">
import { computed, ref, useId, useTemplateRef, watch, onMounted } from "vue"
import Button from "../atoms/Button.vue"
import { useI18n } from "../../i18n"

// ── Props / emits / slots ──────────────────────────────────────────────

const props = withDefaults(
  defineProps<{
    field: FormField
    modelValue?: string

    // Behavior
    disabled?: boolean
    readonly?: boolean
    focus?: boolean
    withConfirmation?: boolean

    // Layout
    inline?: boolean
    fullWidth?: boolean
    size?: "sm" | "md" | "lg"

    // Variants
    textarea?: boolean
    code?: boolean

    // IDs
    inputId?: string
  }>(),
  {
    size: "md",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
  input: [value: string]
  "on-confirm": []
  "on-cancel": []
  keydown: [event: KeyboardEvent]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

defineSlots<{
  default?: () => unknown
  "custom-input"?: (props: { id: string; disabled: boolean }) => unknown
  "content-after-label"?: () => unknown
  "content-after-input"?: () => unknown
  "content-bottom-input"?: () => unknown
}>()

const { t } = useI18n()

// ── State ──────────────────────────────────────────────────────────────

const autoId = useId()
const id = computed(() => props.inputId ?? autoId)
const inputRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>("input")

const initialValue = props.modelValue ?? props.field.value ?? ""
const draft = ref<string>(initialValue)
const originalValue = ref<string>(initialValue)

// ── Derived ────────────────────────────────────────────────────────────

const isDisabled = computed(() => props.disabled ?? props.field.disabled ?? false)
const isRequired = computed(() => props.field.required ?? false)
const errorMessage = computed(() => props.field.error ?? null)
const hasError = computed(() => !!errorMessage.value)

const inputType = computed(() => props.field.type ?? "text")
const placeholder = computed(() => props.field.placeholder ?? undefined)
const autocomplete = computed(() => props.field.autocomplete ?? undefined)

const hasChanged = computed(() => draft.value !== originalValue.value)
const showConfirmationButtons = computed(
  () => props.withConfirmation && hasChanged.value,
)

const rootClasses = computed(() => ({
  "form-field": true,
  [`form-field--${props.size}`]: true,
  "form-field--inline": props.inline,
  "form-field--disabled": isDisabled.value,
  "form-field--error": hasError.value,
  "form-field--with-confirmation": props.withConfirmation,
}))

const inputClasses = computed(() => ({
  "form-field__input": true,
  "form-field__input--fullwidth": props.fullWidth,
  "form-field__input--error": hasError.value,
}))

// ── Watchers ───────────────────────────────────────────────────────────

// External v-model change → sync internal draft + confirmation baseline.
watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined && v !== draft.value) {
      draft.value = v
      originalValue.value = v
    }
  },
)

// External field.value change → sync only when no v-model is in use.
watch(
  () => props.field.value,
  (v) => {
    if (props.modelValue === undefined && v !== undefined && v !== draft.value) {
      draft.value = v
      originalValue.value = v
    }
  },
)

// ── Handlers ───────────────────────────────────────────────────────────

function onInput(): void {
  // In confirmation mode the parent only sees the value via apply().
  if (props.withConfirmation) return
  emit("update:modelValue", draft.value)
  emit("input", draft.value)
}

function apply(): void {
  if (!hasChanged.value) return
  originalValue.value = draft.value
  emit("update:modelValue", draft.value)
  emit("input", draft.value)
  emit("on-confirm")
}

function cancel(): void {
  if (hasChanged.value) draft.value = originalValue.value
  emit("on-cancel")
}

function onKeydown(e: KeyboardEvent): void {
  emit("keydown", e)
  if (!props.withConfirmation || e.defaultPrevented) return
  if (e.key === "Enter" && hasChanged.value) {
    e.preventDefault()
    apply()
  } else if (e.key === "Escape") {
    e.preventDefault()
    cancel()
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────

onMounted(() => {
  if (props.focus) inputRef.value?.focus()

  if (import.meta.env.DEV) {
    const hasLabel = !!props.field.label
    const hasAriaLabel =
      typeof props.field.customParams?.["aria-label"] === "string"
    if (!hasLabel && !hasAriaLabel) {
      console.warn(
        "[FormInput] missing accessible label: provide either `field.label` or `customParams['aria-label']`.",
      )
    }
  }
})

// ── Exposed ────────────────────────────────────────────────────────────

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () =>
    (inputRef.value as HTMLInputElement | HTMLTextAreaElement | null)?.select(),
})
</script>

<template>
  <div :class="rootClasses">
    <div v-if="field.label" class="form-field__header">
      <label class="form-field__label" :for="id">
        {{ field.label }}
        <span v-if="isRequired" class="form-field__required" aria-hidden="true"
          >*</span
        >
      </label>
      <slot name="content-after-label" />
    </div>

    <div class="form-field__input-wrapper">
      <slot />

      <slot
        v-if="$slots['custom-input']"
        name="custom-input"
        :id="id"
        :disabled="isDisabled" />

      <!-- TODO readonly mode: render plain text (<div> or <pre> when `code`) -->
      <!-- TODO textarea mode: render <textarea> instead. -->

      <input
        v-else
        ref="input"
        v-model="draft"
        :class="inputClasses"
        :type="inputType"
        :id="id"
        :disabled="isDisabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="isRequired"
        :aria-required="isRequired || undefined"
        :aria-invalid="hasError || undefined"
        :aria-describedby="hasError ? `${id}-error` : undefined"
        v-bind="field.customParams"
        @input="onInput"
        @keydown="onKeydown"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)" />

      <div
        v-if="showConfirmationButtons"
        class="form-field__actions">
        <Button
          icon="x"
          variant="tertiary"
          :size="size"
          :aria-label="t('form.cancel')"
          @mousedown.prevent
          @click="cancel" />
        <Button
          icon="check"
          variant="primary"
          :size="size"
          :aria-label="t('form.apply')"
          @mousedown.prevent
          @click="apply" />
      </div>
      <div
        v-else-if="withConfirmation"
        class="form-field__actions form-field__actions--placeholder"
        aria-hidden="true" />

      <slot name="content-after-input" />
    </div>

    <slot name="content-bottom-input" />

    <div v-if="hasError" :id="`${id}-error`" class="form-field__info">
      <span class="form-field__error">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<style scoped>
/* ── Root ──────────────────────────────────────────────────────────── */

.form-field {
  --field-height: 40px;
  --field-padding-x: var(--spacing-md);
  --field-font-size: var(--font-size-sm);

  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.form-field--sm {
  --field-height: 32px;
  --field-padding-x: var(--spacing-sm);
  --field-font-size: var(--font-size-xs);
}

.form-field--lg {
  --field-height: 44px;
  --field-padding-x: var(--spacing-md);
  --field-font-size: var(--font-size-base);
}

.form-field--disabled {
  opacity: 0.7;
}

/* ── Header (label row) ────────────────────────────────────────────── */

.form-field__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.form-field__label {
  display: block;
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.form-field--error .form-field__label {
  color: var(--color-danger);
}

.form-field__required {
  margin-left: 2px;
  color: var(--color-danger);
}

/* ── Input wrapper ─────────────────────────────────────────────────── */

.form-field__input-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  width: 100%;
}

/* ── Input ─────────────────────────────────────────────────────────── */

.form-field__input {
  flex: 1;
  box-sizing: border-box;
  height: var(--field-height);
  padding: 0 var(--field-padding-x);
  font-family: inherit;
  font-size: var(--field-font-size);
  line-height: 1.4;
  color: var(--color-text-primary);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
  transition:
    border-color var(--transition-duration),
    box-shadow var(--transition-duration);
}

.form-field__input::placeholder {
  color: var(--color-text-muted);
  opacity: 1;
}

.form-field__input:hover:not(:disabled) {
  border-color: var(--color-text-muted);
}

.form-field__input:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.form-field__input:disabled {
  cursor: not-allowed;
  background-color: var(--color-surface);
  color: var(--color-text-muted);
}

.form-field__input--fullwidth {
  width: 100%;
  max-width: none;
}

.form-field__input--error {
  border-color: var(--color-danger);
}

.form-field__input--error:focus-visible {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--color-danger) 20%, transparent);
}

/* ── Confirmation actions ──────────────────────────────────────────── */

.form-field__actions {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.form-field__actions--placeholder {
  /* Reserve space so showing the buttons doesn't shift layout. */
  width: calc(var(--field-height) * 2 + var(--spacing-xs));
  height: var(--field-height);
  pointer-events: none;
  opacity: 0;
}

/* ── Info / error ──────────────────────────────────────────────────── */

.form-field__info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.form-field__error {
  margin: 0;
  font-size: var(--font-size-xs);
  line-height: 1.2;
  color: var(--color-danger);
}

/* ── Inline layout ─────────────────────────────────────────────────── */

.form-field--inline {
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-md);
}

.form-field--inline .form-field__header {
  flex-shrink: 0;
  min-width: 120px;
}

.form-field--inline .form-field__input-wrapper {
  flex: 1;
}

/* ── Reduced motion ────────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  .form-field__input {
    transition: none;
  }
}
</style>
