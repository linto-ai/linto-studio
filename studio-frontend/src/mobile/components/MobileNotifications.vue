<template>
  <div class="m-notifications" aria-live="polite">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="m-notification"
      :class="`m-notification--${notification.type}`">
      <PhIcon :name="iconFor(notification.type)" size="sm" />
      <span class="m-notification__message">{{ notification.message }}</span>
      <button
        v-if="notification.closable"
        type="button"
        class="m-notification__close"
        :aria-label="$t('mobile.common.close')"
        @click="removeNotification(notification)">
        <PhIcon name="x" size="sm" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import PhIcon from "@/components/atoms/PhIcon.vue"
import { NOTIFICATION_ICONS } from "@/mobile/const/notificationIcons.js"

// Renders the shared system/notifications queue with the mobile look and
// drops each notification once its timeout has passed (0 = sticky).
export default {
  name: "MobileNotifications",
  components: { PhIcon },
  computed: {
    ...mapGetters("system", ["notifications"]),
  },
  watch: {
    notifications: {
      immediate: true,
      handler(list) {
        list.forEach((notification) => this.scheduleExpiry(notification))
      },
    },
  },
  created() {
    this.timers = new Map()
  },
  beforeDestroy() {
    this.timers.forEach((timer) => clearTimeout(timer))
  },
  methods: {
    ...mapActions("system", ["removeNotification"]),
    scheduleExpiry(notification) {
      if (!notification.timeout || this.timers.has(notification.id)) return
      const timer = setTimeout(() => {
        this.timers.delete(notification.id)
        this.removeNotification(notification)
      }, notification.timeout)
      this.timers.set(notification.id, timer)
    },
    iconFor(type) {
      return NOTIFICATION_ICONS[type] ?? NOTIFICATION_ICONS.info
    },
  },
}
</script>

<style scoped>
.m-notifications {
  position: fixed;
  left: var(--m-space-3);
  right: var(--m-space-3);
  bottom: calc(var(--m-space-4) + var(--m-safe-bottom));
  display: flex;
  flex-direction: column;
  gap: var(--m-space-2);
  z-index: 50;
}

.m-notification {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  padding: var(--m-space-3) var(--m-space-4);
  border-radius: var(--m-radius);
  background: var(--m-surface);
  box-shadow: var(--m-shadow-3);
  border-left: 4px solid var(--m-info);
}

.m-notification--success {
  border-left-color: var(--m-primary);
}

.m-notification--error {
  border-left-color: var(--m-danger);
}

.m-notification--warning {
  border-left-color: var(--m-warning);
}

.m-notification__message {
  flex: 1;
}

.m-notification__close {
  border: none;
  background: transparent;
  min-width: var(--m-tap);
  min-height: var(--m-tap);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
