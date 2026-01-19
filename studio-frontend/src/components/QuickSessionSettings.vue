<template>
  <div>
    <h2>{{ $t("quick_session.creation.transcription_settings_title") }}</h2>
    <!-- -- -- -- -- OFFLINE Transcription -- -- -- -- -- -->

    <section>
      <FormCheckbox
        :field="fieldOfflineTranscription"
        v-model="fieldOfflineTranscription.value"
        switchDisplay />
      <div v-if="fieldOfflineTranscription.value" class="subSection">
        <h3>{{ $t("conversation.conversation_creation_right_title") }}</h3>
        <div class="form-field flex col">
          <label class="form-label">
            {{ $t("conversation.conversation_creation_right_label") }}
          </label>
          <select v-model="membersRight.value">
            <option
              v-for="uright in membersRight.list"
              :key="uright.value"
              :value="uright.value">
              {{ uright.txt }}
            </option>
          </select>
        </div>
        <div class="medium-margin-top flex col gap-small">
          <h3>{{ $t("conversation.transcription_service_title") }}</h3>
          <div class="error-field" v-if="fieldTranscriptionService.error">
            {{ fieldTranscriptionService.error }}
          </div>
          <ConversationCreateServices
            :serviceList="fieldTranscriptionService.list"
            :securityLevel="securityLevel"
            v-model="fieldTranscriptionService.value" />
        </div>
      </div>
    </section>

    <!-- -- -- -- -- LIVE transcription -- -- -- -- -->

    <section>
      <FormCheckbox
        :field="fieldSubInStudio"
        v-model="fieldSubInStudio.value"
        switchDisplay>
        <template v-slot:content-after-label>
          <Chip
            value="beta"
            red
            class="small-margin-left"
            v-if="showBetaLiveTranscription">
            Beta
          </Chip>
        </template>
      </FormCheckbox>
      <div v-if="fieldSubInStudio.value" class="subSection flex col gap-small">
        <!-- -- -- -- -- Profile selector -- -- -- -- -->
        <div>
          <h3>{{ $t("quick_session.creation.profile_selector_title") }}</h3>

          <TranscriberProfileSelector
            :multiple="false"
            v-model="selectedProfile"
            :profilesList="transcriberProfiles"
            :securityLevel="securityLevel" />
        </div>

        <!-- Options for live transcription -->
        <div>
          <h3>
            {{ $t("quick_session.creation.live_options_title") }}
          </h3>
          <FormCheckbox
            v-if="source === 'visio'"
            :field="fieldSubInVisio"
            v-model="fieldSubInVisio.value">
          </FormCheckbox>
          <div class="form-field">
            <SessionTranslationSelection
              v-if="
                source === 'visio' && field.value.selectedProfile.translations
              "
              :selectedChannel="field.value.selectedProfile"
              :customLabel="$t('quick_session.setup_visio.bot_lang_label')"
              v-model="selectedTranslation">
            </SessionTranslationSelection>
          </div>

          <FormCheckbox
            v-if="isCompatibleWithDiarization"
            class=""
            :field="fieldDiarizationEnabled"
            v-model="fieldDiarizationEnabled.value"></FormCheckbox>
          <FormCheckbox
            :field="fieldKeepAudio"
            v-model="fieldKeepAudio.value"></FormCheckbox>
        </div>
      </div>
    </section>

    <span class="error-field" v-if="field.error !== null">{{
      field.error
    }}</span>
  </div>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField.js"
import { testService } from "@/tools/fields/testService.js"
import RIGHTS_LIST from "@/const/rigthsList"
import { getEnv } from "@/tools/getEnv"
import generateServiceConfig from "@/tools/generateServiceConfig"
import {
  filterBySecurityLevel,
  filterByMetaSecurityLevel,
  meetsSecurityLevel,
  meetsMetaSecurityLevel,
} from "@/tools/filterBySecurityLevel"

import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import TranscriberProfileSelector from "@/components/TranscriberProfileSelector.vue"
import ConversationCreateServices from "@/components/ConversationCreateServices.vue"
import Badge from "@/components/atoms/Badge.vue"
import Chip from "@/components/atoms/Chip.vue"

