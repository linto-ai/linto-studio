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
        :field="watermarkContentField"
        v-model="watermarkContentField.value" />
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
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  props: {
    field: {
      type: Object,
    },
  },
  data() {
    return {
      watermarkContentField: {
        ...EMPTY_FIELD,
        value: this.field.value.content,
        label: this.$t("session.live_page.watermark_settings.text"),
        type: "text",
      },
      watermarkFrequencyField: {
        ...EMPTY_FIELD,
        value: this.field.value.frequency,
        label: this.$t("session.live_page.watermark_settings.frequency"),
        type: "number",
      },
      watermarkDurationField: {
        ...EMPTY_FIELD,
        value: this.field.value.duration,
        label: this.$t("session.live_page.watermark_settings.duration"),
        type: "number",
      },
    }
  },
  mounted() {},
  methods: {
    applyWatermarkSettings() {
      this.$emit("input", {
        content: this.watermarkContentField.value,
        frequency: Number(this.watermarkFrequencyField.value),
        duration: Number(this.watermarkDurationField.value),
      })
      this.$emit("on-confirm")
    },
  },
  components: {
    ModalNew,
    FormInput,
  },
}
</script>
