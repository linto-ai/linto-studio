<template>
  <NotificationBanner variant="warning" icon="warning" align="start">
    {{ message }}
  </NotificationBanner>
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import { VOICE_SAMPLE_DURATION } from "@/tools/voiceprintConstants.js"

export default {
  name: "VoiceSampleTooShortWarning",
  components: { NotificationBanner },
  props: {
    durationSeconds: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    message() {
      return this.$t("speaker_diarization.sample_too_short", {
        duration: Math.round(this.durationSeconds || 0),
        min: VOICE_SAMPLE_DURATION.MIN_SECONDS,
      })
    },
  },
}
</script>