export default {
  props: {
    transcriberProfiles: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
    transcriptionServices: {
      type: Array,
      required: true,
    },
    field: {
      type: Object,
      required: true,
    },
    source: {
      type: String, // "micro" | "visio"
      required: true,
    },
    securityLevel: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      fieldSubInVisio: {
        ...EMPTY_FIELD,
        value: this.value.subInVisio ?? false,
        label: this.$i18n.t(
          "quick_session.setup_visio.display_transcription_in_visio_label",
        ),
      },
      fieldSubInStudio: {
        ...EMPTY_FIELD,
        value: this.value.subInStudio ?? false,
        label: this.$i18n.t("quick_session.creation.live_transcription_label"),
      },
      fieldDiarizationEnabled: {
        ...EMPTY_FIELD,
        value: this.value.diarization ?? true,
        label: this.$t("session.create_page.diarization_label"),
      },
      fieldKeepAudio: {
        ...EMPTY_FIELD,
        value: this.value.keepAudio ?? true,
        disabled: true,
        disabledReason: this.$t(
          "quick_session.creation.keep_audio_disabled_because_offline",
        ),
        label: this.$t("session.create_page.keep_audio_label"),
      },
      fieldOfflineTranscription: {
        ...EMPTY_FIELD,
        value: this.value.offlineTranscription ?? true,
        label: this.$t("quick_session.creation.offline_transcription_label"),
      },
      selectedProfile: this.value.selectedProfile,
      fieldTranscriptionService: {
        ...EMPTY_FIELD,
        loading: false,
        list: this.transcriptionServices,
        testField: testService,
        value: this.value.transcriptionService,
      },
      membersRight: {
        ...EMPTY_FIELD,
        value: 1,
        list: RIGHTS_LIST((key) => this.$i18n.t(key)),
      },
      selectedTranslation: this.value.subSource || "original",
    }
  },

  mounted() {},
  watch: {
    selectedTranslation: {
      handler() {
        this.sendUpdate()
      },
    },
    "fieldSubInVisio.value": {
      handler() {
        this.sendUpdate()
      },
    },
    "fieldSubInStudio.value": {
      handler(value) {
        if (value) {
          this.fieldSubInVisio.value = true
        }
        this.sendUpdate()
      },
    },
    "fieldDiarizationEnabled.value": {
      handler() {
        this.sendUpdate()
      },
    },
    "fieldKeepAudio.value": {
      handler() {
        this.sendUpdate()
      },
    },
    "fieldOfflineTranscription.value": {
      handler(value) {
        if (value) {
          this.fieldKeepAudio.value = true
          this.fieldKeepAudio.disabled = true
          this.fieldKeepAudio.disabledReason = this.$t(
            "quick_session.creation.keep_audio_disabled_because_offline",
          )
        } else {
          this.fieldKeepAudio.disabled = false
          this.fieldKeepAudio.disabledReason = ""
        }

        this.sendUpdate()
      },
    },
    selectedProfile: {
      handler() {
        this.sendUpdate()
      },
      deep: true,
    },
    fieldTranscriptionService: {
      handler(value) {
        this.sendUpdate()
      },
      deep: true,
    },
    "membersRight.value": {
      handler() {
        this.sendUpdate()
      },
    },
    transcriptionServices: {
      handler(newServices) {
        this.fieldTranscriptionService.list = newServices
        if (
          newServices.length > 0 &&
          !newServices.find(
            (s) =>
              s.serviceName ===
              this.fieldTranscriptionService.value?.serviceName,
          )
        ) {
          this.fieldTranscriptionService.value = generateServiceConfig(
            newServices[0],
          )
        }
      },
      deep: true,
    },
    transcriberProfiles: {
      handler(newProfiles) {
        if (
          newProfiles.length > 0 &&
          !newProfiles.find((p) => p.id === this.selectedProfile?.id)
        ) {
          this.selectedProfile = newProfiles[0]
        }
      },
      deep: true,
    },
    securityLevel: {
      handler(newLevel) {
        // Reset profile selection if current doesn't meet new security level
        if (
          this.selectedProfile &&
          !meetsMetaSecurityLevel(this.selectedProfile, newLevel)
        ) {
          const validProfiles = filterByMetaSecurityLevel(
            this.transcriberProfiles,
            newLevel,
          )
          this.selectedProfile = validProfiles.length > 0 ? validProfiles[0] : null
        }

        // Reset transcription service if current doesn't meet new security level
        const currentService = this.fieldTranscriptionService.value
        if (currentService) {
          const serviceObj = this.transcriptionServices.find(
            (s) => s.serviceName === currentService.serviceName,
          )
          if (serviceObj && !meetsSecurityLevel(serviceObj, newLevel)) {
            const validServices = filterBySecurityLevel(
              this.transcriptionServices,
              newLevel,
            )
            this.fieldTranscriptionService.value =
              validServices.length > 0
                ? generateServiceConfig(validServices[0])
                : null
          }
        }
      },
    },
  },
  methods: {
    sendUpdate() {
      this.$emit("input", {
        subInVisio: this.fieldSubInVisio.value,
        subInStudio: this.fieldSubInStudio.value,
        diarization: this.fieldDiarizationEnabled.value,
        keepAudio: this.fieldKeepAudio.value,
        selectedProfile: this.selectedProfile,
        offlineTranscription: this.fieldOfflineTranscription.value,
        transcriptionService: structuredClone(
          this.fieldTranscriptionService.value,
        ),
        membersRight: this.membersRight.value,
        subSource: this.selectedTranslation,
      })
    },
  },
  computed: {
    isCompatibleWithDiarization() {
      return this.selectedProfile?.config?.hasDiarization
    },
    showBetaLiveTranscription() {
      return getEnv("VUE_APP_SHOW_BETA_LIVE_TRANSCRIPTION") === "true"
    },
  },
  components: {
    FormInput,
    FormCheckbox,
    TranscriberProfileSelector,
    ConversationCreateServices,
    SessionTranslationSelection,
    Badge,
    Chip,
  },
}
</script>
