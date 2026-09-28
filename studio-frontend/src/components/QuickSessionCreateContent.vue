<template>
  <form @submit="createQuickSession">
    <!-- <section class="flex col gap-small">
      <h2>{{ $t("quick_session.creation.source_title") }}</h2>
      <FormRadio :field="fieldSource" v-model="fieldSource.value" />
    </section> -->
    <!-- <section class="flex col gap-small">
      <h2>{{ $t("quick_session.creation.profile_selector_title") }}</h2>
      <FormCheckbox
        class=""
        :field="fieldDiarizationEnabled"
        v-model="fieldDiarizationEnabled.value"></FormCheckbox>
      <FormCheckbox
        :field="fieldKeepAudio"
        v-model="fieldKeepAudio.value"></FormCheckbox>
      <TranscriberProfileSelector
        :multiple="false"
        v-model="selectedProfile"
        :profilesList="transcriberProfiles" />
    </section> -->

    <section v-if="enableSecurityLevel">
      <h2>{{ $t("conversation.conversation_creation_security_title") }}</h2>
      <SecurityLevelSelector
        v-model="securityLevel"
        :minLevel="organizationSecurityLevel" />
    </section>

    <QuickSessionSettings
      :transcriberProfiles="transcriberProfiles"
      :transcriptionServices="transcriptionServices"
      :securityLevel="effectiveSecurityLevel"
      :field="quickSessionSettingsField"
      source="micro"
      v-model="quickSessionSettingsField.value" />

    <!-- Submit bar: a SaaS refusal explained on its own line, its purchase
         beside the submit button -->
    <div
      class="flex col gap-small conversation-create-footer"
      style="margin-top: 1rem">
      <SaasRefusalMessage v-if="saasRefusalView" :refusal="saasRefusalView" />
      <div class="flex gap-small align-center">
        <div class="error-field flex1" v-if="formError">{{ formError }}</div>
        <div v-else class="flex1"></div>
        <Button
          type="submit"
          :variant="hasSaasRefusalPurchase ? 'secondary' : 'primary'"
          :loading="formState === 'sending'"
          :disabled="formState === 'sending'"
          :label="formSubmitLabel"></Button>
        <SaasRefusalAction
          v-if="saasRefusalView"
          :refusal="saasRefusalView"
          :error-data="saasRefusal" />
      </div>
    </div>
  </form>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField"
import { testFieldEmpty } from "@/tools/fields/testEmpty"
import { testQuickSessionSettings } from "@/tools/fields/testQuickSessionSettings"
import generateServiceConfig from "@/tools/generateServiceConfig"

import { formsMixin } from "@/mixins/forms.js"
import { organizationSecurityLevelMixin } from "@/mixins/organizationSecurityLevel.js"

import QuickSessionSettings from "@/components/QuickSessionSettings.vue"
import SecurityLevelSelector from "@/components/SecurityLevelSelector.vue"
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import { getEnv } from "@/tools/getEnv"

import { apiCreateQuickSession } from "@/api/session.js"
import { isSaasRefusal } from "@/tools/isSaasRefusal"
import SaasRefusalMessage from "@/components-cloud/SaasRefusalMessage.vue"
import SaasRefusalAction from "@/components-cloud/SaasRefusalAction.vue"
import { saasRefusalFormMixin } from "@/mixins/saasRefusalForm.js"

export default {
  mixins: [formsMixin, organizationSecurityLevelMixin, saasRefusalFormMixin],
  props: {
    transcriberProfiles: {
      type: Array,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    transcriptionServices: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fields: ["fieldSource", "quickSessionSettingsField"],
      fieldSource: {
        value: "microphone",
        error: null,
        valid: false,
        options: [
          {
            name: "microphone",
            label: this.$i18n.t(
              "quick_session.creation.microphone_source_label",
            ),
          },
        ],
        testField: testFieldEmpty,
      },
      fieldDiarizationEnabled: {
        ...EMPTY_FIELD,
        value: false,
        label: this.$t("session.create_page.diarization_label"),
      },
      fieldKeepAudio: {
        ...EMPTY_FIELD,
        value: true,
        label: this.$t("session.create_page.keep_audio_label"),
      },
      quickSessionSettingsField: {
        ...EMPTY_FIELD,
        value: {
          keepAudio: true,
          diarization: false,
          subInStudio: false,
          offlineTranscription: false,
          selectedProfile: this.transcriberProfiles?.[0] ?? null,
          transcriptionService:
            this.transcriptionServices.length > 0
              ? generateServiceConfig(this.transcriptionServices[0])
              : null,
        },
        testField: testQuickSessionSettings,
      },
      selectedProfile: this.transcriberProfiles[0],
      securityLevel: DEFAULT_SECURITY_LEVEL,
      formSubmitLabel: this.$i18n.t("quick_session.creation.submit_button"),

      formError: null,
      formState: "idle",
    }
  },
  mounted() {},
  computed: {
    enableSecurityLevel() {
      return getEnv("VUE_APP_ENABLE_SECURITY_LEVEL") === "true"
    },
  },
  methods: {
    // A SaaS refusal gets its own message and action; anything else a
    // generic error, so a failed start is never silent.
    showCreationError(res) {
      this.formState = "error"
      const errorData = res.error?.response?.data
      if (isSaasRefusal(errorData)) {
        this.saasRefusal = errorData
        return
      }
      this.formError = this.$t("quick_session.creation.start_error")
    },
    async goToQuickSession() {
      this.$router.push({
        name: "quick session",
        query: {},
        params: {
          organizationId: this.currentOrganizationScope,
        },
      })
    },
    async createQuickSession(event) {
      event?.preventDefault()
      if (this.formState === "sending") return false
      this.formError = null
      this.saasRefusal = null

      if (this.testFields()) {
        this.formState = "sending"
        const settings = this.quickSessionSettingsField.value
        const channels = [
          {
            name: "Main",
            diarization: settings.diarization ?? false,
            keepAudio: settings.keepAudio,
            compressAudio: !settings.offlineTranscription,
            // async: settings.offlineTranscription,
            enableLiveTranscripts: settings.subInStudio,
            meta: {
              transcriptionService: settings.transcriptionService,
            },
          },
        ]

        if (settings.selectedProfile) {
          channels[0].transcriberProfileId = settings.selectedProfile?.id
          channels[0].translations = settings.selectedProfile?.translations
        }
        const res = await apiCreateQuickSession(this.currentOrganizationScope, {
          channels: channels,
          meta: {
            securityLevel: this.securityLevel,
          },
        })

        if (res.status == "success") {
          sessionStorage.setItem("startQuickSession", true)
          this.$router.push({
            name: "quick session",
            query: {},
            params: {
              organizationId: this.currentOrganizationScope,
            },
          })
        } else {
          this.showCreationError(res)
        }
      } else {
        this.formState = "error"
      }
      return false
    },
  },
  components: {
    QuickSessionSettings,
    SecurityLevelSelector,
    SaasRefusalMessage,
    SaasRefusalAction,
  },
}
</script>
