<template>
  <div class="modal-wrapper flex col" :class="modalShow ? 'visible' : 'hidden'">
    <div class="modal">
      <div class="modal--header flex row">
        <span class="title flex1">{{ modalTitle }}</span>
        <button class="btn--icon btn--icon__no-bg" @click="closeModal()">
          <span class="icon icon--close"></span>
        </button>
      </div>
      <div class="modal--body flex col">
        <p v-html="modalContent"></p>
      </div>

      <div class="modal--footer flex row">
        <button class="btn btn--txt-icon grey" @click="closeModal()">
          <span class="label">{{ $t('buttons.close') }}</span>
          <span class="icon icon__cancel"></span>
        </button>
        <button v-if="status === 'valid_changes'" class="btn btn--txt-icon green" @click="applyChanges()">
          <span class="label">Apply changes</span>
          <span class="icon icon__cancel"></span>
        </button>
        <button v-if="status === 'cancel_changes'" class="btn btn--txt-icon red" @click="cancelChanges()">
          <span class="label">Cancel changes</span>
          <span class="icon icon__cancel"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default { 
  data() {
    return {
      modalShow: false,
      status: '',
      modalTitle: '',
      modalContent: ''
    }
  },
  mounted () {
    bus.$on('edit_conversation_modal', (data) => {
      this.status = data.status
      if(this.status === 'valid_changes') {
        this.modalTitle = 'Apply changes'
        this.modalContent = 'Are you sure you want to save changes? Those changes will be parmanent.'
      } else if(this.status === 'cancel_changes') {
        this.modalTitle = 'Cancel changes'
        this.modalContent = 'Unsaved changes. Are you sure you want to cancel changes ?'
      }
      this.modalShow = true
    })
  },
  methods: {
    closeModal () {
      this.modalShow = false
    },
    applyChanges () {
      bus.$emit('edit_conversation_apply_changes', {})
      this.closeModal()
    },
    cancelChanges () {
      bus.$emit('edit_conversation_cancel_changes', {})
      this.closeModal()

    }
  }

}
</script>
