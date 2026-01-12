<template>
  <form @submit="createSession">
    <section>
      <div class="form-field flex col">
        <label for="type-visio-selector">
          {{ visioTypeField.label }}
        </label>
        <select v-model="visioTypeField.value" id="type-visio-selector">
          <option
            v-for="service in supportedVisioServices"
            :key="service"
            :value="service">
            {{ service }}
          </option>
        </select>
      </div>

      <FormInput
        :field="visioLinkField"
        v-model="visioLinkField.value"
        class="fullwidth"
        placeholder="Jitsi link"
        required />
    </section>

    <QuickSessionSettings
      :transcriberProfiles="transcriberProfiles"
      :transcriptionServices="transcriptionServices"
      :field="quickSessionSettingsField"
      source="visio"
      v-model="quickSessionSettingsField.value" />

    <SecurityLevelSelector v-model="securityLevel" />

    <div
      class="flex gap-small align-center conversation-create-footer"
      style="margin-top: 1rem">
      <div class="error-field flex1" v-if="formError">{{ formError }}</div>
      <div v-else class="flex1"></div>

      <Button
        type="submit"
        variant="primary"
        :loading="formState === 'sending'"
        :label="formSubmitLabel"></Button>
    </div>
  </form>
</template>
<script>
import { bus } from "@/main.js"

import EMPTY_FIELD from "@/const/emptyField.js"
import { testVisioUrl } from "@/tools/fields/testVisioUrl"
import { formsMixin } from "@/mixins/forms.js"
import generateServiceConfig from "@/tools/generateServiceConfig"
import {
  apiCreateQuickSession,
  apiStartBot,
  apiDeleteQuickSession,
} from "@/api/session.js"
import { testQuickSessionSettings } from "@/tools/fields/testQuickSessionSettings"

import FormInput from "@/components/molecules/FormInput.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import TranscriberProfileSelector from "@/components/TranscriberProfileSelector.vue"
import QuickSessionSettings from "@/components/QuickSessionSettings.vue"
import SecurityLevelSelector from "@/components/SecurityLevelSelector.vue"

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
    transcriptionServices: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fields: ["visioLinkField", "quickSessionSettingsField"],
      visioTypeField: {
        ...EMPTY_FIELD,
        value: "jitsi",
        label: this.$i18n.t("quick_session.setup_visio.type_label"),
      },
      visioLinkField: {
        ...EMPTY_FIELD,
        value: "",
        customParams: { placeholder: "https://meet.jit.si/..." },
        label: this.$i18n.t("quick_session.setup_visio.link_label"),
        testField: testVisioUrl,
      },
      quickSessionSettingsField: {
        ...EMPTY_FIELD,
        value: {
          keepAudio: true,
          diarization: false,
          subInStudio: false,
          subInVisio: false,
          offlineTranscription: true,
          selectedProfile: this.transcriberProfiles?.[0] ?? null,
          transcriptionService:
            this.transcriptionServices.length > 0
              ? generateServiceConfig(this.transcriptionServices[0])
              : null,
          subSource: "original",
        },
        testField: testQuickSessionSettings,
      },
      supportedVisioServices: ["jitsi", "bigbluebutton"],
      securityLevel: "unsecured",
      formSubmitLabel: this.$t("quick_session.setup_visio.join_meeting"),
      formError: null,
      formState: "idle",
    }
  },
  mounted() {},
  methods: {
    async createSession(event) {
      event?.preventDefault()
      if (this.testFields()) {
        const settings = this.quickSessionSettingsField.value
        const channels = [
          {
            name: "Main",
            transcriberProfileId: settings.selectedProfile.id,
            translations: settings.selectedProfile.translations ?? [],
            diarization: settings.diarization ?? false,
            keepAudio: settings.keepAudio,
            compressAudio: !settings.offlineTranscription,
            enableLiveTranscripts: settings.subInStudio,
            //async: settings.offlineTranscription,
            meta: {
              transcriptionService: settings.transcriptionService,
            },
          },
        ]
        const requestSession = await apiCreateQuickSession(
          this.currentOrganizationScope,
          {
            channels: channels,
            meta: {
              securityLevel: this.securityLevel,
            },
          },
        )

        if (requestSession.status == "success") {
          const session = requestSession.data

          const requestBot = await apiStartBot(this.currentOrganizationScope, {
            url: this.visioLinkField.value,
            channelId: session.channels[0].id,
            enableDisplaySub: settings.subInVisio,
            subSource:
              settings.subSource === "original" ? null : settings.subSource,
            provider: this.visioTypeField.value,
          })
          if (requestBot.status == "success") {
            this.$router.push({
              name: "quick session",
              query: {},
              params: {
                organizationId: this.currentOrganizationScope,
              },
            })
          } else {
            await apiDeleteQuickSession(
              this.currentOrganizationScope,
              requestSession.data.id,
              { trash: true, force: true },
            )
            this.formState = "error"
          }
        } else {
          this.formState = "error"
        }
      }
    },
  },
  trashSession() {
    return
  },
  components: {
    FormInput,
    FormCheckbox,
    TranscriberProfileSelector,
    QuickSessionSettings,
    SecurityLevelSelector,
  },
}
</script>
