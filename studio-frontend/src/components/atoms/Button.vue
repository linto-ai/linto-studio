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
    v-bind="$attrs"
    v-on="isDisabled ? null : $listeners">
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
    <img :src="avatar" v-else-if="avatar" class="icon" />
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
// The component holds the markup and the behaviour; each app brings its own
// stylesheet for it (classic app: style/components/buttons.scss, mobile app:
// mobile/style/buttons.css). What a stylesheet styles is this contract:
// - root: .btn, on a <button>, an <a> or a router-link
// - .btn--{variant}: primary, secondary, tertiary (default), text,
//   transparent, link
// - .btn--{intent}: default, destructive
// - .btn--{size}: xs, sm, md (default), lg, xl
// - .btn--block (full width), .btn--hovered (hover forced by the parent)
// - states: [disabled] / [aria-disabled], [multiline] (label on lines)
// - inside: .icon (icon, or the spinner while loading), .label (text); an
//   icon-only button has no .label child
// - knobs a parent may set: --btn-bg, --btn-text, --btn-border-color,
//   --btn-hover-bg, --btn-hover-text, --btn-padding, --btn-font-size,
//   --btn-height, --btn-border-radius
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
    // path to image
    avatar: {
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
      default: "regular", // thin, light, regular, bold, fill, duotone
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
    hovered: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "button", // button or submit
    },
  },
  computed: {
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
      if (this.hovered) {
        classes.push("btn--hovered")
      }
      return classes
    },
    styles() {
      return {
        borderColor: this.borderColor,
      }
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
