<template>
  <div class="modal-wrapper flex col" :class="showModal ? 'visible': 'hidden'" >
    <div class="modal">
      <div class="modal--header flex1">
        Highlights
        <button @click="close()">close</button>
      </div>
      <div class="modal--body">
      </div>
      <div class="modal--footer">
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
      content: null
    }
  },
  computed: {
    dataLoaded () {
      return this.convosLoaded
    },
    convoHighlights () {
      return this.$store.getters.highlightsByConversationId(this.conversationId)
    }
  },
  mounted () {
    bus.$on('highlight_modal_open', (data) => {
      this.content = data.content
      this.showModal = true
    })
  },
  methods: {
    close () {
      this.showModal = false
    },
    async dispatchConversations () {
      this.convosLoaded = await this.$options.filters.dispatchStore('getConversations')
    }
  }
}
</script>