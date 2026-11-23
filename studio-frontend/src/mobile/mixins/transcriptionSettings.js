import { loadTranscriptionServices } from "@/mobile/services/transcription/loadTranscriptionServices.js"
import {
  readTranscriptionPreferences,
  saveTranscriptionPreferences,
} from "@/mobile/services/transcription/transcriptionPreferences.js"
import { computeTranscriptionChoices } from "@/mobile/tools/computeTranscriptionChoices.js"
import { buildTranscriptionSettings } from "@/mobile/tools/buildTranscriptionSettings.js"
import { isSpeakerIdentificationCapable } from "@/mobile/tools/isSpeakerIdentificationCapable.js"
import { computeHotwordsAvailable } from "@/tools/transcriptionCreate/computeHotwordsAvailable.js"
import { computeLanguageCode } from "@/tools/computeLanguageCode.js"
import { getEnv } from "@/tools/getEnv"
import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import RIGHTS_LIST from "@/const/rigthsList.js"
import { DEFAULT_MEMBERS_RIGHT } from "@/mobile/const/defaultMembersRight.js"

// Transcription and sharing choices of the Record page: the services list,
// the current choices (remembered per organization) and what to send with
// a recording.
export const transcriptionSettingsMixin = {
  data() {
    return {
      services: [],
      servicesLoaded: false,
      choices: {
        language: null,
        diarization: true,
        voiceCollections: [],
        hotwordDictionaries: [],
        membersRight: DEFAULT_MEMBERS_RIGHT,
        folderId: null,
      },
    }
  },
  computed: {
    organizationScope() {
      return this.$store.getters["organizations/getCurrentOrganizationScope"]
    },
    // The service the choices are offered for: the API picks the one used.
    currentService() {
      return this.services[0] ?? null
    },
    speakerIdentificationCapable() {
      return isSpeakerIdentificationCapable(
        this.currentService,
        getEnv("VUE_APP_ENABLE_SPEAKER_IDENTIFICATION") === "true",
      )
    },
    voiceCollections() {
      return this.$store.getters["organizations/getVoiceprintCollections"]
    },
    hotwordDictionaries() {
      return this.$store.getters["organizations/getHotwordDictionaries"]
    },
    // A recording is sent as a file, at the default security level.
    hotwordsAvailable() {
      return computeHotwordsAvailable(
        {
          source: "file",
          securityLevel: DEFAULT_SECURITY_LEVEL,
          languages: [computeLanguageCode(this.choices.language)],
        },
        { services: this.services, dictionaries: this.hotwordDictionaries },
      )
    },
    transcriptionSettings() {
      if (!this.currentService) return null
      const settings = buildTranscriptionSettings(this.currentService, {
        language: this.choices.language,
        diarization: this.choices.diarization,
        speakerIdentificationCollections: this.speakerIdentificationCapable
          ? this.choices.voiceCollections
          : [],
      })
      let hotwordDictionaries = []
      if (this.hotwordsAvailable) {
        hotwordDictionaries = this.choices.hotwordDictionaries
      }
      return { ...settings, hotwordDictionaries }
    },
    // A folder deleted since it was chosen falls back to the inbox.
    sharingSettings() {
      const folder = this.$store.getters["folders/getFolderById"](
        this.choices.folderId,
      )
      return {
        membersRight: this.choices.membersRight,
        folderId: folder ? folder._id : null,
      }
    },
    sharingSummary() {
      const rights = RIGHTS_LIST((key) => this.$t(key))
      const right = rights.find(
        (item) => item.value === this.sharingSettings.membersRight,
      )
      const folder = this.$store.getters["folders/getFolderById"](
        this.sharingSettings.folderId,
      )
      return this.$t("mobile.record.sharing_line", {
        right: right?.txt ?? "",
        folder: folder ? folder.name : this.$t("mobile.media.root_folder"),
      })
    },
    transcriptionSummary() {
      if (!this.servicesLoaded) return this.$t("mobile.common.loading")
      if (!this.currentService) {
        return this.$t("mobile.settings.no_service")
      }
      const language = this.languageLabel(this.choices.language)
      const speakers = this.transcriptionSettings.diarization
        ? this.$t("mobile.settings.speakers_auto")
        : this.$t("mobile.settings.speakers_off")
      const voices =
        this.transcriptionSettings.speakerIdentificationCollections.length > 0
          ? ` · ${this.$t("mobile.settings.voices_on")}`
          : ""
      return `${language} · ${speakers}${voices}`
    },
  },
  async created() {
    this.services = await loadTranscriptionServices()
    this.servicesLoaded = true
    this.applyPreferences(readTranscriptionPreferences(this.organizationScope))
    this.$store.dispatch("folders/fetchFolders")
    this.$store.dispatch("organizations/loadHotwordDictionaries")
    if (getEnv("VUE_APP_ENABLE_SPEAKER_IDENTIFICATION") === "true") {
      this.$store.dispatch("organizations/loadVoiceprintCollections")
    }
  },
  methods: {
    applyPreferences(saved) {
      this.choices = computeTranscriptionChoices(
        this.services,
        saved,
        this.$i18n.locale,
      )
    },
    updateChoices(choices) {
      this.choices = choices
      saveTranscriptionPreferences(this.organizationScope, this.choices)
    },
    languageLabel(language) {
      if (!language || language === "*") return this.$t("lang.automatic")
      return this.$t(`lang.${language.slice(0, 2)}`)
    },
  },
}
