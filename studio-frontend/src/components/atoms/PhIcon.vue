<template>
  <Icon
    v-if="iconName"
    :icon="iconName"
    :width="sizePx"
    :height="sizePx"
    :class="['icon-svg', color, animation]"
    :style="{ color: computedColor }"
    :horizontal-flip="mirrored" />
  <span v-else class="icon-svg missing-icon" :class="[size, color]">?</span>
</template>

<script>
import { Icon } from "@iconify/vue2"

const SIZE_MAP = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
}

export default {
  name: "PhIcon",
  components: { Icon },
  props: {
    name: { type: String, required: true },
    size: { type: [String, Number], default: "sm" },
    color: { type: String, default: "" },
    weight: { type: String, default: "regular" },
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
    sizePx() {
      const n = Number(this.size)
      if (n) return n + "px"
      return (SIZE_MAP[this.size] || 20) + "px"
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
