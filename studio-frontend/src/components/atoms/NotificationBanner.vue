<template>
  <div class="notification-banner" :class="[variant, `align-${align}`]">
    <!-- With actions, the icon and the text are one box (__main) that a
         narrow banner never splits: the actions wrap under it, the text
         never goes under the icon. Without, the content stays as is
         (direct children of the flex). -->
    <template v-if="$slots.actions">
      <div class="notification-banner__main">
        <PhIcon
          v-if="icon"
          :name="icon"
          class="notification-banner__icon"
          size="sm" />
        <div class="notification-banner__content"><slot></slot></div>
      </div>
      <div class="notification-banner__actions">
        <slot name="actions"></slot>
      </div>
    </template>
    <template v-else>
      <PhIcon
        v-if="icon"
        :name="icon"
        class="notification-banner__icon"
        size="sm" />
      <slot></slot>
    </template>
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
// - inside: .notification-banner__icon; with actions, the icon and
//   .notification-banner__content (the text) are wrapped in
//   .notification-banner__main, followed by .notification-banner__actions
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
