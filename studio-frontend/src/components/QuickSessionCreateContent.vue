<template>
  <form @submit="createQuickSession" v-if="currentQuickSession === null">
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
  <div v-else class="flex1 flex col align-center justify-center gap-small">
    <h3 class="center-text">
      {{ $t("quick_session.creation.quick_meeting_already_start_title") }}
    </h3>
    <button @click="goToQuickSession">
      {{ $t("quick_session.creation.quick_meeting_already_start_button") }}
    </button>
  </div>
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
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    currentQuickSession: {
      type: Object,
      default: null,
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
    goToQuickSession() {
      this.$router.push({
        name: "quick session setup",
        query: {},
        params: {
          organizationId: this.currentOrganizationScope,
        },
      })
    },
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
        this.$router.push({
          name: "quick session setup",
          query: {
            source: this.fieldSource.value,
            transcriberProfileId: this.selectedProfile.id,
          },
          params: {
            organizationId: this.currentOrganizationScope,
          },
        })
      } else {
        this.formState = "error"
      }
      return false
    },
  },
  components: { FormRadio, TranscriberProfileSelector },
}
</script>
