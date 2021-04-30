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
            <p>Your selection: "<strong>{{selectionTxt}}</strong>"</p>
          </div>

          <div class="form-field flex col">
            <span class="form-label">Choose a highlight : </span>
            <div class="flex row">
              <select v-model="highlight.value">
                <option v-for="hl in convo.highlights" :key="hl._id" :value="hl._id">{{hl.label}}</option>
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
      }
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
    handleHighlight() {
      this.$options.filters.testSelectField(this.highlight)
      if(this.highlight.valid)  {
        console.log('form valid')
      }
    },
    handleNewHighlight () {
      this.testNewHighlight()
      if(this.newHighlight.valid) {
        console.log('Form Valid')
        // todo > send request create highlight
        // todo > add highlights to selected words
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