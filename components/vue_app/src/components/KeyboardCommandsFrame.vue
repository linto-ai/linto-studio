<template>
  <div class="keyboard-commands-frame flex col" :class="visible ? 'visible' : 'hidden'">
    <span class="keyboard-commands__title">Keyboard commands</span>
    <button class="keyboard-commands-close" @click="closeCommands()"></button>
    <div class="flex col keyboard-commands-list">
      <div class="flex row keyboard-commands-item">
        <div class="keyboard-touch-container">
          <span class="keyboard-touch">Space</span>
        </div>
        <div class="flex1 keyboard-commands__desc-container">
          <span class="keyboard-commands__desc">Play / pause audio player</span>
        </div>
      </div>
      <div class="flex row keyboard-commands-item">
        <div class="keyboard-touch-container">
          <span class="keyboard-touch">ctrl</span> + <span class="keyboard-touch arrow-right"></span>
        </div>
        <div class="flex1 keyboard-commands__desc-container">
          <span class="keyboard-commands__desc">Play next turn</span>
        </div>
      </div>
      <div class="flex row keyboard-commands-item">
        <div class="keyboard-touch-container">
          <span class="keyboard-touch">ctrl</span> + <span class="keyboard-touch arrow-left"></span>
        </div>
        <div class="flex1 keyboard-commands__desc-container">
          <span class="keyboard-commands__desc">Play previous turn</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    bus.$on('show_player_commands', () => {
      this.showCommands()
    })
  },
  methods: {
    showCommands () {
      this.visible = true
    },
    closeCommands () {
      this.visible = false
    }
  }

}
</script>