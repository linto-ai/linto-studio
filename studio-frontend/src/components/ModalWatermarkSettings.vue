<template>
  <ModalNew
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="applyWatermarkSettings"
    :title="$t('session.live_page.watermark_settings.title')"
    :actionBtnLabel="$t('session.live_page.watermark_settings.apply_button')"
    small>
    <div class="modal-watermark-settings">
      <FormInput
        inputFullWidth
        :field="watermarkTextField"
        v-model="watermarkTextField.value" />
      <FormInput
        inputFullWidth
        :field="watermarkFrequencyField"
        v-model="watermarkFrequencyField.value" />
      <FormInput
        inputFullWidth
        :field="watermarkDurationField"
        v-model="watermarkDurationField.value" />
    </div>
  </ModalNew>
</template>
<script>
import { bus } from "@/main.js"
import ModalNew from "./ModalNew.vue"
import EMPTY_FIELD from "@/const/emptyField"
import FormInput from "@/components/FormInput.vue"

export default {
  props: {
    watermarkFrequency: {
      type: Number,
      required: true,
    },
    watermarkDuration: {
      type: Number,
      required: true,
    },
    watermarkContent: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      watermarkTextField: {
        ...EMPTY_FIELD,
        value: this.watermarkContent,
        label: this.$t("session.live_page.watermark_settings.text"),
        type: "text",
      },
      watermarkFrequencyField: {
        ...EMPTY_FIELD,
        value: this.watermarkFrequency,
        label: this.$t("session.live_page.watermark_settings.frequency"),
        type: "number",
      },
      watermarkDurationField: {
        ...EMPTY_FIELD,
        value: this.watermarkDuration,
        label: this.$t("session.live_page.watermark_settings.duration"),
        type: "number",
      },
    }
  },
  mounted() {},
  methods: {
    applyWatermarkSettings() {
      this.$emit("on-confirm", {
        text: this.watermarkTextField.value,
        frequency: Number(this.watermarkFrequencyField.value),
        duration: Number(this.watermarkDurationField.value),
      })
    },
  },
  components: {
    ModalNew,
    FormInput,
  },
}
</script>
