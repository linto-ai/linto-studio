<template>
  <div class="config-linto">
    <FormInput
      :field="nameField"
      v-model="localConfig.name" />

    <FormInput
      :field="descriptionField"
      v-model="localConfig.description" />

    <section class="options-section">
      <h4>{{ $t("backoffice.transcriber_profile_detail.options_title") }}</h4>
      <FormCheckbox
        switchDisplay
        labelRight
        v-model="localQuickMeeting"
        :field="{ label: $t('backoffice.transcriber_profile_detail.quick_meeting_label'), value: localQuickMeeting }" />
      <FormCheckbox
        switchDisplay
        labelRight
        v-model="localConfig.hasDiarization"
        :field="{ label: $t('backoffice.transcriber_profile_detail.diarization_label'), value: localConfig.hasDiarization }" />
    </section>
  </div>
</template>

<script>
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  name: "TranscriberProfileConfigLinto",
  components: { FormCheckbox, FormInput },
  props: {
    value: {
      type: Object,
      required: true,
    },
    quickMeeting: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      nameField: {
        label: this.$t("backoffice.transcriber_profile_detail.name_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.name_placeholder"),
        error: null,
      },
      descriptionField: {
        label: this.$t("backoffice.transcriber_profile_detail.description_label"),
        placeholder: this.$t("backoffice.transcriber_profile_detail.description_placeholder"),
        error: null,
      },
    }
  },
  computed: {
    localConfig: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      },
    },
    localQuickMeeting: {
      get() {
        return this.quickMeeting
      },
      set(val) {
        this.$emit("update:quickMeeting", val)
      },
    },
  },
  watch: {
    localConfig: {
      handler(val) {
        this.$emit("input", val)
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.config-linto {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
}

.options-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--small-gap);
  margin-top: var(--small-gap);
  padding-top: var(--small-gap);
  border-top: var(--border-block);
}
</style>
