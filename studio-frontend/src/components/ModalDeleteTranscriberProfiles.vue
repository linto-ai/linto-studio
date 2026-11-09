<template>
  <Modal
    value
    @on-cancel="$emit('on-close')"
    @on-delete="$emit('on-confirm')"
    :title="$tc('modal_delete_transcriber_profiles.title', count)"
    withActionDelete
    :withActionApply="false"
    :textActionDelete="
      $tc('modal_delete_transcriber_profiles.action_btn', count)
    "
    size="sm">
    {{ $tc("modal_delete_transcriber_profiles.content", count) }}
  </Modal>
</template>
<script>
import Modal from "@/components/molecules/Modal.vue"

export default {
  props: {
    count: { type: Number, required: true },
  },
  components: { Modal },
}
</script>
