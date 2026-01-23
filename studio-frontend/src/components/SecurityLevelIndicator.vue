<template>
  <Tooltip
    :text="tooltipText"
    position="bottom"
    class="security-level-indicator">
    <ph-icon
      :name="iconName"
      :color="iconColor"
      size="md"
      :weight="iconWeight" />
  </Tooltip>
</template>

<script>
import {
  SECURITY_LEVELS,
  SECURITY_LEVEL_ICONS,
  DEFAULT_SECURITY_LEVEL,
} from "@/const/securityLevels"

export default {
  name: "SecurityLevelIndicator",
  props: {
    level: {
      type: Number,
      default: null,
      validator: (value) => value === null || SECURITY_LEVELS.includes(value),
    },
  },
  computed: {
    iconName() {
      return SECURITY_LEVEL_ICONS[this.level] ?? SECURITY_LEVEL_ICONS[DEFAULT_SECURITY_LEVEL]
    },
    iconColor() {
      return "var(--text-secondary)"
    },
    iconWeight() {
      return "regular"
    },
    tooltipText() {
      const key = this.level ?? 0
      return this.$t(`conversation.security_level_txt.${key}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.security-level-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
