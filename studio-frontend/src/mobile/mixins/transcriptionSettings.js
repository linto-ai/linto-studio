import { loadTranscriptionServices } from "@/mobile/services/transcription/loadTranscriptionServices.js"
import {
  readTranscriptionPreferences,
  saveTranscriptionPreferences,
} from "@/mobile/services/transcription/transcriptionPreferences.js"
import { pickRecommendedService } from "@/mobile/tools/pickRecommendedService.js"
import { buildTranscriptionSettings } from "@/mobile/tools/buildTranscriptionSettings.js"
import getDescriptionByLanguage from "@/tools/getDescriptionByLanguage.js"
import { isSpeakerIdentificationCapable } from "@/mobile/tools/isSpeakerIdentificationCapable.js"
import { getEnv } from "@/tools/getEnv"
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
        serviceName: null,
        language: null,
        diarization: true,
        voiceCollections: [],
        membersRight: DEFAULT_MEMBERS_RIGHT,
        folderId: null,
      },
    }
  },
  computed: {
    organizationScope() {
      return this.$store.getters["organizations/getCurrentOrganizationScope"]
    },
    currentService() {
      return pickRecommendedService(this.services, this.choices.serviceName)
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
    transcriptionSettings() {
      if (!this.currentService) return null
      return buildTranscriptionSettings(this.currentService, {
        language: this.choices.language,
        diarization: this.choices.diarization,
        speakerIdentificationCollections: this.speakerIdentificationCapable
          ? this.choices.voiceCollections
          : [],
      })
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
      if (!this.currentService) {
        return this.$t("mobile.settings.no_service")
      }
      const language = this.languageLabel(this.choices.language)
      const service = getDescriptionByLanguage(
        this.currentService.desc,
        this.$i18n.locale,
        this.currentService.serviceName,
      )
      const speakers = this.transcriptionSettings.diarization
        ? this.$t("mobile.settings.speakers_auto")
        : this.$t("mobile.settings.speakers_off")
      const voices =
        this.transcriptionSettings.speakerIdentificationCollections.length > 0
          ? ` · ${this.$t("mobile.settings.voices_on")}`
          : ""
      return `${language} · ${service} · ${speakers}${voices}`
    },
  },
  async created() {
    this.services = await loadTranscriptionServices()
    this.servicesLoaded = true
    this.applyPreferences(readTranscriptionPreferences(this.organizationScope))
    this.$store.dispatch("folders/fetchFolders")
    if (getEnv("VUE_APP_ENABLE_SPEAKER_IDENTIFICATION") === "true") {
      this.$store.dispatch("organizations/loadVoiceprintCollections")
    }
  },
  methods: {
    applyPreferences(saved) {
      const service = pickRecommendedService(this.services, saved?.serviceName)
      const languages = (service?.language || "*").split(",")
      const appLanguage = languages.find((code) =>
        code.startsWith(this.$i18n.locale.slice(0, 2)),
      )
      this.choices = {
        serviceName: service?.serviceName ?? null,
        language: languages.includes(saved?.language)
          ? saved.language
          : (appLanguage ?? languages[0]),
        diarization: saved?.diarization ?? true,
        // Not restored from storage: a deleted collection would be sent.
        voiceCollections: [],
        membersRight: saved?.membersRight ?? DEFAULT_MEMBERS_RIGHT,
        folderId: saved?.folderId ?? null,
      }
    },
    updateChoices(choices) {
      const serviceChanged = choices.serviceName !== this.choices.serviceName
      this.choices = choices
      if (serviceChanged) this.applyPreferences({ ...choices, language: null })
      saveTranscriptionPreferences(this.organizationScope, this.choices)
    },
    languageLabel(language) {
      if (!language || language === "*") return this.$t("lang.automatic")
      return this.$t(`lang.${language.slice(0, 2)}`)
    },
  },
}
