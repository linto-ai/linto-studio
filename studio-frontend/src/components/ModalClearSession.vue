<template>
  <Modal
    value
    @on-cancel="() => this.$emit('on-close')"
    @on-confirm="confirmClear"
    :title="$t('session.detail_page.clear_confirm_title')"
    :actionBtnLabel="$t('session.detail_page.clear_confirm_button')"
    size="sm">
    {{ $t("session.detail_page.clear_confirm_message") }}
  </Modal>
</template>
<script>
import Modal from "@/components/molecules/Modal.vue"
export default {
  methods: {
    confirmClear() {
      this.$emit("on-confirm")
    },
  },
  components: { Modal },
}
</script>
