<template>
  <button
    class="btn"
    :class="classes"
    :style="styles"
    :disabled="disabled || loading"
    v-bind="$attrs"
    :aria-disabled="disabled || loading"
    :title="isIconOnly ? $attrs.ariaLabel : ''"
    v-on="$listeners">
    <template v-if="isIconOnly">
      <ph-icon
        v-if="loading"
        name="circle-notch"
        :weight="computedIconWeight"
        :color="computedIconColor"
        :size="size"
        class="animate-spin" />

      <ph-icon
        v-else-if="icon"
        :name="icon"
        :weight="computedIconWeight"
        :color="computedIconColor"
        :size="size"
        :class="iconClasses" />

      <!-- Left avatar -->
      <Avatar
        v-else-if="avatar || avatarColor || avatarText"
        class="avatar"
        :text="avatarText"
        :color="avatarColor"
        :src="avatar"
        :size="avatarSize" />
    </template>
    <template v-else>
      <span class="btn-prefix-label">
        <span class="btn-prefix">
          <ph-icon
            v-if="loading"
            name="circle-notch"
            :weight="computedIconWeight"
            :color="computedIconColor"
            :size="size"
            class="animate-spin" />

          <!-- Left icon or avatar -->
          <ph-icon
            v-else-if="icon && iconPosition === 'left'"
            :name="icon"
            :weight="computedIconWeight"
            :color="computedIconColor"
            :size="size"
            :class="iconClasses" />

          <!-- Left avatar -->
          <Avatar
            v-else-if="avatar || avatarColor || avatarText"
            class="avatar"
            :text="avatarText"
            :color="avatarColor || color"
            :src="avatar"
            :size="avatarSize" />
        </span>

        <!-- Label/Content -->
        <span class="label">
          <slot>{{ label }}</slot>
        </span>
      </span>

      <!-- Right icon -->
      <ph-icon
        v-if="!loading && iconRight"
        :name="iconRight"
        :weight="computedIconWeight"
        :color="computedIconColor"
        :size="size"
        :class="iconClasses" />
      <ph-icon
        v-if="!loading && icon && iconPosition === 'right'"
        :name="icon"
        :weight="computedIconWeight"
        :color="computedIconColor"
        :size="size"
        :class="iconClasses" />
    </template>
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
    avatar: {
      type: String,
      required: false,
    },
    avatarText: {
      type: String,
      required: false,
    },
    avatarColor: {
      type: String,
      required: false,
    },
    avatarSize: {
      type: String,
      required: false,
      default: "sm",
      validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
    },
    icon: {
      type: String,
      required: false,
    },
    iconRight: {
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
          "primary-hard",
          "secondary-soft",
          "secondary-hard",
          "tertiary-soft",
          "tertiary-hard",
          "neutral-soft",
          "neutral-hard",
        ].includes(value),
    },
    borderColor: {
      type: String,
      required: false,
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
    styles() {
      return {
        borderColor: this.borderColor,
      }
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

.btn {
  .label + .icon {
    margin-left: 4px;
  }

  .btn-prefix-label {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    gap: 0.25em;
  }

  &.icon-only {
    .btn-prefix-label {
      gap: 0;
    }
  }
}
</style>
