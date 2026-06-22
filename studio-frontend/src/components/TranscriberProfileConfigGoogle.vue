<template>
  <div class="config-google">
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

      <FormInput :field="credentialsField">
        <template #custom-input="{ id }">
          <textarea
            :id="id"
            class="credentials-textarea"
            rows="8"
            :placeholder="credentialsField.placeholder"
            :value="credentialsValue"
            @input="onCredentialsInput" />
        </template>
        <template #content-bottom-input>
          <span class="helper-text">{{
            $t(
              "backoffice.transcriber_profile_detail.google_credentials_helper",
            )
          }}</span>
          <div class="file-input-wrapper">
            <input
              ref="credentialsFile"
              type="file"
              accept=".json"
              class="file-input-hidden"
              @change="onCredentialsFileChange" />
            <Button
              variant="secondary"
              size="sm"
              icon="upload"
              :label="
                $t(
                  'backoffice.transcriber_profile_detail.google_credentials_load_file',
                )
              "
              @click="triggerCredentialsFile" />
          </div>
        </template>
      </FormInput>

      <FormInput :field="projectIdField" v-model="localConfig.projectId" />
    </section>

    <section class="model-section">
      <h4>{{ $t("backoffice.transcriber_profile_detail.model_title") }}</h4>
      <FormInput :field="modelField">
        <template #custom-input="{ id }">
          <select :id="id" v-model="localConfig.model" class="model-select">
            <option
              v-for="option in modelOptions"
              :key="option.value"
              :value="option.value">
              {{ option.label || option.value }}
            </option>
          </select>
        </template>
      </FormInput>
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
import Button from "@/components/atoms/Button.vue"
import { GOOGLE_LANGUAGES } from "@/const/googleLanguages"

const HIDDEN_CREDENTIALS = "Secret credentials are hidden"

export default {
  name: "TranscriberProfileConfigGoogle",
  components: { FormCheckbox, FormInput, LanguageEndpointEditor, Button },
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
      supportedLanguages: GOOGLE_LANGUAGES,
      modelOptions: [
        { value: "", label: "Default" },
        { value: "latest_long" },
        { value: "latest_short" },
        { value: "telephony" },
      ],
      modelField: {
        label: this.$t(
          "backoffice.transcriber_profile_detail.google_model_label",
        ),
        error: null,
      },
      credentialsField: {
        label: this.$t(
          "backoffice.transcriber_profile_detail.google_credentials_label",
        ),
        placeholder: this.$t(
          "backoffice.transcriber_profile_detail.google_credentials_placeholder",
        ),
        error: null,
      },
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
      projectIdField: {
        label: this.$t(
          "backoffice.transcriber_profile_detail.google_project_id_label",
        ),
        placeholder: this.$t(
          "backoffice.transcriber_profile_detail.google_project_id_placeholder",
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
    // Show an empty textarea when editing a profile whose credentials are
    // hidden, so the user can leave it blank to keep the stored credentials.
    credentialsValue() {
      const creds = this.localConfig.credentials
      return creds === HIDDEN_CREDENTIALS ? "" : creds || ""
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
  methods: {
    onCredentialsInput(event) {
      this.localConfig.credentials = event.target.value
    },
    triggerCredentialsFile() {
      this.$refs.credentialsFile?.click()
    },
    async onCredentialsFileChange(event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }
      try {
        const text = await file.text()
        this.localConfig.credentials = text
      } catch {
        // ignore unreadable file
      }
      // allow re-selecting the same file
      event.target.value = ""
    },
  },
}
</script>

<style scoped>
.config-google {
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
.model-section,
.languages-section {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
  margin-top: var(--small-gap);
  padding-top: var(--small-gap);
  border-top: var(--border-block);
}

/* Fill the FormInput field width like the text inputs, capped by the global
   select max-width (instead of shrinking to the selected option). */
.model-select {
  flex: 1;
}

.credentials-textarea {
  width: 100%;
  padding: var(--small-gap);
  border: var(--border-input);
  border-radius: 4px;
  font-family: var(--font-family-mono);
  font-size: var(--text-sm);
  background: var(--input-background);
  resize: vertical;
}

.credentials-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-soft);
}

.helper-text {
  color: var(--text-secondary);
  font-size: var(--text-xs);
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--small-gap);
}

.file-input-hidden {
  display: none;
}
</style>
