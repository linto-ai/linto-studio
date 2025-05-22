<template>
  <ModalNew
    :title="title"
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
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"

import ModalNew from "./ModalNew.vue"
export default {
  props: {
    conversationsCount: { type: Number, required: true },
    conversationsInError: { type: Array, required: true },
  },
  data() {
    return {}
  },
  computed: {
    title() {
      if (this.conversationsInError.length > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple_error.title",
          this.conversationsInError.length,
        )
      }

      if (this.conversationsCount > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple.title",
          this.conversationsCount,
        )
      }

      return this.$i18n.t("conversation.delete_modal_multiple_empty.title")
    },
    content() {
      if (this.conversationsInError.length > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple_error.content",
          this.conversationsInError.length,
        )
      }

      if (this.conversationsCount > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple.content",
          this.conversationsCount,
        )
      }

      return this.$i18n.t("conversation.delete_modal_multiple_empty.content")
    },
    button_label() {
      if (this.conversationsInError.length > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple_error.button",
          this.conversationsInError.length,
        )
      }

      if (this.conversationsCount > 0) {
        return this.$i18n.tc(
          "conversation.delete_modal_multiple.button",
          this.conversationsCount,
        )
      }

      return this.$i18n.t("conversation.delete_modal_multiple_empty.button")
    },
    customClassButton() {
      if (this.conversationsInError.length > 0) {
        return {
          green: true,
        }
      }

      if (this.conversationsCount > 0) {
        return {
          red: true,
        }
      }

      return {
        green: true,
      }
    },
  },
  mounted() {},
  methods: {},
  components: { Fragment, ModalNew },
}
</script>
