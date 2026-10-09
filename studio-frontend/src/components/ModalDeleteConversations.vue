<template>
  <Modal
    :value="visible"
    :title="title"
    size="sm"
    :withActionDelete="hasMedias"
    :withActionApply="!hasMedias"
    :textActionDelete="button_label"
    :textActionApply="button_label"
    @delete="onDelete"
    @cancel="$emit('cancel')"
    @close="$emit('close')">
    <p>{{ content }}</p>
  </Modal>
</template>
<script>
import { mediaScopeMixin } from "@/mixins/mediaScope"
import Modal from "@/components/molecules/Modal.vue"

export default {
  components: { Modal },
  mixins: [mediaScopeMixin],
  props: {
    medias: { type: Array, required: true },
    visible: { type: Boolean, required: true },
  },
  computed: {
    conversationsCount() {
      return this.medias.length
    },
    hasMedias() {
      return this.conversationsCount > 0
    },
    title() {
      if (this.conversationsCount > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple.title",
          this.conversationsCount,
        )
      }

      return this.$i18n.t("conversation.delete_modal_multiple_empty.title")
    },
    content() {
      if (this.conversationsCount > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple.content",
          this.conversationsCount,
        )
      }

      return this.$i18n.t("conversation.delete_modal_multiple_empty.content")
    },
    button_label() {
      if (this.conversationsCount > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple.button",
          this.conversationsCount,
        )
      }

      return this.$i18n.t("conversation.delete_modal_multiple_empty.button")
    },
  },
  methods: {
    onDelete() {
      this.deleteMedias(this.medias.map((media) => media._id))
      this.$emit("confirm")
    },
  },
}
</script>
