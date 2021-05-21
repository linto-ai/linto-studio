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
    window.keyupEnabled = true
    bus.$on('keyup_handler_disable', () => {
      window.keyupEnabled = false
    })
    bus.$on('keyup_handler_enable', () => {
      window.keyupEnabled = true
    })
  },
  methods: {
    initKeyupHandler() {
      document.addEventListener("keydown", function(event) {
        //console.log(event)
        //console.log(window.keyupEnabled)
        // Space > play / pause
        if(event.code === 'Space' || event.keyCode === 32) {
          if(window.keyupEnabled) bus.$emit('audio_player_play_pause', {})
        }
        // Ctrl + arrow right > play next turn
        if(event.ctrlKey && event.key === "ArrowRight") {
          if(window.keyupEnabled) bus.$emit('audio_player_next_turn', {})
        }
        // Ctrl + arrow left > play previous turn
        if(event.ctrlKey && event.key === "ArrowLeft") {
          if(window.keyupEnabled) bus.$emit('audio_player_prev_turn', {})
        }
      })
    }
  }
}
</script>