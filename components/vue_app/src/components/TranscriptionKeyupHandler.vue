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
    initKeyupHandler() {
      document.addEventListener("keydown", function(event) {
        const activeElement = document.activeElement.tagName
        //console.log(event)


        // Backspace
        if(event.code === 'Backspace' || event.keyCode === 8) {
          // Press backspace on first word of a turn on edition mode > merge with previous turn
          if(window.editionMode === true && activeElement === 'TD') {
            bus.$emit('transcription_bind_backspace', {})
          } 
        }
        
        // Enter
        if(event.code === 'Enter' || event.keyCode === 13) {
          // Press enter on edition mode > create turn
          if(window.editionMode === true && activeElement === 'TD') {
            bus.$emit('transcription_bind_enter', {})
          } 
        }
        
        // Space > play / pause
        if(event.code === 'Space' || event.keyCode === 32) {
          if(window.editionMode === false) {
            if(activeElement !== 'INPUT') {
              event.preventDefault()
              bus.$emit('audio_player_play_pause', {})
            }
          }
        }

        // Ctrl + arrow right > play next turn
        if(event.ctrlKey && event.key === "ArrowRight" && activeElement !== 'TD' && activeElement !== 'INPUT') {
          bus.$emit('audio_player_next_turn', {})
        }
        // Ctrl + arrow left > play previous turn
        if(event.ctrlKey && event.key === "ArrowLeft" && activeElement !== 'TD' && activeElement !== 'INPUT') {
          bus.$emit('audio_player_prev_turn', {})
        }
      })
    }
  }
}
</script>