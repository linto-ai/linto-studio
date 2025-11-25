<template>
  <div class="flex1 flex col align-center justify-center">
    <RecordingIndicator :recording="isRecording" />
    <h4 class="center-text" v-if="isRecording">
      {{ $t("quick_session.live.status_recording") }}
    </h4>
    <h4 class="center-text" v-else>
      {{ $t("quick_session.live.status_muted") }}
    </h4>
    <div>00:17:30</div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import RecordingIndicator from "@/components/molecules/RecordingIndicator.vue"
export default {
  props: {
    channel: {
      type: Object,
      required: true,
    },
    isRecording: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {
    RecordingIndicator,
  },
}
</script>
