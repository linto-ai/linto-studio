<template>
  <Icon
    v-if="iconName"
    :icon="iconName"
    :class="['icon-svg', sizeClass, color, animation]"
    :style="{ color: computedColor, ...sizeStyle }"
    :horizontal-flip="mirrored" />
  <span v-else class="icon-svg missing-icon" :class="[sizeClass, color]">?</span>
</template>

<script>
import { Icon } from "@iconify/vue2"

export default {
  name: "PhIcon",
  components: { Icon },
  props: {
    name: { type: String, required: true },
    size: { type: [String, Number], default: "sm" },
    color: { type: String, default: "" },
    weight: { type: String, default: "fill" },
    mirrored: { type: Boolean, default: false },
    animation: { type: String, default: "" },
  },
  computed: {
    iconName() {
      if (!this.name) return null
      const w = this.weight
      const suffix = w && w !== "regular" ? "-" + w : ""
      return `ph:${this.name}${suffix}`
    },
    sizeClass() {
      return isNaN(this.size) ? this.size : null
    },
    sizeStyle() {
      const px = Number(this.size)
      if (px) {
        return { width: px + "px", height: px + "px" }
      }
      return {}
    },
    computedColor() {
      return this.color || "currentColor"
    },
  },
}
</script>

<style lang="scss" scoped>
.icon-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  background: none;

  :deep(svg) {
    fill: currentColor;
  }

  &.pulse :deep(svg) {
    animation: pulse 2s infinite;
  }

  &.spin :deep(svg) {
    animation: spin 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.6);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.8);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &.lg {
    width: 24px;
    height: 24px;
  }

  &.md {
    width: 20px;
    height: 20px;
  }

  &.sm {
    width: 16px;
    height: 16px;
  }

  &.xs {
    width: 12px;
    height: 12px;
  }

  /* Color variants */
  &.primary {
    color: var(--primary-color);
  }

  &.secondary {
    color: var(--secondary-color);
  }

  &.tertiary {
    color: var(--tertiary-color);
  }

  &.neutral {
    color: var(--neutral-80);
  }
}

.missing-icon {
  font-size: 1.2em;
  opacity: 0.5;
}
</style>
