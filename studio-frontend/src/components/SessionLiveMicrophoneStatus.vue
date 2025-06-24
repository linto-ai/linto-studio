<template>
  <div class="session-microphone-status" @click="toggleMicrophone">
    <div class="flex align-center gap-small center-text">
      <StatusLed :on="speaking" v-if="isRecording" />
      <span class="icon record-off" v-else />

      <span v-if="!channelWebsocket.state.isConnected">
        {{ $t("quick_session.live.status_no_websocket") }}
      </span>
      <span class="flex1" v-else-if="isRecording">{{
        $t("quick_session.live.status_recording")
      }}</span>
      <span class="flex1" v-else>
        {{ $t("quick_session.live.status_muted") }}
      </span>
    </div>
  </div>
</template>
<script>
import StatusLed from "./StatusLed.vue"

export default {
  props: {
    speaking: {
      type: Boolean,
      default: false,
    },
    isRecording: {
      type: Boolean,
      default: false,
    },
    channelWebsocket: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    toggleMicrophone() {
      this.$emit("toggle-microphone")
    },
  },
  components: {
    StatusLed,
  },
}
</script>
