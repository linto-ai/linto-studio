<template>
  <div class="notification-banner" :class="[variant, `align-${align}`]">
    <PhIcon
      v-if="icon"
      :name="icon"
      class="notification-banner__icon"
      size="sm" />
    <!-- With actions, the text gets its own box that wraps, and the buttons
         stay whole at the end, centered on however many lines it takes.
         Without, the content stays as is (direct children of the flex). -->
    <template v-if="$slots.actions">
      <div class="notification-banner__content"><slot></slot></div>
      <div class="notification-banner__actions">
        <slot name="actions"></slot>
      </div>
    </template>
    <slot v-else></slot>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// The component holds the markup; each app brings its own stylesheet for it
// (classic app: style/components/notification-banner.scss, mobile app:
// mobile/style/notification-banner.css). What a stylesheet styles is this
// contract:
// - root: .notification-banner, with the variant as a class (info, warning,
//   success, error, neutral) and align-center or align-start
// - inside: .notification-banner__icon, and with actions
//   .notification-banner__content (the text) + .notification-banner__actions
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
