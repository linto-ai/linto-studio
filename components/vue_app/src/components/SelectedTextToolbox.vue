<template>
  <div id="selected-text-toolbox" :class="show ? 'visible' : 'hidden'" :style="`top: ${parseInt(offsetY)- 45}px; left: ${parseInt(offsetX) - 100}px;`">
    <button 
      class="selected-text-toolbox--btn highlight" 
      v-if="!!options.keywords && options.keywords === true">Keyword</button>
    <button 
      class="selected-text-toolbox--btn highlight" 
      v-if="!!options.highlight && options.highlight === true"
      @click="openHighlightModal()">Highlight</button>
    <button 
      class="selected-text-toolbox--btn comment"
      v-if="!!options.comment && options.comment === true">Comment</button>
    <button 
      class="selected-text-toolbox--btn comment"
      v-if="!!options.split && options.split === true" 
      @click="openSplitModal()">Split turns</button>
      <button 
      class="selected-text-toolbox--btn comment"
      v-if="!!options.split && options.merge === true" 
      @click="openMergeModal()">Merge turns</button>
    
    <button class="selected-text-toolbox--btn close" @click="closeToolbox()"></button>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['content', 'selection', 'conversationId'],
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
        if (this.content.length === 1) {
          this.showKeywordOption = true
          const audioPlayer = document.getElementById('audio-player')
          if(audioPlayer.classList.contains('isPlaying')){
            bus.$emit('audio_player_pause', {})
          }
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
      this.closeToolbox()
      bus.$emit('highlight_modal_open', {
        content: this.content,
        selectionObj: this.selectionObj,
        conversationId: this.conversationId
      })
    },
    openSplitModal () {
      this.closeToolbox()
      bus.$emit('split_modal_open', {
        selectionObj: this.selectionObj,
        convoId: this.convoId
      })
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