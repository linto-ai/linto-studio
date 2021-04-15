<template>
  <div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  data () {
    return {}
  },
  mounted(){
    this.initKeyupHandler()
  },
    methods: {
    initKeyupHandler(editionMode) {
      document.addEventListener("keydown", function(event) {
        console.log(event)
        // Space > play / pause
        if(event.code === 'Space' || event.keyCode === 32) {
          bus.$emit('audio_player_play_pause', {})
        }

        // Ctrl + arrow right > play next turn
        if(event.ctrlKey && event.key === "ArrowRight") {
          bus.$emit('audio_player_next_turn', {})
        }

        // Ctrl + arrow left > play previous turn
        if(event.ctrlKey && event.key === "ArrowLeft") {
          bus.$emit('audio_player_prev_turn', {})
        }
      })
    }
  }
}
</script>