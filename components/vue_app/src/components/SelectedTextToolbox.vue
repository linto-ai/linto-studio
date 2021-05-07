<template>
  <div 
    v-if="convoLoaded"
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
    
    
    <div class="selected-text-toolbox--parent flex col" v-if="unHighlightLinks && options.wordsHighlights.length > 0">
      <button class="selected-text-toolbox--btn" @click="unhighlightLinkVisible = !unhighlightLinkVisible">
        <span class="icon unhighlight"></span>
        <span class="label">unhighlight</span>
      </button>
      <div class="selected-text-toolbox--child flex col" :class="unhighlightLinkVisible ? 'visible' : 'hidden'">
        <button 
          v-for="hl in options.wordsHighlights" 
          :key="hl" 
          @click="removeHighlightFromWords(hl)"
          class="selected-text-toolbox--btn"
        >
        <span class="icon remove"></span>
        <span class="label">remove "{{convoHighlights[convoHighlights.findIndex(convoHl => convoHl.hid === hl)].label }}"</span>
      </button>
          
      </div>

    </div>

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
      convoLoaded: false,
      selectionObj: null,
      offsetX: 0,
      offsetY: 0,
      options: {
        comment: false,
        highlight: false,
        unhighlight: false,
        keywords: false,
        split: false,
        merge: false
      },
      unhighlightLinkVisible: false
    }
  },
  computed: {
    unHighlightLinks () {
        return (!!this.options.unhighlight && this.options.unhighlight === true && 
        !!this.options.wordsHighlights)
    },
    convoHighlights () {
      if(this.convoLoaded) {
        return this.$store.getters.conversationHighlights(this.conversationId)
      } 
      return []
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
  async mounted () {
    bus.$on('show_selected_toolbox', async (data) => {
      await this.dispatchConversations()
      this.show = true
      this.selectionObj = data.selectionObj
      this.offsetX = data.offsetX
      this.offsetY = data.offsetY
      this.convoId = data.convoId
      this.options = data.toolBoxOption
      this.unhighlightLinkVisible = false
    })
  },
  methods: {
    async removeHighlightFromWords(hl) {
      try {
        if(!!this.selectionObj.words && this.selectionObj.words !== []){
          const payload =  {
            hid: hl,
            wordids: this.selectionObj.words.wordids,
            operator: 'remove'
          }
          const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/highlight/${hl}`, 'put', payload)

          if(req.status === 200 && !!req.data.msg) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg,
              timeout: 3000
            })
            this.options.wordsHighlights = this.options.wordsHighlights.filter(wordsHl => wordsHl !== hl)
            
            bus.$emit('refresh_conversation', {refresh : await this.dispatchConversations() })

          } else {
            throw req
          }
        }
      } catch (error) {
         if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        bus.$emit('app_notif', {
          status: 'error',
          message: !!error.msg ? error.msg : 'Error on updating speaker',
          timeout: null
        })
      }
    },
    closeToolbox() {
      this.show = false
      bus.$emit('close_selected_toolbox', {})
    },
    openHighlightModal () {
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
      bus.$emit('merge_sentences_modal', {
        turnids: [this.selectionObj.startTurnId, this.selectionObj.endTurnId],
        positions: [parseInt(this.selectionObj.startTurnPosition), parseInt(this.selectionObj.endTurnPosition)],
        selectionObj: this.selectionObj,
        convoid: this.convoId
      })
    },
    async dispatchConversations () {
      this.convoLoaded = await this.$options.filters.dispatchStore('getConversations')
    }
  }
}
</script>