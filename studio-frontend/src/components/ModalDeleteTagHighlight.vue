<template>
  <ModalNew
    value
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="deleteTag"
    :title="$t('manage_tags.delete_tag.title', { name: tag.name })"
    :actionBtnLabel="$t('manage_tags.delete_tag.action')"
    size="sm">
    <div class="form-field flex col">
      {{ $t("app_editor_highlights_modal.delete_tag_modal.content") }}
      <!-- {{
        $t("manage_tags.delete_tag.description", {
          number: conversationNumber,
        })
      }} -->
    </div>
  </ModalNew>
</template>
<script>

import { formsMixin } from "@/mixins/forms.js"

import ModalNew from "@/components/molecules/Modal.vue"
import { workerSendMessage } from "../tools/worker-message"
export default {
  mixins: [formsMixin],
  props: {
    tag: {
      type: Object,
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    async deleteTag() {
      workerSendMessage("remove_tag_from_conversation", {
        tagId: this.tag._id,
        conversationId: this.conversationId,
      })
      this.$emit("on-confirm")
    },
  },
  components: { ModalNew },
}
</script>
