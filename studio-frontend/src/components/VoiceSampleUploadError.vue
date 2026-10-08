<template>
  <NotificationBanner variant="error" icon="warning-circle" align="start">
    {{ message }}
  </NotificationBanner>
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

export default {
  name: "VoiceSampleUploadError",
  components: { NotificationBanner },
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  // Appears at the bottom of a scrollable modal: bring it into view
  mounted() {
    this.$el.scrollIntoView({ block: "nearest", behavior: "smooth" })
  },
}
</script>
