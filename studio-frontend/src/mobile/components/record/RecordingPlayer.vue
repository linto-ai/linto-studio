<template>
  <div class="m-player">
    <p v-if="failed" class="m-muted">{{ $t("mobile.queue.play_failed") }}</p>
    <p v-else-if="!url" class="m-muted">{{ $t("mobile.common.loading") }}</p>
    <audio
      v-else
      class="m-player__audio"
      controls
      preload="metadata"
      :src="url"
      @error="failed = true"></audio>
  </div>
</template>

<script>
import { openRecordingAudio } from "@/mobile/services/recording/recordingAudio.js"

// Plays a local recording back from where its audio is stored. The URL is
// opened when the player shows up and released when it goes away.
export default {
  name: "RecordingPlayer",
  props: {
    recordingId: { type: String, required: true },
    mimeType: { type: String, default: "" },
  },
  data() {
    return { url: null, failed: false }
  },
  async created() {
    // Not reactive: only released, also when the player went away before
    // the audio was opened.
    this.audio = null
    this.closed = false
    try {
      this.audio = await openRecordingAudio(this.recordingId, this.mimeType)
    } catch (error) {
      console.error("cannot load recording for playback", error)
    }
    if (this.closed) this.audio?.release()
    this.url = this.audio?.url ?? null
    this.failed = this.audio === null
  },
  beforeDestroy() {
    this.closed = true
    this.audio?.release()
  },
}
</script>

<style scoped>
.m-player__audio {
  width: 100%;
  min-height: var(--m-tap);
}
</style>
