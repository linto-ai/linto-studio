<template>
  <div class="visio-placeholder flex1">
    <div class="visio-placeholder__circle" aria-hidden="true">
      <PhIcon name="video-camera" :size="64" />
    </div>
    <div class="visio-placeholder__title">
      {{ $t("quick_session.live_visio.status_recording_visio") }}
    </div>
    <p class="visio-placeholder__sub">
      {{ $t("quick_session.live_visio.status_recording_visio_description") }}
    </p>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// Center of the visio quick session when transcription only happens after
// the recording: nothing to show live, the bot records in the background.
// Visual sibling of MicrophonePlaceholder.
export default {
  name: "VisioPlaceholder",
  components: { PhIcon },
}
</script>

<style scoped>
.visio-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1rem;
}

.visio-placeholder__circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--danger-color);
  color: var(--danger-color);
}

.visio-placeholder__title {
  font-size: 1.1rem;
  font-weight: 600;
}

.visio-placeholder__sub {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  max-width: 42ch;
  text-align: center;
  margin: 0;
}
</style>
