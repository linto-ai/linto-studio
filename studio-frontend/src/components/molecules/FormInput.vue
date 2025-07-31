<template>
  <div class="form-field" :class="formFieldClasses" v-if="!readonly">
    <div class="form-field__header" v-if="field.label">
      <label class="form-field__label" :for="id">
        {{ field.label }}
      </label>
      <slot name="content-after-label"></slot>
    </div>

    <div class="form-field__input-wrapper">
      <slot></slot>
      <input
        v-if="!textarea"
        :class="inputClasses"
        :type="type"
        :disabled="disabled"
        :id="id"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        ref="input"
        v-model="editValue"
        @change="onInputChange"
        @keydown="keydown"
        v-bind="field.customParams" />
      <textarea
        v-else
        :class="textareaClasses"
        :disabled="disabled"
        :id="id"
        ref="input"
        v-model="editValue"
        @change="onInputChange"
        @keydown="keydown" />

      <div v-if="shouldShowConfirmationButtons" class="form-field__actions">
        <Button
          type="button"
          @click="cancel"
          :title="$t ? $t('cancel') : 'Cancel'"
          icon="x"
          iconOnly
          variant="outline"
          color="neutral"
          size="sm"
          class="form-field__cancel-btn" />
        <Button
          type="button"
          @click="apply"
          :title="$t ? $t('apply') : 'Apply'"
          icon="check"
          iconOnly
          variant="outline"
          color="primary"
          size="sm"
          class="form-field__apply-btn" />
      </div>
      <div
        v-else-if="withConfirmation"
        class="form-field__actions form-field__actions--placeholder"></div>

      <slot name="content-after-input"></slot>
    </div>

    <slot name="content-bottom-input"></slot>

    <div class="form-field__info" v-if="field.error !== null">
      <span class="form-field__error">{{ field.error }}</span>
    </div>
  </div>
  <LabeledValue v-else :label="field.label" :value="modelValue" />
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import LabeledValue from "@/components/atoms/LabeledValue.vue"
import Button from "@/components/atoms/Button.vue"
export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    withConfirmation: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inputId: {
      type: String,
      default: null,
    },
    inputFullWidth: {
      type: Boolean,
      default: null,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    textarea: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      id: this.inputId || Math.random().toString(36).substr(2, 9),
      editValue:
        this.modelValue !== undefined
          ? this.modelValue
          : this.field.value || "",
      originalValue:
        this.modelValue !== undefined
          ? this.modelValue
          : this.field.value || "",
    }
  },
  computed: {
    type() {
      return this.field.type || "text"
    },
    autocomplete() {
      return this.field.autocomplete || null
    },
    placeholder() {
      return this.field?.placeholder || null
    },
    hasChanged() {
      return this.editValue !== this.originalValue
    },
    shouldShowConfirmationButtons() {
      return this.withConfirmation && this.hasChanged
    },
    formFieldClasses() {
      return {
        "form-field--inline": this.inline,
        "form-field--disabled": this.disabled,
        "form-field--error": this.field.error !== null,
        "form-field--with-confirmation": this.withConfirmation,
      }
    },
    inputClasses() {
      return {
        "form-field__input": true,
        "form-field__input--fullwidth": this.inputFullWidth,
        "form-field__input--disabled": this.disabled,
        "form-field__input--error": this.field.error !== null,
      }
    },
    textareaClasses() {
      return {
        "form-field__textarea": true,
        "form-field__input--fullwidth": this.inputFullWidth,
        "form-field__input--disabled": this.disabled,
        "form-field__input--error": this.field.error !== null,
      }
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal !== this.editValue) {
        this.editValue = newVal
        this.originalValue = newVal
      }
    },
    "field.value"(newVal) {
      if (this.modelValue === undefined && newVal !== this.editValue) {
        this.editValue = newVal
        this.originalValue = newVal
      }
    },
  },
  mounted() {
    if (this.focus) {
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  },
  methods: {
    onInputChange(e) {
      this.$emit("update:modelValue", this.editValue)
      this.$emit("input", this.editValue)
    },
    apply(e) {
      e && e.stopPropagation()
      this.originalValue = this.editValue
      this.$emit("update:modelValue", this.editValue)
      this.$emit("input", this.editValue)
      this.$emit("on-confirm", e)
    },
    cancel(e) {
      e && e.stopPropagation()
      this.editValue = this.originalValue
      this.$emit("on-cancel", e)
    },
    keydown(e) {
      if (
        e.key == "Enter" &&
        this.shouldShowConfirmationButtons &&
        !e.shiftKey
      ) {
        e.preventDefault()
        this.apply()
      } else if (e.key == "Escape" && this.shouldShowConfirmationButtons) {
        e.preventDefault()
        this.cancel()
      } else {
        e.stopPropagation()
      }
    },
  },
  components: { Fragment, LabeledValue, Button },
}
</script>

