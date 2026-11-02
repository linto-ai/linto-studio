<template>
  <BareModal
    v-model="isOpen"
    :aria-label="$t('transcription_create.title')"
    :overlay-close="!isSending"
    :cancel-on-escape="!isSending">
    <!-- A scoped slot only renders once open: the flow is downloaded then, and
         destroyed on close, so each opening starts afresh. -->
    <template #content>
      <TranscriptionCreateFlow
        @close="isOpen = false"
        @sending-change="isSending = $event" />
    </template>
  </BareModal>
</template>
<script>
import BareModal from "@/components/molecules/BareModal.vue"
import LoadingStep from "./LoadingStep.vue"

export default {
  name: "TranscriptionCreateModal",
  components: {
    BareModal,
    TranscriptionCreateFlow: () => ({
      component: import("./TranscriptionCreateFlow.vue"),
      loading: LoadingStep,
      delay: 0,
    }),
  },
  data() {
    return {
      isSending: false,
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.getters["transcriptionCreate/isModalOpen"]
      },
      set(isOpen) {
        this.$store.dispatch("transcriptionCreate/setModalOpen", isOpen)
      },
    },
  },
}
</script>
