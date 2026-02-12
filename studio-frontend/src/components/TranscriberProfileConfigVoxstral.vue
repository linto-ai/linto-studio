<template>
  <div class="config-voxstral">
    <FormInput :field="nameField" v-model="localConfig.name" />

    <FormInput :field="descriptionField" v-model="localConfig.description" />

    <section class="endpoint-section">
      <h4>{{ $t("backoffice.transcriber_profile_detail.voxstral_endpoint_label") }}</h4>
      <FormInput :field="endpointField" v-model="localConfig.endpoint" />
    </section>

    <section class="options-section">
      <h4>{{ $t("backoffice.transcriber_profile_detail.options_title") }}</h4>
      <FormCheckbox
        switchDisplay
        v-model="localQuickMeeting"
        :field="{
          label: $t(
            'backoffice.transcriber_profile_detail.quick_meeting_label',
          ),
          value: localQuickMeeting,
        }" />
      <FormCheckbox
        switchDisplay
        v-model="localConfig.hasDiarization"
        :field="{
          label: $t('backoffice.transcriber_profile_detail.diarization_label'),
          value: localConfig.hasDiarization,
        }" />
    </section>

    <section class="languages-section">
      <h4>{{ $t("backoffice.transcriber_profile_detail.languages_title") }}</h4>
      <LanguageEndpointEditor
        v-model="localConfig.languages"
        :languages="supportedLanguages"
        :showEndpoint="false" />
    </section>
  </div>
</template>

<script>
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import LanguageEndpointEditor from "@/components/molecules/LanguageEndpointEditor.vue"
import { VOXSTRAL_LANGUAGES } from "@/const/voxstralLanguages"

export default {
  name: "TranscriberProfileConfigVoxstral",
  components: { FormCheckbox, FormInput, LanguageEndpointEditor },
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
      supportedLanguages: VOXSTRAL_LANGUAGES,
      nameField: {
        label: this.$t("backoffice.transcriber_profile_detail.name_label"),
        placeholder: this.$t(
          "backoffice.transcriber_profile_detail.name_placeholder",
        ),
        error: null,
      },
      descriptionField: {
        label: this.$t(
          "backoffice.transcriber_profile_detail.description_label",
        ),
        placeholder: this.$t(
          "backoffice.transcriber_profile_detail.description_placeholder",
        ),
        error: null,
      },
      endpointField: {
        label: this.$t(
          "backoffice.transcriber_profile_detail.voxstral_endpoint_label",
        ),
        placeholder: this.$t(
          "backoffice.transcriber_profile_detail.voxstral_endpoint_placeholder",
        ),
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
.config-voxstral {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
}

.endpoint-section,
.options-section,
.languages-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--small-gap);
  margin-top: var(--small-gap);
  padding-top: var(--small-gap);
  border-top: var(--border-block);
}

.languages-section {
  align-items: stretch;
}
</style>
