<template>
  <Modal
    value
    :title="$t('conversation.subtitles.copy_label')"
    :actionBtnLabel="$t('conversation.subtitles.copy')"
    :cancelButton="false"
    @on-cancel="() => this.$emit('on-close')"
    @on-confirm="generateSubtitles"
    size="sm">
    <form action="">
      <FormInput :field="versionName" v-model="versionName.value" />
    </form>
  </Modal>
</template>
<script>
import Modal from "@/components/molecules/Modal.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import { formsMixin } from "@/mixins/forms.js"
import { testName } from "../tools/fields/testName"
import { apiCopySubtitle } from "../api/subtitle.js"
import { bus } from "@/main.js"
export default {
  mixins: [formsMixin],
  props: {
    conversationId: {
      type: String,
      required: true,
    },
    subtitleId: {
      type: String,
      required: true,
    },
    defaultName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      versionName: {
        value: this.defaultName,
        error: null,
        valid: false,
        label: this.$t("conversation.subtitles.version_name"),
        testField: testName,
      },
      fields: ["versionName"],
    }
  },
  methods: {
    selectionChange(value) {
      this.selectedOptionValue = value
    },
    async generateSubtitles() {
      if (this.testFields()) {
        const res = await apiCopySubtitle(
          this.conversationId,
          this.subtitleId,
          this.versionName.value,
        )
        if (res?.status === "success") {
          bus.$emit("subtitle_versions_refresh")
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: res?.message,
            timeout: null,
            redirect: false,
          })
        }
        this.$emit("on-close")
      }
    },
  },
  components: {
    Modal,
    FormInput,
  },
}
</script>
