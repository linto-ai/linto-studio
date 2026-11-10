<template>
  <NotificationBanner
    :variant="notice.variant"
    :icon="notice.icon"
    align="start"
    role="status">
    {{ message }}
    <template v-if="notice.dismissible" #actions>
      <Button
        variant="transparent"
        icon="x"
        :aria-label="$t('mobile.common.close')"
        @click="$emit('dismiss')" />
    </template>
  </NotificationBanner>
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"
import { countRoundedMinutes } from "@/mobile/tools/countRoundedMinutes.js"

// The notice above the recorder (see pickRecordingNotice): what happens if
// the app is left, an automatic pause, or how much a pause cut out.
export default {
  name: "RecordingNotice",
  components: { NotificationBanner },
  props: {
    notice: { type: Object, required: true },
  },
  computed: {
    // A notice quoting a duration agrees with it (less than a minute, one
    // minute, several).
    message() {
      const { message, durationMs } = this.notice
      if (durationMs === undefined) return this.$t(message)
      return this.$tc(message, countRoundedMinutes(durationMs), {
        duration: formatDurationShort(durationMs),
      })
    },
  },
}
</script>
