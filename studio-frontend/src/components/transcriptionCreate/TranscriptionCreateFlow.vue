<template>
  <LoadingStep v-if="loading" @close="close" />

  <SourceStep
    v-else-if="view === 'source'"
    :draft="draft"
    :files="files"
    :sources="sources"
    :timingOptions="timingOptions"
    :minSecurityLevel="organizationSecurityLevel"
    :isQuickSessionRunning="Boolean(runningQuickSession)"
    :enableFileRecording="!isSourceAvailable('microphone')"
    :organizationId="organizationId"
    @change="updateDraft"
    @update-files="updateFiles"
    @next="view = 'summary'"
    @close="close" />

  <SummaryStep
    v-else-if="view === 'summary'"
    :draft="draft"
    :fileCount="files.length"
    :catalog="catalog"
    :engines="engines"
    :notices="notices"
    :speakerOptions="speakerOptions"
    :sourceIcon="sourceIcon"
    :offlineEngineLabel="offlineEngineLabel"
    :isFolderPrivate="isFolderPrivate"
    :sending="sending"
    :uploadProgress="uploadProgress"
    :error="error"
    :saasRefusal="saasRefusal"
    :saasRefusalView="saasRefusalView"
    :hasSaasRefusalPurchase="hasSaasRefusalPurchase"
    @change="updateDraft"
    @change-languages="changeLanguages"
    @edit="view = $event"
    @back="backToSource"
    @submit="submit"
    @close="close" />

  <EngineEditor
    v-else-if="view === 'liveEngine'"
    :title="$t('transcription_create.summary.live_engine')"
    :engines="liveEngines"
    :value="draft.profileId"
    @apply="applyProfile"
    @cancel="view = 'summary'"
    @close="close" />

  <EngineEditor
    v-else-if="view === 'offlineEngine'"
    :title="offlineEngineLabel"
    :engines="offlineEngines"
    :value="draft.serviceName"
    @apply="applyService"
    @cancel="view = 'summary'"
    @close="close" />

  <SpeakersEditor
    v-else-if="view === 'speakers'"
    :value="draft.speakers"
    :options="speakerOptions"
    :collections="catalog.collections"
    @apply="applySpeakers"
    @cancel="view = 'summary'"
    @close="close" />

  <SharingEditor
    v-else-if="view === 'sharing'"
    :value="draft.membersRight"
    @apply="applySummaryChange({ membersRight: $event })"
    @cancel="view = 'summary'"
    @close="close" />

  <VisioSubtitlesEditor
    v-else-if="view === 'visioSubtitles'"
    :value="draft.visio"
    :translations="draft.translations"
    @apply="applySummaryChange({ visio: { ...draft.visio, ...$event } })"
    @cancel="view = 'summary'"
    @close="close" />
</template>
<script>
import { mapGetters } from "vuex"
import { bus } from "@/tools/eventBus.js"

import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"
import { AUTO_LANGUAGE } from "@/const/transcriptionCreate.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions.js"
import { saasRefusalFormMixin } from "@/mixins/saasRefusalForm.js"
import { loadCatalog } from "@/services/transcriptionCreate/loadCatalog.js"
import {
  startMicrophoneSession,
  startVisioSession,
} from "@/services/transcriptionCreate/startQuickSession.js"
import { uploadFiles } from "@/services/transcriptionCreate/uploadFiles.js"
import { isSaasRefusal } from "@/tools/billing/isSaasRefusal"
import { getEnv } from "@/tools/getEnv"
import { buildBotRequest } from "@/tools/transcriptionCreate/buildBotRequest.js"
import { buildConversationRequest } from "@/tools/transcriptionCreate/buildConversationRequest.js"
import { buildQuickSessionRequest } from "@/tools/transcriptionCreate/buildQuickSessionRequest.js"
import { computeCompatibleProfiles } from "@/tools/transcriptionCreate/computeCompatibleProfiles.js"
import { computeCompatibleServices } from "@/tools/transcriptionCreate/computeCompatibleServices.js"
import { computeDraftEngines } from "@/tools/transcriptionCreate/computeDraftEngines.js"
import { computeLanguageSelection } from "@/tools/transcriptionCreate/computeLanguageSelection.js"
import { computeProfileLanguages } from "@/tools/transcriptionCreate/computeProfileLanguages.js"
import { computeServiceLanguages } from "@/tools/transcriptionCreate/computeServiceLanguages.js"
import { computeServiceName } from "@/tools/transcriptionCreate/computeServiceName.js"
import { computeSpeakerOptions } from "@/tools/transcriptionCreate/computeSpeakerOptions.js"
import { computeTimingOptions } from "@/tools/transcriptionCreate/computeTimingOptions.js"
import { createDraft } from "@/tools/transcriptionCreate/createDraft.js"
import { formatLanguageList } from "@/tools/transcriptionCreate/formatLanguageList.js"
import { mergeNotices } from "@/tools/transcriptionCreate/mergeNotices.js"
import { reconcileDraft } from "@/tools/transcriptionCreate/reconcileDraft.js"

