<template>
  <div class="notification-banner" :class="variant">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "NotificationBanner",
  props: {
    variant: {
      type: String,
      default: "info",
      validator: (v) => ["info", "warning", "success", "error"].includes(v),
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
  box-sizing: border-box;
  color: var(--text-primary);
  padding: var(--small-gap) var(--medium-gap);
  border: 1px solid var(--neutral-40);
  border-radius: 4px;
  font-size: var(--text-sm);
  line-height: 1.5;
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
