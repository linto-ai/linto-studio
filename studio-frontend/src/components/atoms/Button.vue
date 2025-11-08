<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :class="classes"
    :style="styles"
    :disabled="isDisabled"
    :aria-disabled="isDisabled"
    :type="componentType === 'button' ? type : null"
    :multiline="multiline"
    v-bind="$attrs">
    <ph-icon
      v-if="loading"
      name="circle-notch"
      :size="size"
      class="animate-spin icon" />
    <ph-icon
      v-else-if="icon"
      :name="icon"
      :weight="iconWeight"
      :size="size"
      class="icon" />
    <span v-else-if="avatarText" class="icon">
      {{ avatarText }}
    </span>
    <span class="label flex1" v-if="label">
      <slot>{{ label }}</slot>
    </span>
    <span class="label flex1" v-else-if="$slots.default">
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
      default: "fill", // thin, light, regular, bold, fill, duotone
    },
    variant: {
      type: String,
      required: false,
      default: "tertiary",
      validator: (value) =>
        [
          "primary",
          "secondary",
          "tertiary",
          "text",
          "transparent",
          "link",
        ].includes(value),
    },
    intent: {
      type: String,
      required: false,
      default: "default",
      validator: (value) => ["default", "destructive"].includes(value),
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
    // variant: {
    //   type: String,
    //   required: false,
    //   default: "solid",
    //   validator: (value) =>
    //     ["solid", "outline", "transparent", "text", "link", "flat"].includes(
    //       value,
    //     ),
    // },
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
    multiline: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "button", // button or submit
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
        return !this.isDisabled ? "router-link" : "div"
      }
      return "button"
    },
    classes() {
      const classes = []
      classes.push("btn")
      classes.push(`btn--${this.intent}`)
      classes.push(`btn--${this.variant}`)
      classes.push(`btn--${this.size}`)
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
