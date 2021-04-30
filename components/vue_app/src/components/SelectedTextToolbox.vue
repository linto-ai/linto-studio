<template>
  <div 
    id="selected-text-toolbox" 
    class="flex col" 
    :class="show ? 'visible' : 'hidden'" 
    :style="`top: ${parseInt(offsetY) + 25}px; left: ${parseInt(offsetX) - 170}px;`">
    
    <button class="selected-text-toolbox--btn close" @click="closeToolbox()"></button>
    

    <button 
      class="selected-text-toolbox--btn" 
      v-if="!!options.keywords && options.keywords === true">
      <span class="icon keywords"></span>
      <span class="label">Keyword</span>
    </button>
    <button 
      class="selected-text-toolbox--btn" 
      v-if="!!options.highlight && options.highlight === true"
      @click="openHighlightModal()">
      <span class="icon highlights"></span>
      <span class="label">highlights</span>
    </button>
    <button 
      class="selected-text-toolbox--btn"
      v-if="!!options.comment && options.comment === true">
        <span class="icon comment"></span>
        <span class="label">Comment</span>
      </button>
    <button 
      class="selected-text-toolbox--btn"
      v-if="!!options.split && options.split === true" 
      @click="openSplitModal()">
        <span class="icon split"></span>
        <span class="label">Split turns</span>
      </button>
      <button 
      class="selected-text-toolbox--btn"
      v-if="!!options.split && options.merge === true" 
      @click="openMergeModal()">
        <span class="icon merge"></span>
        <span class="label">Merge turns</span>
      </button>
    
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['editionMode', 'conversationId'],
  data () {
    return {
      show: false,
      selectionObj: null,
      offsetX: 0,
      offsetY: 0,
      options: {
        comment: false,
        highlight: false,
        keywords: false,
        split: false,
        merge: false
      }
    }
  },
  watch: {
    show (data) {
      if (data === true) {
          const audioPlayer = document.getElementById('audio-player')
          if(audioPlayer.classList.contains('isPlaying')){
            bus.$emit('audio_player_pause', {})
          }
      }
    }
  },
  mounted () {
    bus.$on('show_selected_toolbox', (data) => {
      this.show = true
      this.selectionObj = data.selectionObj
      this.offsetX = data.offsetX
      this.offsetY = data.offsetY
      this.convoId = data.convoId
      this.options = data.toolBoxOption
    })
  },
  methods: {
    closeToolbox() {
      this.show = false
      bus.$emit('close_selected_toolbox', {})
    },
    openHighlightModal () {
      console.log(this.selectionObj.startTurnId, this.selectionObj.endTurnId)
      if(this.selectionObj.startTurnId === this.selectionObj.endTurnId) {
        bus.$emit('highlight_modal_open', {
          selectionObj: this.selectionObj,
          conversationId: this.conversationId
        })
      }
      this.closeToolbox()
    },
    openSplitModal () {
      bus.$emit('split_modal_open', {
        selectionObj: this.selectionObj,
        convoId: this.convoId
      })
      this.closeToolbox()
    },
    openMergeModal() {
      console.log({
          turnids: [this.selectionObj.startTurnId, this.selectionObj.endTurnId],
          positions: [this.selectionObj.startTurnPosition, this.selectionObj.endTurnPosition],
          convoid: this.convoId
        })
      bus.$emit('merge_sentences_modal', {
          turnids: [this.selectionObj.startTurnId, this.selectionObj.endTurnId],
          positions: [parseInt(this.selectionObj.startTurnPosition), parseInt(this.selectionObj.endTurnPosition)],
          selectionObj: this.selectionObj,
          convoid: this.convoId
        })
    }
  }
}
</script>