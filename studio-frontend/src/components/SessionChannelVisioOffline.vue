<template>
  <div
    class="flex1 flex col align-center justify-center visio-offline-placeholder">
    <div class="visio-offline-placeholder__illustration flex">
      <VideoConf alt="video conference" class="illustration" />
    </div>
    <div class="visio-offline-placeholder__title-container">
      <h4>
        {{ $t("quick_session.live_visio.status_recording_visio") }}
      </h4>
      <p>
        {{ $t("quick_session.live_visio.status_recording_visio_description") }}
      </p>
    </div>
    <!-- <h4 class="center-text" v-if="isRecording">
      {{ $t("quick_session.live.status_recording") }}
    </h4>
    <h4 class="center-text" v-else>
      {{ $t("quick_session.live.status_muted") }}
    </h4> -->
  </div>
</template>
<script>
import { bus } from "@/main.js"
import VideoConf from "@/svg/videoConf.vue"

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
    speaking: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    toggleMicrophone() {
      this.$emit("toggleMicrophone")
    },
  },
  components: {
    VideoConf,
  },
}
</script>

<style lang="scss" scoped>
.visio-offline-placeholder__illustration {
  width: 300px;
  margin-bottom: 1rem;

  .illustration {
    height: auto;
  }
}

.visio-offline-placeholder__title-container {
  margin-inline: auto;
  width: fit-content;

  h4 {
    font-weight: 600;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    margin-top: 0.25rem;
    font-size: 1rem;
  }
}
</style>
