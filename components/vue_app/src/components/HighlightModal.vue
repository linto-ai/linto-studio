<template>
  <div class="modal-wrapper flex col" :class="showModal ? 'visible': 'hidden'" >
    <div class="modal">
      <div class="modal--header flex row">
        <span class="title flex1">Highlight words</span>
          <button class="btn--icon btn--icon__no-bg editspeaker" @click="closeModal()">
            <span class="icon icon--close"></span>
          </button>
      </div>
      <div class="modal--body words-highlights">
          <div class="modal-words-selected">
            <p>Your selection: "<strong>{{selectionTxt.txt}}</strong>"</p>
          </div>

          <div class="form-field flex col" v-if="convo.highlights.length > 0">
            <span class="form-label">Choose a highlight : </span>
            <div class="flex row">
              <select v-model="highlight.value">
                <option v-for="hl in convo.highlights" :key="hl.hid" :value="hl.hid">{{hl.label}}</option>
              </select>

              <button @click="handleHighlight()" class="btn btn--txt-icon green" style="margin-left: 10px;">
                <span class="label">Set Highlight</span>
                <span class="icon icon__apply"></span>
              </button>
            </div>
            <span class="error-field" v-if="highlight.error !== null">{{ highlight.error }}</span>
          </div>

           <div class="form-field flex col">
            <span class="form-label">Or create a new highlight : </span>
            <div class="flex row">
              <input type="text" v-model="newHighlight.value">
               <input 
                type="color" 
                v-model="newHighlightColor" 
                class="transcription-options--item-color"
              >

              <button style="margin-left: 10px;" @click="handleNewHighlight()" class="btn btn--txt-icon green">
                <span class="label">Create Highlight</span>
                <span class="icon icon__apply"></span>
              </button>
            </div>
            <span class="error-field" v-if="newHighlight.error !== null">{{ newHighlight.error }}</span>
          </div>
      </div>
      <div class="modal--footer">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">Cancel</span>
          <span class="icon icon__cancel"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['conversationId'],
  data () {
    return {
      convosLoaded: false,
      showModal: false,
      selectionObj: null,
      convoId: null,
      highlight: {
        value: '',
        error: null,
        valid: false
      },
      newHighlight: {
        value: '',
        error: null,
        valid: false
      },
      newHighlightColor: '#B4D455',
    }
  },
  computed: {
    dataLoaded () {
      return this.convosLoaded
    },
    convo () {
      return this.$store.getters.conversationById(this.conversationId)
    },
    
    selectionTxt() {
      if(this.selectionObj !== null && !!this.conversationId){
        return this.$store.getters.wordsToTextBetweenWordIds(this.conversationId, 
        this.selectionObj)
      }
      return ''
    }
  },
  mounted () {
    bus.$on('highlight_modal_open', (data) => {
      this.selectionObj = data.selectionObj
      this.convoId = data.conversationId
      this.showModal = true
    })
  },
  methods: {
    closeModal () {
      this.showModal = false
    },
    async dispatchConversations () {
      this.convosLoaded = await this.$options.filters.dispatchStore('getConversations')
    },
    async handleHighlight() {
      try {
        this.$options.filters.testSelectField(this.highlight)
        if(this.highlight.valid)  {
          const payload =  {
            hid: this.highlight.value,
            wordids: this.selectionTxt.wordids,
            operator: 'add'
          }
          const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/highlight/${this.highlight.value}`, 'put', payload)

          if(req.status === 200 && !!req.data.msg) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg,
              timeout: 3000
            })
            this.closeModal()
            bus.$emit('refresh_conversation', {})

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
    async handleNewHighlight () {
      try {
        this.testNewHighlight()
        if(this.newHighlight.valid) {
          const payload =  {
            label: this.newHighlight.value,
            wordids: this.selectionTxt.wordids,
            color: this.newHighlightColor,
          }

          const req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversation/${this.convoId}/highlight`, 'post', payload)

          if(req.status === 200 && !!req.data.msg) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg,
              timeout: 3000
            })
            this.closeModal()
            bus.$emit('refresh_conversation', {})

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
    testNewHighlight () {
      this.$options.filters.testName(this.newHighlight)
      if(this.newHighlight.valid) {
        // check if highlight name is not already used
        let highlightNameUsed = this.convo.highlights.filter(hl => hl.label === this.newHighlight.value) 
        
        if(highlightNameUsed.length > 0){
          this.newHighlight.error = "This highlight name already exists"
          this.newHighlight.valid = false
        }
      }
    },
  }
}
</script>