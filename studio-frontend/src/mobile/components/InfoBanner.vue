<template>
  <div class="m-banner" :class="`m-banner--${tone}`" role="status">
    <PhIcon :name="icon" size="sm" />
    <span class="m-banner__text"><slot /></span>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

const TONE_ICONS = Object.freeze({
  info: "info",
  warning: "warning",
  danger: "warning-circle",
})

export default {
  name: "InfoBanner",
  components: { PhIcon },
  props: {
    tone: {
      type: String,
      default: "info",
      validator: (value) => value in TONE_ICONS,
    },
  },
  computed: {
    icon() {
      return TONE_ICONS[this.tone]
    },
  },
}
</script>

<style scoped>
.m-banner {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  padding: var(--m-space-2) var(--m-space-3);
  border-radius: var(--m-radius-sm);
  font-size: var(--m-font-size-sm);
  line-height: 1.35;
  background: var(--m-info-soft);
  color: var(--m-info);
}

.m-banner--warning {
  background: var(--m-warning-soft);
  color: var(--m-warning-text);
}

.m-banner--danger {
  background: var(--m-danger-soft);
  color: var(--m-danger);
}

.m-banner__text {
  flex: 1;
}
</style>
