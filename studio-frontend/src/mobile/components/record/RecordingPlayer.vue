<template>
  <div v-if="!hidden" class="m-player">
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
import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"

// TEMPORARY (iOS test, 2026-11-25): a second native recording comes out
// silent. Suspected: the WebView's <audio> makes WebKit change the app's
// audio session under the recorder. The player is hidden in the native
// app to check; restore once confirmed or ruled out.
const HIDE_PLAYER = IS_NATIVE_APP

// Plays a local recording back. `openAudio` resolves with where to read it
// ({ url, release }, null when nothing is stored): called when the player
// shows up, released when it goes away.
export default {
  name: "RecordingPlayer",
  props: {
    openAudio: { type: Function, required: true },
  },
  data() {
    return { url: null, failed: false, hidden: HIDE_PLAYER }
  },
  async created() {
    if (HIDE_PLAYER) return
    // Not reactive: only released, also when the player went away before
    // the audio was opened.
    this.audio = null
    this.closed = false
    try {
      this.audio = await this.openAudio()
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
