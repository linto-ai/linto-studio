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
import { SECURITY_LEVELS } from "@/const/securityLevels"

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
      switch (this.level) {
        case 2:
          return "shield-check"
        case 1:
          return "shield-warning"
        case 0:
        default:
          return "shield-slash"
      }
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
