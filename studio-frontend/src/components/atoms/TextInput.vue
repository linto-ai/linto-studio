<template>
  <div
    :class="[
      'text-input',
      {
        'text-input--editing': isEditing,
        'text-input--disabled': disabled,
        'text-input--error': !!error
      }
    ]">

    <!-- Label -->
    <label v-if="label" class="text-input__label">{{ label }}</label>

    <!-- Display mode -->
    <div
      v-if="!isEditing"
      class="text-input__display"
      @click="startEditing"
      :class="{
        'text-input__display--empty': !modelValue,
        'text-input__display--multiline': multiline
      }">
      {{ displayValue || placeholder }}
    </div>

    <!-- Edit mode -->
    <div v-else class="text-input__edit">
      <component
        :is="multiline ? 'textarea' : 'input'"
        ref="inputElement"
        v-model="editValue"
        :type="multiline ? undefined : 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength || undefined"
        class="text-input__input"
        :class="{ 'text-input__input--multiline': multiline }"
        @keydown.enter="handleEnterKey"
        @keydown.escape="cancelEdit"
        @blur="onBlur" />

      <div class="text-input__actions">
        <Button
          @click="validateEdit"
          icon="check"
          size="sm"
          variant="solid"
          color="primary"
          shape="circle"
          :title="$t('validate')" />
      </div>
    </div>

    <!-- Helper / Error / Counter info line -->
    <div class="text-input__info-line" v-if="helperText || error || (showCounter && maxLength)">
      <span v-if="error" class="text-input__error">{{ errorMessage }}</span>
      <span v-else-if="helperText" class="text-input__helper">{{ helperText }}</span>
      <span v-if="showCounter && maxLength" class="text-input__counter">
        {{ currentLength }} / {{ maxLength }}
      </span>
    </div>
  </div>
</template>

<script>
import Button from './Button.vue'

export default {
  name: 'TextInput',
  
  components: {
    Button
  },
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    multiline: {
      type: Boolean,
      default: false
    },
    autoFocus: {
      type: Boolean,
      default: true
    },
    validateOnBlur: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },

    /* Optional UI enhancements */
    label: {
      type: String,
      default: ''
    },
    helperText: {
      type: String,
      default: ''
    },
    error: {
      type: [Boolean, String],
      default: false
    },
    maxLength: {
      type: Number,
      default: null
    },
    showCounter: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'edit-start', 'edit-cancel', 'edit-validate'],

  data() {
    return {
      isEditing: false,
      editValue: ''
    }
  },

  computed: {
    displayValue() {
      return this.modelValue || ''
    },

    currentLength() {
      return this.editValue.length
    },

    errorMessage() {
      if (typeof this.error === 'string') return this.error
      if (this.error === true) return this.$t ? this.$t('error') : 'Error'
      return ''
    }
  },

  methods: {
    startEditing() {
      if (this.disabled) return
      
      this.isEditing = true
      this.editValue = this.modelValue || ''
      this.$emit('edit-start', this.editValue)
      
      this.$nextTick(() => {
        if (this.autoFocus && this.$refs.inputElement) {
          this.$refs.inputElement.focus()
          if (this.$refs.inputElement.select) {
            this.$refs.inputElement.select()
          }
        }
      })
    },

    cancelEdit() {
      this.isEditing = false
      this.editValue = this.modelValue || ''
      this.$emit('edit-cancel')
    },

    validateEdit() {
      this.$emit('update:modelValue', this.editValue)
      this.$emit('edit-validate', this.editValue)
      this.isEditing = false
    },

    handleEnterKey(event) {
      if (this.multiline) {
        if (event.shiftKey) {
          // Allow newline insertion
          return
        }
        // Validate on Enter in multiline mode
        event.preventDefault()
        this.validateEdit()
        return
      }

      // Single-line input validation on Enter
      event.preventDefault()
      this.validateEdit()
    },

    onBlur() {
      if (this.validateOnBlur) {
        this.validateEdit()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-input {
  position: relative;
  display: block;
  width: 100%;

  &__display {
    padding: 0.5rem;
    border: 1px solid transparent;
    border-radius: var(--border-radius-sm, 4px);
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 1.2em;
    word-break: break-word;
    line-height: 1.4;

    &:hover {
      background-color: var(--neutral-10, rgba(0, 0, 0, 0.05));
      border-color: var(--neutral-30, rgba(0, 0, 0, 0.1));
    }

    &--empty {
      color: var(--text-secondary, #999);
      font-style: italic;
    }

    &--multiline {
      white-space: pre-wrap;
      min-height: 3em;
    }
  }

  &__edit {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  &__input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--neutral-30, #ddd);
    border-radius: var(--border-radius-sm, 4px);
    font-family: inherit;
    font-size: inherit;
    line-height: 1.4;
    outline: none;
    transition: border-color 0.2s ease;
    background-color: var(--background-primary, white);
    color: var(--text-primary, black);

    &:focus {
      border-color: var(--primary-color, #007bff);
      box-shadow: 0 0 0 2px var(--primary-soft, rgba(0, 123, 255, 0.25));
    }

    &--multiline {
      resize: vertical;
      min-height: 4em;
    }
  }

  &__actions {
    display: flex;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.2s ease;

    // Place the single validation button to the right of the input
    .btn {
      padding: 0.25rem;
    }
  }

  /* Highlight and smooth UX during editing */
  &--editing {
    .text-input__input {
      border-color: var(--primary-color, #007bff);
      box-shadow: 0 0 0 3px var(--primary-soft, rgba(0, 123, 255, 0.25));
    }

    .text-input__actions {
      opacity: 1;
    }
  }

  /* Disabled state styling */
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .text-input__display {
      cursor: not-allowed;
    }

    .text-input__input {
      cursor: not-allowed;
    }
  }

  /* Label */
  &__label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 600;
    color: var(--text-primary, #222);
    line-height: 1.2;
  }

  /* Helper / Error / Counter */
  &__info-line {
    margin-top: 0.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    line-height: 1.2;
  }

  &__helper {
    color: var(--text-secondary, #666);
  }

  &__error {
    color: var(--danger-color, #dc3545);
  }

  &__counter {
    color: var(--text-secondary, #666);
    margin-left: auto;
  }

  /* Error state */
  &--error {
    .text-input__input {
      border-color: var(--danger-color, #dc3545);
    }
  }
}
</style> 