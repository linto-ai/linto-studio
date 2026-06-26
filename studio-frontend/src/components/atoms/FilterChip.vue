<template>
  <label class="filter-chip" :class="{ 'filter-chip--disabled': disabled }">
    <img v-if="image" :src="image" alt="" class="filter-chip__image" />
    <PhIcon v-else-if="icon" :name="icon" size="sm" class="filter-chip__icon" />
    <span class="filter-chip__label">
      {{ label }}
    </span>
    <span v-if="count != null" class="filter-chip__count">
      {{ count }}
    </span>
    <input
      type="radio"
      v-model="_value"
      :value="chipValue"
      :disabled="disabled" />
  </label>
</template>
<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "FilterChip",
  components: { PhIcon },
  props: {
    value: {
      type: [String, Object, Number],
      default: null,
    },
    chipValue: {
      type: [String, Object, Number],
      default: null,
    },
    label: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: false,
      default: null,
    },
    // Phosphor icon name, rendered before the label.
    icon: {
      type: String,
      default: "",
    },
    // Image source, rendered before the label (takes precedence over icon).
    image: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit("input", newValue)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.25em 0.6em;
  box-sizing: border-box;
  height: 32px;
  border: var(--border-button);
  border-radius: 50px;
  background-color: var(--background-primary);
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  margin: 0;

  &:hover {
    opacity: 0.8;
  }

  input[type="radio"] {
    display: none;
  }
}

.filter-chip__image {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.filter-chip__count {
  border-radius: 15px;
  min-width: 16px;
  text-align: center;
  padding: 3px;
  background-color: var(--neutral-20);
  height: calc(100% - 1px);
  color: var(--text-secondary);
}

.filter-chip:has(input[type="radio"]:checked) {
  border-color: var(--primary-color);
  outline: 1px solid var(--primary-color);
  color: var(--primary-color);
  background-color: var(--primary-soft);
}

.filter-chip--disabled {
  cursor: not-allowed;
  opacity: 0.5;

  &:hover {
    opacity: 0.5;
  }
}
</style>
