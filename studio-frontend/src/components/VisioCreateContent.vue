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
            :disabled="!isLinkFilled"
            v-model="visioTypeField.value" />
        </div>
      </div>

      <NotificationBanner
        variant="warning"
        icon="info"
        align="start"
        v-if="visioTypeField.value">
        <span>
          <strong>{{ visioHelper.title }}</strong>
          <br />
          {{ visioHelper.description }}
        </span>
      </NotificationBanner>
    </section>

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
        :label="formSubmitLabel"></Button>
    </div>
  </form>
</template>
<script>
import { bus } from "@/main.js"

import EMPTY_FIELD from "@/const/emptyField.js"
import { testVisioUrl } from "@/tools/fields/testVisioUrl"
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
        { value: "jitsi", label: "Jitsi", icon: "video-camera", image: "" },
        {
          value: "bigbluebutton",
          label: "BigBlueButton",
          icon: "presentation",
          image: "",
        },
        {
          value: "msteams",
          label: "Microsoft Teams",
          icon: "users-three",
          image: "",
        },
        { value: "autre", label: "Autre", icon: "globe", image: "" },
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
    isLinkFilled() {
      return (this.visioLinkField.value ?? "").trim().length > 0
    },
    // Placeholder helper, copy to be defined (possibly per provider).
    visioHelper() {
      return {
        title: "Autorisez l'accès invité",
        description:
          "Vérifiez que les invités peuvent rejoindre sans approbation manuelle. Le bot se connecte comme un participant standard.",
      }
    },
  },
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
    QuickSessionSettings,
    SecurityLevelSelector,
    NotificationBanner,
  },
}
</script>

<style lang="scss" scoped>
.visio-setup {
  max-width: 550px;
}
</style>
