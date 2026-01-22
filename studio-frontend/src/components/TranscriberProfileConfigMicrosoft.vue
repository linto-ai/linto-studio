<template>
  <div class="config-microsoft">
    <FormInput :field="nameField" v-model="localConfig.name" />

    <FormInput :field="descriptionField" v-model="localConfig.description" />

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

    <section class="credentials-section">
      <h4>
        {{ $t("backoffice.transcriber_profile_detail.credentials_title") }}
      </h4>
      <FormInput :field="regionField" v-model="localConfig.region" />

      <FormInput :field="keyField" v-model="localConfig.key" />
    </section>

    <section class="languages-section">
      <h4>{{ $t("backoffice.transcriber_profile_detail.languages_title") }}</h4>
      <LanguageEndpointEditor
        v-model="localConfig.languages"
        :languages="supportedLanguages"
        :endpointLabel="
          $t('backoffice.transcriber_profile_detail.microsoft_endpoint_label')
        "
        :endpointPlaceholder="
          $t(
            'backoffice.transcriber_profile_detail.microsoft_endpoint_placeholder',
          )
        " />
    </section>
  </div>
</template>

<script>
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import LanguageEndpointEditor from "@/components/molecules/LanguageEndpointEditor.vue"
import { MICROSOFT_LANGUAGES } from "@/const/microsoftLanguages"

export default {
  name: "TranscriberProfileConfigMicrosoft",
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
      supportedLanguages: MICROSOFT_LANGUAGES,
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
      regionField: {
        label: this.$t("backoffice.transcriber_profile_detail.region_label"),
        placeholder: this.$t(
          "backoffice.transcriber_profile_detail.region_placeholder",
        ),
        error: null,
      },
      keyField: {
        label: this.$t("backoffice.transcriber_profile_detail.key_label"),
        placeholder: this.$t(
          "backoffice.transcriber_profile_detail.key_placeholder",
        ),
        type: "password",
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
.config-microsoft {
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

.credentials-section,
.languages-section {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
  margin-top: var(--small-gap);
  padding-top: var(--small-gap);
  border-top: var(--border-block);
}
</style>
