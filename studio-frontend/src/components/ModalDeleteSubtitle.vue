<template>
  <Modal
    value
    @on-cancel="() => this.$emit('on-close')"
    @on-confirm="deleteSubtitle"
    :title="title"
    :actionBtnLabel="actionBtnLabel"
    :custom-class-button="{
      green: subtitleIds.length === 0,
      red: subtitleIds.length > 0,
    }"
    size="sm">
    <div class="form-field flex col">
      <span v-if="subtitleIds.length > 0">
        {{
          $t("conversation.subtitles.delete_description", {
            n: subtitleIds.length,
          })
        }}
      </span>
      <span v-else>
        {{ $t("conversation.subtitles.delete_no_selection") }}
      </span>
    </div>
  </Modal>
</template>
<script>
import { workerSendMessage } from "../tools/worker-message"
import Modal from "@/components/molecules/Modal.vue"
export default {
  props: {
    subtitleIds: {
      type: Array, // String Array
      required: true,
    },
  },
  data() {
    return {
      title:
        this.subtitleIds.length > 0
          ? this.$t("conversation.subtitles.delete_label")
          : this.$t("conversation.subtitles.delete_no_selection_label"),
      actionBtnLabel:
        this.subtitleIds.length > 0
          ? this.$t("conversation.subtitles.delete")
          : "Ok",
    }
  },
  methods: {
    async deleteSubtitle() {
      if (this.subtitleIds.length > 0) {
        workerSendMessage("delete_subtitles", {
          subtitleIds: this.subtitleIds,
        })
      }
      this.$emit("on-close")
    },
  },
  components: { Modal },
}
</script>
