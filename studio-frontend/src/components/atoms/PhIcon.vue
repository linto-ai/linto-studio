<template>
  <component
    v-if="iconComponent"
    :is="iconComponent"
    :weight="weight"
    :mirrored="mirrored"
    :class="['icon-svg', size, color, animation]"
    :style="{ color: color, ...style }"
  />
  <span v-else class="icon-svg missing-icon" :class="[size, color]">?</span>
</template>

<script>
import * as PhIcons from 'phosphor-vue';

export default {
  name: 'PhIcon',
  props: {
    name: { type: String, required: true }, // ex: 'House', 'User', etc.
    size: { type: [String, Number], default: 'sm' }, // xs, sm, md, lg, xl
    color: { type: String, default: '' }, // primary, secondary, etc.
    weight: { type: String, default: 'fill' }, // thin, light, regular, bold, fill, duotone
    mirrored: { type: Boolean, default: false },
    animation: { type: String, default: '' } // spin, pulse
  },
  computed: {
    iconComponent() {
      const camelCase = this.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const camelCaseName = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
      return PhIcons[`Ph${camelCaseName}`] || null;
    },
    style() {
      const size = Number(this.size)
      if (size) {
        return {
          width: size + 'px',
          height: size + 'px',
        }
      }
      return {}
    }
  }
};
</script>

<style scoped>
.icon-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;

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
}

.missing-icon {
  font-size: 1.2em;
  opacity: 0.5;
}
</style> 