<template>
  <form @submit="createQuickSession">
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
  </form>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField"
import FormRadio from "@/components/FormRadio.vue"
import TranscriberProfileSelector from "@/components/TranscriberProfileSelector.vue"
import { testFieldEmpty } from "@/tools/fields/testEmpty"
import { formsMixin } from "@/mixins/forms.js"

export default {
  mixins: [formsMixin],
  props: {
    transcriberProfiles: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fields: ["fieldSource"],
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
        testField: testFieldEmpty,
      },
      selectedProfile: null,
      formSubmitLabel: "Start",

      formError: null,
      formState: "idle",
    }
  },
  mounted() {},
  methods: {
    createQuickSession(event) {
      event?.preventDefault()

      if (!this.selectedProfile) {
        this.formError = this.$i18n.t(
          "quick_session.creation.no_profile_selected_error",
        )
        this.formState = "error"
        return false
      }

      if (this.testFields()) {
        console.log("ouiiii")
      } else {
        this.formState = "error"
      }
      return false
    },
  },
  components: { FormRadio, TranscriberProfileSelector },
}
</script>
