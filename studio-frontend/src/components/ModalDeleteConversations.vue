<template>
  <Alert
    :visible="visible"
    :title="title"
    :message="content"
    @confirm="onConfirm"
    @cancel="onCancel"></Alert>
  <!-- <Modal
    :title="title"
    value
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="($event) => this.$emit('on-confirm')"
    :actionBtnLabel="button_label"
    :no-apply="conversationsInError.length > 0"
    small
    :customClassButton="customClassButton">
    <p>{{ content }}</p>
    <ul v-if="conversationsInError.length > 0">
      <li v-for="conv of conversationsInError">
        {{ conv.name }}
      </li>
    </ul>
  </Modal> -->
</template>
<script>
import { mediaScopeMixin } from "@/mixins/mediaScope"

export default {
  mixins: [mediaScopeMixin],
  props: {
    medias: { type: Array, required: true },
    visible: { type: Boolean, required: true },
  },
  data() {
    return {}
  },
  computed: {
    conversationsCount() {
      return this.medias.length
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
  mounted() {},
  methods: {
    onConfirm() {
      this.deleteMedias(this.medias.map((media) => media._id))
      this.$emit("confirm")
    },
    closeModal() {},
    onCancel() {
      this.$emit("cancel")
    },
  },
}
</script>
