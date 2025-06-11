<template>
  <button
    class="btn"
    :class="classes"
    :disabled="disabled || loading"
    v-bind="$attrs"
    v-on="$listeners">
    <!-- Loading icon -->
    <ph-icon
      v-if="loading"
      name="circle-notch"
      :weight="computedIconWeight"
      :color="computedIconColor"
      :size="size"
      class="animate-spin" />

    <!-- Left icon -->
    <ph-icon
      v-else-if="icon && iconPosition === 'left'"
      :name="icon"
      :weight="computedIconWeight"
      :color="computedIconColor"
      :size="size"
      :class="iconClasses" />

    <!-- Label/Content -->
    <span v-if="!isIconOnly" class="label">
      <slot>{{ label }}</slot>
    </span>

    <!-- Right icon -->
    <ph-icon
      v-if="!loading && icon && iconPosition === 'right'"
      :name="icon"
      :weight="computedIconWeight"
      :color="computedIconColor"
      :size="size"
      :class="iconClasses" />
  </button>
</template>

<script>
export default {
  name: "Button",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    iconPosition: {
      type: String,
      required: false,
      default: "left",
      validator: (value) => ["left", "right"].includes(value),
    },
    iconWeight: {
      type: String,
      required: false,
      default: "regular",
    },
    color: {
      type: String,
      required: false,
      default: "primary",
      validator: (value) =>
        [
          "primary",
          "secondary",
          "tertiary",
          "neutral",
          "primary-soft",
          "secondary-soft",
          "tertiary-soft",
          "neutral-soft",
        ].includes(value),
    },
    size: {
      type: String,
      required: false,
      default: "md",
      validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
    },
    shape: {
      type: String,
      required: false,
      default: "default",
      validator: (value) =>
        ["default", "rounded", "pill", "circle"].includes(value),
    },
    variant: {
      type: String,
      required: false,
      default: "solid",
      validator: (value) =>
        ["solid", "outline", "transparent", "text"].includes(value),
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    iconOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
    radium: {
      type: Boolean,
      required: false,
      default: false,
    },
    wrap: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    computedIconWeight() {
      if (this.variant === "solid") {
        return this.iconWeight || "fill"
      }
      return this.iconWeight || "regular"
    },
    computedIconColor() {
      if (this.variant === "solid") {
        return "primary-contrast"
      }
      return this.color || "primary"
    },
    isIconOnly() {
      return this.iconOnly || (this.icon && !this.label && !this.$slots.default)
    },
    classes() {
      const classes = []

      // Base classes
      classes.push("btn")

      // Variant/Color
      classes.push(this.color)

      // Size
      classes.push(this.size)

      // Shape
      if (this.shape !== "default") {
        classes.push(this.shape)
      }

      // Appearance
      if (this.variant === "outline") {
        classes.push("outline")
      } else if (this.variant === "transparent") {
        classes.push("transparent")
      } else if (this.variant === "text") {
        classes.push("text")
      }

      // Special variants
      if (this.radium) {
        classes.push("radium")
      }

      // Layout
      if (this.block) {
        classes.push("block")
      }

      if (this.isIconOnly) {
        classes.push("only-icon")
      }

      if (this.wrap) {
        classes.push("wrap")
      }

      // States
      if (this.disabled) {
        classes.push("disabled")
      }

      return classes
    },
    iconClasses() {
      const classes = ["icon"]
      classes.push(this.size)
      return classes
    },
  },
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
