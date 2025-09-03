<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :class="classes"
    :style="styles"
    :disabled="isDisabled"
    :aria-disabled="isDisabled"
    v-bind="$attrs"
    v-on="$listeners">
    <ph-icon
      v-if="loading"
      name="circle-notch"
      :weight="computedIconWeight"
      :size="size"
      class="animate-spin" />
    <ph-icon v-else-if="icon" :name="icon" :weight="iconWeight" :size="size" />
    <span v-else-if="avatarText">
      {{ avatarText }}
    </span>
    <span class="label" v-if="label">
      <slot>{{ label }}</slot>
    </span>
    <span class="label" v-else-if="$slots.default">
      <slot></slot>
    </span>
    <ph-icon
      v-if="iconRight"
      :name="iconRight"
      :weight="iconWeight"
      :size="size" />
  </component>
</template>
<script>
import { bus } from "@/main.js"
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
    avatarText: {
      type: String,
      required: false,
    },
    iconRight: {
      type: String,
      required: false,
    },
    iconWeight: {
      type: String,
      required: false,
      default: "fill",
    },
    color: {
      type: String,
      required: false,
      default: "primary",
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
      validator: (value) => ["default", "circle"].includes(value),
    },
    variant: {
      type: String,
      required: false,
      default: "solid",
      validator: (value) =>
        ["solid", "outline", "transparent", "text", "link", "flat"].includes(
          value,
        ),
    },
    borderColor: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      type: [String, Object],
      required: false,
    },
    href: {
      type: String,
      required: false,
    },
    // fullwidth button
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    isIconOnly() {
      return this.iconOnly || (this.icon && !this.label && !this.$slots.default)
    },
    isDisabled() {
      return this.disabled || this.loading
    },
    componentType() {
      if (this.href) {
        return "a"
      }
      if (this.to) {
        return "router-link"
      }
      return "button"
    },
    classes() {
      const classes = []
      classes.push("btn")
      classes.push(`btn--${this.color}`)
      classes.push(`btn--${this.size}`)
      classes.push(`btn--${this.variant}`)
      if (this.block) {
        classes.push("btn--block")
      }
      return classes
    },
    styles() {
      return {
        borderColor: this.borderColor,
      }
    },
  },
  mounted() {},
  methods: {},
  components: {},
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
