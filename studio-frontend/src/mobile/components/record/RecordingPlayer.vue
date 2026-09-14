<template>
  <div class="m-player">
    <p v-if="failed" class="m-muted">{{ $t("mobile.queue.play_failed") }}</p>
    <p v-else-if="!url" class="m-muted">{{ $t("mobile.common.loading") }}</p>
    <audio
      v-else
      class="m-player__audio"
      controls
      preload="metadata"
      :src="url"></audio>
  </div>
</template>

<script>
import { getRecordingChunks } from "@/mobile/services/recording/queue.js"

// Plays a local recording back from its stored chunks. The object URL is
// created when the player shows up and revoked when it goes away.
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
    try {
      const chunks = await getRecordingChunks(this.recordingId)
      if (chunks.length === 0) {
        this.failed = true
        return
      }
      this.url = URL.createObjectURL(
        new Blob(chunks, { type: this.mimeType || undefined }),
      )
    } catch (error) {
      console.error("cannot load recording for playback", error)
      this.failed = true
    }
  },
  beforeDestroy() {
    if (this.url) URL.revokeObjectURL(this.url)
  },
}
</script>

<style scoped>
.m-player__audio {
  width: 100%;
  min-height: var(--m-tap);
}
</style>
