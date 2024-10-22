<template>
  <div>
    <section class="flex col gap-small">
      <h2>{{ $t("quick_session.creation.source_title") }}</h2>
      <FormRadio :field="fieldSource" v-model="fieldSource.value" />
    </section>
    <section class="flex col gap-small">
      <h2>{{ $t("quick_session.creation.profile_selector_title") }}</h2>
      <TranscriberProfileSelector
        :multiple="false"
        v-model="selectedProfile"
        :profilesList="transcriberProfiles" />
    </section>

    <div
      class="flex gap-small align-center conversation-create-footer"
      style="margin-top: 1rem">
      <div class="error-field flex1" v-if="formError">{{ formError }}</div>
      <div v-else class="flex1"></div>
      <button
        type="submit"
        class="btn green upload-media-button"
        id="upload-media-button"
        :disabled="formState === 'sending'">
        <span class="icon apply"></span>
        <span class="label">{{ formSubmitLabel }}</span>
      </button>
    </div>
  </div>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField"
import FormRadio from "@/components/FormRadio.vue"
import TranscriberProfileSelector from "@/components/TranscriberProfileSelector.vue"

export default {
  props: {
    transcriberProfiles: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fieldSource: {
        value: null,
        error: null,
        valid: false,
        options: [
          {
            name: "microphone",
            label: this.$i18n.t(
              "quick_session.creation.microphone_source_label",
            ),
          },
          {
            name: "visio",
            label: this.$i18n.t("quick_session.creation.visio_source_label"),
          },
        ],
      },
      selectedProfile: null,
      formSubmitLabel: "Start",
    }
  },
  mounted() {},
  methods: {},
  components: { FormRadio, TranscriberProfileSelector },
}
</script>
