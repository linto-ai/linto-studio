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
import { apiDeleteSubtitles } from "../api/subtitle.js"
import { bus } from "@/main.js"
import Modal from "@/components/molecules/Modal.vue"
export default {
  props: {
    conversationId: {
      type: String,
      required: true,
    },
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
        const res = await apiDeleteSubtitles(
          this.conversationId,
          this.subtitleIds,
        )
        if (res?.status === "success") {
          bus.$emit("subtitle_versions_deleted", this.subtitleIds)
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: res?.message,
            timeout: null,
            redirect: false,
          })
        }
      }
      this.$emit("on-close")
    },
  },
  components: { Modal },
}
</script>
