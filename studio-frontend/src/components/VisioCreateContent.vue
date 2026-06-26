<template>
  <form @submit="createSession">
    <section class="flex col gap-small visio-setup">
      <FormInput
        :field="visioLinkField"
        v-model="visioLinkField.value"
        :inputFullWidth="true" />

      <div class="form-field flex col gap-small">
        <label>{{ visioTypeField.label }}</label>
        <div class="flex gap-small wrap">
          <FilterChip
            v-for="provider in visioProviders"
            :key="provider.value"
            :label="provider.label"
            :icon="provider.icon"
            :image="provider.image"
            :chipValue="provider.value"
            :disabled="!isUrlValid"
            v-model="visioTypeField.value" />
        </div>
      </div>

      <NotificationBanner
        variant="warning"
        icon="info"
        align="start"
        v-if="visioTypeField.value">
        <span>{{ visioHelper }}</span>
      </NotificationBanner>
    </section>

    <div class="visio-divider"></div>
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
      source="visio"
      v-model="quickSessionSettingsField.value" />

    <div
      class="flex gap-small align-center conversation-create-footer"
      style="margin-top: 1rem">
      <div class="error-field flex1" v-if="formError">{{ formError }}</div>
      <div v-else class="flex1"></div>

      <Button
        type="submit"
        variant="primary"
        :loading="formState === 'sending'"
        :disabled="!canSubmit"
        :label="formSubmitLabel"></Button>
    </div>
  </form>
</template>
<script>
import { bus } from "@/main.js"

import EMPTY_FIELD from "@/const/emptyField.js"
import { testVisioUrl } from "@/tools/fields/testVisioUrl"
import { isValidUrl } from "@/tools/isValidUrl"
import { inferVisioProvider } from "@/tools/inferVisioProvider"
import { formsMixin } from "@/mixins/forms.js"
import { organizationSecurityLevelMixin } from "@/mixins/organizationSecurityLevel.js"
import generateServiceConfig from "@/tools/generateServiceConfig"
import {
  apiCreateQuickSession,
  apiStartBot,
  apiDeleteQuickSession,
} from "@/api/session.js"
import { testQuickSessionSettings } from "@/tools/fields/testQuickSessionSettings"

import FormInput from "@/components/molecules/FormInput.vue"
import QuickSessionSettings from "@/components/QuickSessionSettings.vue"
import SecurityLevelSelector from "@/components/SecurityLevelSelector.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import { getEnv } from "@/tools/getEnv"

export default {
  mixins: [formsMixin, organizationSecurityLevelMixin],
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
        value: null,
        label: this.$i18n.t("quick_session.setup_visio.type_label"),
      },
      visioLinkField: {
        ...EMPTY_FIELD,
        value: "",
        placeholder: "https://meet.jit.si/...",
        label: this.$i18n.t("quick_session.setup_visio.link_label"),
        testField: testVisioUrl,
        leadingIcon: "link",
      },
      quickSessionSettingsField: {
        ...EMPTY_FIELD,
        value: {
          keepAudio: true,
          diarization: false,
          subInStudio: false,
          subInVisio: false,
          offlineTranscription: false,
          selectedProfile: this.transcriberProfiles?.[0] ?? null,
          transcriptionService:
            this.transcriptionServices.length > 0
              ? generateServiceConfig(this.transcriptionServices[0])
              : null,
          subSource: "original",
        },
        testField: testQuickSessionSettings,
      },
      // `image` is left empty for now: custom logos will be added later and
      // take precedence over the placeholder phosphor `icon`.
      visioProviders: [
        {
          value: "jitsi",
          label: "Jitsi",
          //icon: "video-camera",
          image: "/img/logo-visio/jitsi.png",
        },
        {
          value: "bigbluebutton",
          label: "BigBlueButton",
          //icon: "presentation",
          image: "/img/logo-visio/BigBlueButton.png",
        },
        {
          value: "teams",
          label: "Microsoft Teams",
          icon: "users-three",
          image: "/img/logo-visio/teams.png",
        },
        {
          value: "visio",
          label: "Visio",
          icon: "globe",
          image: "/img/logo-visio/visio.png",
        },
      ],
      securityLevel: DEFAULT_SECURITY_LEVEL,
      formSubmitLabel: this.$t("quick_session.setup_visio.join_meeting"),
      formError: null,
      formState: "idle",
    }
  },
  mounted() {},
  computed: {
    enableSecurityLevel() {
      return getEnv("VUE_APP_ENABLE_SECURITY_LEVEL") === "true"
    },
    isUrlValid() {
      return isValidUrl(this.visioLinkField.value)
    },
    canSubmit() {
      return this.isUrlValid && !!this.visioTypeField.value
    },
    // Localized per-provider guidance shown once a provider is selected.
    visioHelper() {
      const provider = this.visioTypeField.value
      return provider
        ? this.$t(`quick_session.setup_visio.helper.${provider}`)
        : ""
    },
  },
  watch: {
    // Re-infer the provider only when the URL changes, so a manual chip
    // selection sticks for a given URL. Inference never clobbers a manual
    // choice: it only applies when it confidently matches a provider.
    "visioLinkField.value"() {
      this.inferProvider()
    },
  },
  methods: {
    async inferProvider() {
      if (!this.isUrlValid) return
      const provider = await inferVisioProvider(this.visioLinkField.value)
      if (provider) {
        this.visioTypeField.value = provider
      }
    },
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
              speakerIdentificationCollections:
                settings.transcriptionService
                  ?.speakerIdentificationCollections ?? [],
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
    QuickSessionSettings,
    SecurityLevelSelector,
    NotificationBanner,
  },
}
</script>

<style lang="scss" scoped>
.visio-setup {
  max-width: 550px;
  margin: auto;
}

.visio-divider {
  border-bottom: 1px solid var(--neutral-30);
  margin-top: 1rem;
}
</style>