import EngineEditor from "./EngineEditor.vue"
import LoadingStep from "./LoadingStep.vue"
import SharingEditor from "./SharingEditor.vue"
import SourceStep from "./SourceStep.vue"
import SpeakersEditor from "./SpeakersEditor.vue"
import SummaryStep from "./SummaryStep.vue"
import VisioSubtitlesEditor from "./VisioSubtitlesEditor.vue"

const SOURCE_ICONS = {
  file: "file-audio",
  microphone: "microphone",
  visio: "webcam",
  session: "plugs-connected",
}

// Owns the draft: every change goes through updateDraft, which reconciles it
// with what the organization offers. The screens only display it and emit.
export default {
  name: "TranscriptionCreateFlow",
  components: {
    EngineEditor,
    LoadingStep,
    SharingEditor,
    SourceStep,
    SpeakersEditor,
    SummaryStep,
    VisioSubtitlesEditor,
  },
  mixins: [orgaRoleMixin, organizationPermissionsMixin, saasRefusalFormMixin],
  data() {
    return {
      loading: true,
      // "source" | "summary" | "liveEngine" | "offlineEngine" | "speakers"
      // | "sharing" | "visioSubtitles"
      view: "source",
      draft: null,
      // See reconcileDraft: what the last change did to the user's choices
      notices: [],
      files: [],
      loadedProfiles: [],
      loadedServices: [],
      hasAnyProfile: false,
      sending: false,
      uploadProgress: null,
      error: null,
    }
  },
  computed: {
    ...mapGetters("billing", ["isLiveCreditExhausted"]),
    ...mapGetters("quickSession", ["runningQuickSession"]),
    ...mapGetters("organizations", {
      organizationId: "getCurrentOrganizationScope",
      voiceprintCollections: "getVoiceprintCollections",
    }),
    organizationSecurityLevel() {
      const organization = this.$store.getters[
        "organizations/getOrganizationById"
      ](this.organizationId)
      return organization?.securityLevel ?? DEFAULT_SECURITY_LEVEL
    },
    catalog() {
      return {
        // Without live minutes left, no profile: nothing can go live.
        profiles: this.isLiveCreditExhausted ? [] : this.loadedProfiles,
        services: this.loadedServices,
        collections: this.voiceprintCollections,
        speakerIdentificationEnabled:
          getEnv("VUE_APP_ENABLE_SPEAKER_IDENTIFICATION") === "true",
      }
    },
    isSessionEnabled() {
      return getEnv("VUE_APP_ENABLE_SESSION") === "true"
    },
    sources() {
      return [
        { name: "file", allowed: this.canUploadInCurrentOrganization },
        {
          name: "microphone",
          allowed:
            this.isSessionEnabled &&
            this.isAtLeastQuickMeeting &&
            this.canMicrophoneInCurrentOrganization,
        },
        {
          name: "visio",
          allowed:
            this.isSessionEnabled &&
            this.isAtLeastQuickMeeting &&
            this.canBotInCurrentOrganization,
        },
        {
          name: "session",
          allowed:
            this.isSessionEnabled &&
            this.isAtLeastMeetingManager &&
            this.canSessionInCurrentOrganization,
        },
      ]
        .filter((source) => source.allowed)
        .map(({ name }) => ({
          name,
          icon: SOURCE_ICONS[name],
          // A session takes at least one profile.
          disabled: name === "session" && !this.hasAnyProfile,
        }))
    },
    sourceIcon() {
      return SOURCE_ICONS[this.draft.source]
    },
    timingOptions() {
      return computeTimingOptions(this.draft.securityLevel, this.catalog)
    },
    engines() {
      return computeDraftEngines(this.draft, this.catalog)
    },
    speakerOptions() {
      return computeSpeakerOptions(this.draft, this.engines, this.catalog)
    },
    liveEngines() {
      return computeCompatibleProfiles(this.catalog.profiles, this.draft).map(
        (profile) => ({
          id: profile.id,
          name: profile.config.name,
          languages: this.formatEngineLanguages(
            computeProfileLanguages(profile),
          ),
        }),
      )
    },
    offlineEngines() {
      return computeCompatibleServices(this.catalog.services, this.draft).map(
        (service) => ({
          id: service.serviceName,
          name: computeServiceName(service, this.$i18n.locale),
          languages: this.formatServiceLanguages(service),
        }),
      )
    },
    offlineEngineLabel() {
      return this.draft.source === "file"
        ? this.$t("transcription_create.summary.engine")
        : this.$t("transcription_create.summary.offline_engine")
    },
    // An upload stops at the first refused file, which stays first in line; its
    // name only helps among several (saasRefusalFormMixin).
    saasRefusalFileName() {
      return this.files.length > 1 ? this.files[0].value : null
    },
    isFolderPrivate() {
      const folder = this.$store.getters["folders/getFolderById"](
        this.draft.folderId,
      )
      return folder?.visibility === "private"
    },
  },
  watch: {
    // The modal doesn't outlive the page, unless sending: it reports the outcome.
    $route() {
      if (!this.sending) this.close()
    },
    // Live minutes bought from the modal, or a list of speakers loaded late.
    isLiveCreditExhausted: "reconcileWithCatalog",
    voiceprintCollections: "reconcileWithCatalog",
  },
  async created() {
    this.$store.dispatch("folders/fetchFolders")
    // The session source depends on the org's plan and live on its balance.
    if (getEnv("VUE_APP_MODE") === "cloud") {
      await this.$store.dispatch("billing/fetchUsage", this.organizationId)
    }
    const { profiles, services, hasAnyProfile } = await loadCatalog(
      this.organizationId,
    )
    this.loadedProfiles = profiles
    this.loadedServices = services
    this.hasAnyProfile = hasAnyProfile
    if (this.sources.length === 0) {
      this.close()
      this.$router.push({ name: "not_found" })
      return
    }
    this.draft = createDraft({
      source: (this.sources.find((s) => !s.disabled) ?? this.sources[0]).name,
      securityLevel: this.organizationSecurityLevel,
    })
    this.reconcile({})
    this.loading = false
  },
  methods: {
    close() {
      this.$emit("close")
    },
    setSending(sending) {
      this.sending = sending
      this.$emit("sending-change", sending)
    },
    isSourceAvailable(name) {
      return this.sources.some((source) => source.name === name)
    },
    // On the first step, notices wait for the summary to show them.
    reconcile(change) {
      const { draft, notices } = reconcileDraft(
        { ...this.draft, ...change },
        this.catalog,
      )
      this.draft = draft
      this.notices =
        this.view === "source" ? mergeNotices(this.notices, notices) : notices
    },
    reconcileWithCatalog() {
      if (this.draft) this.reconcile({})
    },
    clearFeedback() {
      this.saasRefusal = null
      this.error = null
    },
    updateDraft(change) {
      this.reconcile(change)
      this.clearFeedback()
    },
    // A refusal is about the files it was given: another selection may pass.
    updateFiles(files) {
      this.files = files
      this.clearFeedback()
    },
    backToSource() {
      this.notices = []
      this.view = "source"
    },
    changeLanguages(next) {
      this.updateDraft({
        languages: computeLanguageSelection(this.draft.languages, next),
      })
    },
    applySummaryChange(change) {
      this.updateDraft(change)
      this.view = "summary"
    },
    applyProfile(profileId) {
      this.applySummaryChange({ profileId, profileChosenByUser: true })
    },
    applyService(serviceName) {
      this.applySummaryChange({ serviceName, serviceChosenByUser: true })
    },
    applySpeakers(speakers) {
      this.applySummaryChange({ speakers, speakersChosenByUser: true })
    },
    formatServiceLanguages(service) {
      const codes = computeServiceLanguages(service)
      return codes.includes(AUTO_LANGUAGE)
        ? this.$t("lang.automatic")
        : this.formatEngineLanguages(codes)
    },
    formatEngineLanguages(codes) {
      return this.$t("transcription_create.engine.languages", {
        languages: formatLanguageList(codes, this.$i18n.locale),
      })
    },

    async submit() {
      if (this.sending) return
      this.setSending(true)
      this.error = null
      this.saasRefusal = null
      switch (this.draft.source) {
        case "file":
          await this.submitFiles()
          break
        case "microphone":
          await this.submitMicrophone()
          break
        case "visio":
          await this.submitVisio()
          break
        default:
          console.error("Unknown transcription source", this.draft.source)
      }
      this.setSending(false)
    },
    async submitFiles() {
      const { draft } = this
      const { service } = this.engines
      const total = this.files.length
      this.uploadProgress = { index: 1, total, percent: 0 }
      const result = await uploadFiles(
        this.organizationId,
        [...this.files],
        (file) => buildConversationRequest(draft, service, file),
        {
          onProgress: this.updateUploadPercent,
          onFileSent: this.markFileSent,
        },
      )
      this.uploadProgress = null
      this.refreshUsage()
      if (result.success) {
        this.leaveForProcessedFiles()
      } else {
        this.showUploadFailure(result)
      }
    },
    updateUploadPercent(percent) {
      this.uploadProgress.percent = percent
    },
    // What was sent leaves the list: a new attempt starts from the failed file.
    markFileSent(file) {
      this.files = this.files.filter((other) => other !== file)
      this.uploadProgress = {
        ...this.uploadProgress,
        index: this.uploadProgress.index + 1,
        percent: 0,
      }
    },
    leaveForProcessedFiles() {
      bus.$emit("app_notif", {
        status: "success",
        message: this.$t("conversation.creation_success_message"),
        redirect: false,
        cantBeClosed: true,
      })
      this.leaveFor({
        name: "explore-processing",
        params: { organizationId: this.organizationId },
      })
    },
    showUploadFailure({ sent, total, errorCode, errorData }) {
      if (isSaasRefusal(errorData)) {
        this.saasRefusal = errorData
        if (sent > 0) {
          bus.$emit("app_notif", {
            status: "info",
            message: this.$tc(
              "conversation.conversation_creation_partially_sent",
              sent,
              { count: sent, total },
            ),
            timeout: null,
          })
        }
        return
      }
      this.error =
        errorCode === "FILE_TOO_LARGE"
          ? this.$t("conversation.file_too_big", {
              maxSize: errorData?.maxSize,
            })
          : this.$t(
              "conversation.conversation_creation_error_multiple_unknown",
              { count: sent, total },
            )
    },
    async submitMicrophone() {
      const result = await startMicrophoneSession(
        this.organizationId,
        buildQuickSessionRequest(this.draft, this.engines),
      )
      this.finishQuickSession(result)
    },
    async submitVisio() {
      const result = await startVisioSession(
        this.organizationId,
        buildQuickSessionRequest(this.draft, this.engines),
        (channelId) => buildBotRequest(this.draft, channelId),
      )
      this.finishQuickSession(result)
    },
    finishQuickSession({ success, errorData, botFailed }) {
      if (success) {
        this.leaveFor({
          name: "quick session",
          params: { organizationId: this.organizationId },
        })
      } else if (isSaasRefusal(errorData)) {
        this.saasRefusal = errorData
      } else {
        this.error = botFailed
          ? this.$t("quick_session.setup_visio.bot_error")
          : this.$t("quick_session.creation.start_error")
      }
    },
    // Closed first: going to the page already shown triggers no route change.
    leaveFor(route) {
      this.close()
      this.$router.push(route).catch(() => {})
    },
    // The sidebar gauges and the next refusal read the quota and the packs
    // from the store: keep them in step with what was just used or refused.
    refreshUsage() {
      if (getEnv("VUE_APP_MODE") !== "cloud") return
      this.$store.dispatch("billing/fetchUsage", this.organizationId)
      this.$store.dispatch("billing/fetchCreditLots", this.organizationId)
    },
  },
}
</script>
