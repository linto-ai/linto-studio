<template>
  <div class="label-input">
    <!-- Display mode -->
    <div 
      v-if="!isEditing" 
      class="label-input__display"
      @click="startEditing"
      :class="{ 'label-input__display--empty': !modelValue }"
    >
      {{ displayValue || placeholder }}
    </div>

    <!-- Edit mode -->
    <div v-else class="label-input__edit">
      <component
        :is="inputType === 'textarea' ? 'textarea' : 'input'"
        ref="inputElement"
        v-model="editValue"
        :type="inputType === 'textarea' ? undefined : inputType"
        :placeholder="placeholder"
        class="label-input__input"
        @keydown.enter="handleEnterKey"
        @keydown.escape="cancelEdit"
        @blur="onBlur"
      />
      
      <div class="label-input__actions">
        <button 
          type="button"
          class="label-input__btn label-input__btn--cancel"
          @click="cancelEdit"
          :title="$t ? $t('cancel') : 'Annuler'"
        >
          ✕
        </button>
        <button 
          type="button"
          class="label-input__btn label-input__btn--validate"
          @click="validateEdit"
          :title="$t ? $t('validate') : 'Valider'"
        >
          ✓
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabelInput',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    inputType: {
      type: String,
      default: 'input',
      validator: (value) => ['input', 'textarea', 'text', 'email', 'password', 'number'].includes(value)
    },
    placeholder: {
      type: String,
      default: ''
    },
    autoFocus: {
      type: Boolean,
      default: true
    },
    validateOnBlur: {
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
    }
  },

  methods: {
    startEditing() {
      this.isEditing = true
      this.editValue = this.modelValue || ''
      this.$emit('edit-start', this.editValue)
      
      this.$nextTick(() => {
        if (this.autoFocus && this.$refs.inputElement) {
          this.$refs.inputElement.focus()
          // Select all text for easy replacement
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
      if (this.inputType === 'textarea' && event.shiftKey) {
        return
      }
      
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
.label-input {
  position: relative;
  display: inline-block;
  min-width: 100px;

  &__display {
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 1.2em;
    word-break: break-word;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.1);
    }

    &--empty {
      color: #999;
      font-style: italic;
    }
  }

  &__edit {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  &__input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: inherit;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    // Styles spécifiques pour textarea
    &[is="textarea"] {
      resize: vertical;
      min-height: 60px;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__btn {
    width: 28px;
    height: 28px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f8f9fa;
    }

    &--cancel {
      color: #dc3545;

      &:hover {
        background-color: #dc3545;
        color: white;
        border-color: #dc3545;
      }
    }

    &--validate {
      color: #28a745;

      &:hover {
        background-color: #28a745;
        color: white;
        border-color: #28a745;
      }
    }
  }
}

.dark-theme .label-input {
  &__display {
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    &--empty {
      color: #666;
    }
  }

  &__input {
    background-color: #2a2a2a;
    border-color: #555;
    color: white;

    &:focus {
      border-color: #007bff;
    }
  }

  &__btn {
    background-color: #2a2a2a;
    border-color: #555;
    color: white;

    &:hover {
      background-color: #3a3a3a;
    }
  }
}
</style>
