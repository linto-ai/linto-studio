<template>
  <ModalNew
    :title="$t('conversation.subtitles.copy_label')"
    :actionBtnLabel="$t('conversation.subtitles.copy')"
    :cancelButton="false"
    @on-cancel="() => this.$emit('on-close')"
    @on-confirm="generateSubtitles"
    small>
    <form action="">
      <FormInput :field="versionName" v-model="versionName.value" />
    </form>
  </ModalNew>
</template>
<script>
import ModalNew from "./ModalNew.vue"
import FormInput from "@/components/FormInput.vue"
import { formsMixin } from "@/mixins/forms.js"
import { testName } from "../tools/fields/testName"
import { workerSendMessage } from "../tools/worker-message"
export default {
  mixins: [formsMixin],
  props: {
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
    generateSubtitles() {
      if (this.testFields()) {
        workerSendMessage("copy_subtitles", {
          subtitleId: this.subtitleId,
          data: {
            version: this.versionName.value,
          },
        })
        this.$emit("on-close")
      }
    },
  },
  components: {
    ModalNew,
    FormInput,
  },
}
</script>
