<template>
  <div class="notification-banner" :class="[variant, `align-${align}`]">
    <PhIcon
      v-if="icon"
      :name="icon"
      class="notification-banner__icon"
      size="sm" />
    <slot></slot>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "NotificationBanner",
  components: { PhIcon },
  props: {
    variant: {
      type: String,
      default: "info",
      validator: (v) =>
        ["info", "warning", "success", "error", "neutral"].includes(v),
    },
    icon: {
      type: String,
      default: "",
    },
    align: {
      type: String,
      default: "center",
      validator: (v) => ["center", "start"].includes(v),
    },
  },
}
</script>

<style scoped>
.notification-banner {
  background: var(--background-primary);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--small-gap);
  box-sizing: border-box;
  color: var(--text-primary);
  padding: var(--small-gap) var(--medium-gap);
  border: 1px solid var(--neutral-40);
  border-radius: 4px;
  font-size: var(--text-sm);
  line-height: 1.5;
}

.notification-banner.align-center {
  justify-content: center;
  text-align: center;
}

.notification-banner.align-start {
  justify-content: flex-start;
  text-align: left;
}

.notification-banner__icon {
  flex-shrink: 0;
}

.notification-banner.neutral {
  border-color: var(--neutral-30);
  color: var(--text-secondary);
  background: var(--neutral-5);
  border-style: dashed;
}

.notification-banner.success {
  border-color: var(--success-color);
  color: var(--success-color);
  background: var(--success-soft);
}

.notification-banner.warning {
  border-color: var(--warning-color);
  color: var(--dark-90);
  background: var(--warning-soft);
}

.notification-banner.error {
  border-color: var(--danger-color);
  color: var(--danger-color);
  background: var(--danger-soft);
}

.notification-banner.info {
  border-color: var(--linkHard);
  color: var(--linkHard);
  background: var(--linkSoft);
}
</style>