<style lang="scss" scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  /* Header with label */
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__label {
    display: block;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary, #222);
    line-height: 1.2;
    margin: 0;
  }

  /* Input wrapper with actions */
  &__input-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
  }

  /* Base input styles */
  &__input,
  &__textarea {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--neutral-30, #ddd);
    border-radius: var(--border-radius-sm, 6px);
    font-family: inherit;
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--text-primary, #000);
    background-color: var(--background-primary, #fff);
    transition: all 0.2s ease;
    outline: none;

    &::placeholder {
      color: var(--text-secondary, #999);
      opacity: 1;
    }

    &:hover:not(:disabled) {
      border-color: var(--neutral-40, #bbb);
    }

    &:focus {
      border-color: var(--primary-color, #007bff);
      box-shadow: 0 0 0 3px var(--primary-soft, rgba(0, 123, 255, 0.1));
    }

    &--fullwidth {
      width: 100%;
      max-width: none;
    }

    &--disabled {
      background-color: var(--neutral-10, #f8f9fa);
      color: var(--text-disabled, #999);
      cursor: not-allowed;
      border-color: var(--neutral-20, #e9ecef);

      &::placeholder {
        color: var(--text-disabled, #999);
      }
    }

    &--error {
      border-color: var(--danger-color, #dc3545);

      &:focus {
        border-color: var(--danger-color, #dc3545);
        box-shadow: 0 0 0 3px var(--danger-soft, rgba(220, 53, 69, 0.1));
      }
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 4rem;
    max-height: 12rem;
  }

  /* Actions (confirmation buttons) */
  &__actions {
    display: flex;
    align-items: flex-start;
    gap: 0.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;

    &--placeholder {
      height: 2rem;
      opacity: 0;
      pointer-events: none;
    }
  }

  /* Custom button styles for form actions */
  :deep(.form-field__cancel-btn),
  :deep(.form-field__apply-btn) {
    border: 1px solid var(--neutral-30, #ddd) !important;
    border-radius: var(--border-radius-sm, 6px) !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
    }

    &:active {
      transform: translateY(0) !important;
      transition: all 0.1s ease !important;
    }
  }

  :deep(.form-field__cancel-btn) {
    background-color: var(--background-primary, #fff) !important;
    border-color: var(--neutral-40, #bbb) !important;
    color: var(--text-secondary, #666) !important;

    .icon-svg {
      color: var(--text-secondary, #666) !important;
    }

    &:hover {
      border-color: var(--danger-color, #dc3545) !important;
      background-color: var(--danger-soft, rgba(220, 53, 69, 0.05)) !important;
      color: var(--danger-color, #dc3545) !important;

      .icon-svg {
        color: var(--danger-color, #dc3545) !important;
      }
    }
  }

  :deep(.form-field__apply-btn) {
    background-color: var(--primary-soft, rgba(0, 123, 255, 0.1)) !important;
    border-color: var(--primary-color, #007bff) !important;
    color: var(--primary-color, #007bff) !important;

    .icon-svg {
      color: var(--primary-color, #007bff) !important;
    }

    &:hover {
      background-color: var(--primary-color, #007bff) !important;
      border-color: var(--primary-dark, #0056b3) !important;
      color: var(--primary-contrast, #fff) !important;

      .icon-svg {
        color: var(--primary-contrast, #fff) !important;
      }
    }
  }

  /* Info section (errors, help text) */
  &__info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: -0.25rem;
  }

  &__error {
    font-size: 0.75rem;
    color: var(--danger-color, #dc3545);
    line-height: 1.2;
    margin: 0;
  }

  /* Variants */
  &--inline {
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    .form-field__header {
      flex-shrink: 0;
      min-width: 120px;
    }

    .form-field__input-wrapper {
      flex: 1;
    }

    .form-field__info {
      margin-top: 0;
      margin-left: 1rem;
    }
  }

  &--disabled {
    opacity: 0.7;
  }

  &--error {
    .form-field__label {
      color: var(--danger-color, #dc3545);
    }
  }

  /* Improved focus management for confirmation mode */
  &--with-confirmation {
    .form-field__input:focus,
    .form-field__textarea:focus {
      border-color: var(--primary-color, #007bff);
      box-shadow: 0 0 0 3px var(--primary-soft, rgba(0, 123, 255, 0.1));
    }

    .form-field__actions {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:focus-within .form-field__actions {
      opacity: 1;
    }
  }

  /* Auto-confirmation mode (when changes are detected) */
  &:not(&--with-confirmation) {
    .form-field__actions {
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.3s ease;
    }

    &:hover .form-field__actions,
    &:focus-within .form-field__actions {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

/* Focus styles for better accessibility */
.form-field__input:focus-visible,
.form-field__textarea:focus-visible {
  outline: 2px solid var(--primary-color, #007bff);
  outline-offset: -2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .form-field__input,
  .form-field__textarea {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .form-field__input,
  .form-field__textarea,
  .form-field__actions {
    transition: none;
  }
}
</style>
