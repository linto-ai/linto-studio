<template>
  <div style="width: 100%">
    <div
      v-if="playerError"
      class="conversation-audio-player-error flex row align-center justify-center">
      <span class="label">{{
        $t("conversation.transcription.player_error")
      }}</span>
    </div>
    <div id="conversation-audio-player-actions" class="flex row fullwidth">
      <button id="audio-player-play" :class="state" @click="playPause"></button>
      <div id="audio-player-timer">{{ currentTime }} / {{ duration }}</div>
      <div class="flex1">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    playerError: {
      type: Boolean,
      required: true,
    },
    currentTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  methods: {
    playPause(event) {
      this.$emit("playPause", event)
    },
  },
}
</script>
