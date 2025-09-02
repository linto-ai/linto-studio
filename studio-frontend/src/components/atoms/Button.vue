<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :class="classes"
    :style="styles"
    :disabled="disabled"
    :aria-disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners">
    <ph-icon v-if="icon" :name="icon" :weight="iconWeight" :size="size" />
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
  },
  data() {
    return {}
  },
  computed: {
    isIconOnly() {
      return this.iconOnly || (this.icon && !this.label && !this.$slots.default)
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
