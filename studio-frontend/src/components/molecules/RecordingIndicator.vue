<template>
  <div
    @click="$emit('click')"
    class="recording-indicator"
    :class="{
      'recording-indicator--speaking': speaking,
      'recording-indicator--on': recording,
      'recording-indicator--off': !recording,
    }">
    <div class="recording-indicator__2nd-circle">
      <div class="recording-indicator__1st-circle">
        <PhIcon :name="icon" size="100" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    recording: {
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
  computed: {
    icon() {
      return this.recording ? "microphone" : "microphone-slash"
    },
  },
  methods: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.recording-indicator {
  height: 250px;
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recording-indicator__2nd-circle {
  border-radius: 150px;
  // background: rgba(92, 206, 176, 0.25);
  padding: 0px;
}

.recording-indicator--speaking.recording-indicator--on
  .recording-indicator__2nd-circle {
  animation: pulse 1.5s infinite;
  border: 8px solid rgba(92, 206, 176, 0.25);
}

.recording-indicator__1st-circle {
  padding: 32px;
  border-radius: 100px;
}

.recording-indicator--on .recording-indicator__1st-circle {
  background: rgba(92, 206, 176, 0.25);
}

.recording-indicator--off .recording-indicator__1st-circle {
  background: var(--danger-soft);
  //animation: blink 1.5s infinite;
}

@keyframes blink {
  0%,
  49% {
    background: var(--danger-soft);
  }

  50%,
  100% {
    background: transparent;
  }
}

@keyframes pulse {
  0% {
    padding: 0px;
    border-color: rgba(92, 206, 176, 0.25);
  }
  // 50% {
  // }
  100% {
    // padding: 32px;
    // background: rgba(92, 206, 176, 0.25);
    padding: 38px;
    border-color: rgba(92, 206, 176, 0);
  }
}
</style>
