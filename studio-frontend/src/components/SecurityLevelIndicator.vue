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
export default {
  name: "SecurityLevelIndicator",
  props: {
    level: {
      type: String,
      default: null,
      validator: (value) =>
        value === null || ["insecure", "sensitive", "secure"].includes(value),
    },
  },
  computed: {
    iconName() {
      switch (this.level) {
        case "secure":
          return "shield-check"
        case "sensitive":
          return "shield-warning"
        case "insecure":
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
      switch (this.level) {
        case "secure":
          return this.$t("conversation.security_level_txt.secure")
        case "sensitive":
          return this.$t("conversation.security_level_txt.sensitive")
        case "insecure":
        default:
          return this.$t("conversation.security_level_txt.insecure")
      }
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
