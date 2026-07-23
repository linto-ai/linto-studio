<template>
  <div class="app-notifications">
    <transition-group
      name="notification"
      tag="div"
      class="notifications-container">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification',
          `notification--${notification.type || 'info'}`,
          { 'notification--closable': notification.closable !== false },
        ]"
        @click="onNotificationClick(notification)">
        <div class="notification__content">
          <p class="notification__message">{{ notification.message }}</p>
        </div>

        <button
          v-if="notification.closable !== false"
          class="notification__close"
          :aria-label="$t('modal.close')"
          @click.stop="closeNotification(notification)"
          type="button">
          <PhIcon name="x" size="xs" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"

import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "AppNotifications",
  components: { PhIcon },
  data() {
    return {
      timers: new Map(),
    }
  },
  computed: {
    ...mapGetters("system", ["notifications"]),
  },
  watch: {
    notifications: {
      handler(newNotifications, oldNotifications) {
        // Handle new notifications that need auto-close
        newNotifications.forEach((notification) => {
          if (!this.timers.has(notification.id) && notification.timeout > 0) {
            this.setAutoCloseTimer(notification)
          }
        })

        // Clean up timers for removed notifications
        if (oldNotifications) {
          oldNotifications.forEach((oldNotification) => {
            if (!newNotifications.find((n) => n.id === oldNotification.id)) {
              this.clearTimer(oldNotification.id)
            }
          })
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapMutations("system", ["removeNotification"]),

    closeNotification(notification) {
      this.clearTimer(notification.id)
      this.removeNotification(notification)
    },

    onNotificationClick(notification) {
      if (notification.closable !== false) {
        this.closeNotification(notification)
      }
    },

    setAutoCloseTimer(notification) {
      if (notification.timeout && notification.timeout > 0) {
        const timer = setTimeout(() => {
          this.closeNotification(notification)
        }, notification.timeout)

        this.timers.set(notification.id, timer)
      }
    },

    clearTimer(notificationId) {
      const timer = this.timers.get(notificationId)
      if (timer) {
        clearTimeout(timer)
        this.timers.delete(notificationId)
      }
    },
  },

  beforeDestroy() {
    // Clean up all timers
    this.timers.forEach((timer) => clearTimeout(timer))
    this.timers.clear()
  },
}
</script>

<style lang="scss" scoped>
.app-notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notifications-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--neutral-10);
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 400px;

  &--closable {
    cursor: pointer;
  }

  &--success {
    border-left: 4px solid var(--success-color, #10b981);
  }

  &--error {
    border-left: 4px solid var(--danger-color, #ef4444);
  }

  &--warning {
    border-left: 4px solid var(--warning-color, #f59e0b);
  }

  &--info {
    border-left: 4px solid var(--info-color, #3b82f6);
  }
}

.notification__content {
  flex: 1;
  min-width: 0;
}

.notification__message {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--neutral-90);
  word-wrap: break-word;
}

.notification__close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--neutral-60);
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--neutral-20);
    color: var(--neutral-80);
  }
}

// Transitions
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
