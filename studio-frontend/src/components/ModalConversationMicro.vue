<template>
    <Modal
      v-bind="$attrs"
      v-model="isModalOpen"
      title="Microphone"
      subtitle="Connectez votre microphone…"
      size="lg"
      @on-confirm="$emit('on-confirm')"
      @on-cancel="$emit('on-cancel')">
      <div class="flex row gap-small">
        <div class="flex1">
            <div class="flex row gap-small">
                Test du microphone…
            </div>
        </div>
      </div>
    </Modal>
  </template>
  
  <script>
  import Modal from "@/components/molecules/Modal.vue"
  
  export default {
    name: "ModalConversationMicro",
    components: {
      Modal,
    },
    props: {
      value: { type: Boolean, default: false },
    },
    computed: {
      isModalOpen: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit("input", value)
        },
      },
    },
  }
  </script>
