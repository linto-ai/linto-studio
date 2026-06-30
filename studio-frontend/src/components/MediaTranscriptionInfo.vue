<template>
  <div class="media-transcription-info flex col flex1">
    <InfoList
      v-if="rows.length"
      :title="$t('media_explorer.panel.transcription.title')"
      :rows="rows">
      <!-- Template row actions (Voir / Utiliser ce modèle). -->
      <template v-if="templateDisplay && templateDisplay.id" #actions-template>
        <Button
          variant="secondary"
          icon="eye"
          size="xs"
          :label="$t('media_explorer.panel.show_template_button')"
          @click="showTemplateInfo = true" />
        <Button
          v-if="canSessionInCurrentOrganization"
          variant="secondary"
          icon="plus"
          size="xs"
          :label="$t('media_explorer.panel.use_template_button')"
          :to="{
            name: 'conversations create',
            params: { organizationId: templateDisplay.organizationId },
            query: { template: templateDisplay.id },
          }" />
      </template>
    </InfoList>

    <MediaSessionInfo v-if="medias.length === 1" :media="medias[0]" />

    <ModalSessionTemplateInfo
      v-if="templateDisplay && templateDisplay.id"
      v-model="showTemplateInfo"
      :templateId="templateDisplay.id"
      :organizationId="templateDisplay.organizationId" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import Button from "@/components/atoms/Button.vue"
import InfoList from "@/components/molecules/InfoList.vue"
import MediaSessionInfo from "./MediaSessionInfo.vue"
import ModalSessionTemplateInfo from "./ModalSessionTemplateInfo.vue"
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions.js"
import { formatLanguageMixin } from "@/mixins/formatLanguage"
import resolveDiarizationCollectionName from "@/tools/resolveDiarizationCollectionName.js"

// Models that punctuate inline: punctuation is always applied regardless of
// the punctuationConfig flag.
const BUILT_IN_PUNCTUATION_MODELS = ["whisper", "nemo"]

// Content equality, array-aware (a field value can be a string or an array,
// e.g. identification collection names).
function valuesEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => item === b[i])
  }
  return a === b
}

export default {
  name: "MediaTranscriptionInfo",
  mixins: [organizationPermissionsMixin, formatLanguageMixin],
  components: { Button, InfoList, MediaSessionInfo, ModalSessionTemplateInfo },
  props: {
    // One or more medias. Single media renders its values; multiple medias
    // collapse each field to a common value or the "multiple values" sentinel.
    medias: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showTemplateInfo: false,
    }
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
      voiceprintCollections: "getVoiceprintCollections",
    }),
    // Each field knows its icon, label and how to read one media. Rows reduce
    // these across the selection.
    fieldDefs() {
      const defs = [
        {
          id: "engine",
          icon: "sparkle",
          label: this.$t("media_explorer.panel.transcription.engine"),
          get: (m) => m?.metadata?.transcription?.endpoint || null,
        },
        {
          id: "language",
          icon: "translate",
          label: this.$t("conversation.transcription.language_label"),
          get: (m) => this.formatLanguage(this.resolvedLanguage(m)),
        },
        {
          id: "punctuation",
          icon: "text-aa",
          label: this.$t("conversation.transcription.punctuation_label"),
          get: (m) => this.formatPunctuation(m),
        },
        {
          id: "normalization",
          icon: "hash",
          label: this.$t("media_explorer.panel.transcription.normalization"),
          get: (m) => {
            const cfg = this.config(m)
            return cfg ? this.formatBool(cfg.enableNormalization) : null
          },
        },
        {
          id: "diarization",
          icon: "users",
          label: this.$t("conversation.transcription.model_diarization"),
          get: (m) => this.formatDiarization(m),
        },
        {
          id: "identification",
          icon: "identification-card",
          label: this.$t(
            "conversation.transcription.speaker_identification_title",
          ),
          get: (m) => this.formatIdentification(m),
        },
      ]
      // Session media show the language in MediaSessionInfo.
      if (this.isSessionMedia) {
        return defs.filter((def) => def.id !== "language")
      }
      return defs
    },
    paramRows() {
      const empty = this.$t("media_explorer.panel.transcription.empty")
      const multiple = this.$t(
        "media_explorer.panel.transcription.multiple_values",
      )
      return this.fieldDefs.map((def) => {
        const values = this.medias.map((m) => def.get(m))
        const first = values[0]
        const allSame = values.every((v) => valuesEqual(v, first))
        const value = allSame ? (first ?? empty) : multiple
        return {
          id: def.id,
          icon: def.icon,
          label: def.label,
          value,
          muted: !allSame || first == null,
        }
      })
    },
    // The template, when present, is the leading row of the same list; its
    // actions are injected through the `actions-template` slot.
    rows() {
      const params =
        !this.isSessionMedia || this.sessionHasTranscription
          ? this.paramRows
          : []
      if (!this.templateDisplay) return params
      return [
        {
          id: "template",
          icon: "cards-three",
          label: this.$t("media_explorer.panel.template_label"),
          value: this.templateDisplay.name,
          muted: this.templateDisplay.multiple,
        },
        ...params,
      ]
    },
    // Collapses the template across the selection: a common template shows its
    // name + actions, differing templates show the "multiple values" sentinel.
    templateDisplay() {
      const names = this.medias.map((m) => m?.metadata?.template?.name ?? null)
      if (!names.some(Boolean)) return null

      const first = names[0]
      const allSame = names.every((n) => n === first)
      if (!allSame) {
        return {
          name: this.$t("media_explorer.panel.transcription.multiple_values"),
          id: null,
          multiple: true,
        }
      }

      const firstMedia = this.medias[0]
      return {
        name: first,
        id: firstMedia?.metadata?.template?.id ?? null,
        organizationId:
          firstMedia?.organization?.organizationId ??
          this.currentOrganizationScope,
        multiple: false,
      }
    },
    isSessionMedia() {
      return (
        this.medias.length === 1 &&
        (this.medias[0]?.metadata?.session?.channels?.length ?? 0) > 0
      )
    },
    sessionHasTranscription() {
      if (!this.isSessionMedia) return false
      const transcription = this.medias[0]?.metadata?.transcription
      return !!(transcription?.endpoint || transcription?.transcriptionConfig)
    },
  },
  methods: {
    config(media) {
      return media?.metadata?.transcription?.transcriptionConfig ?? null
    },
    // The resolved (detected) language lives on `locale`; the config language
    // is often "*" (auto-detect), which is not what we want to display.
    resolvedLanguage(media) {
      return media?.locale || this.config(media)?.language || null
    },
    formatBool(value) {
      return value
        ? this.$t("media_explorer.panel.transcription.value_enabled")
        : this.$t("media_explorer.panel.transcription.value_disabled")
    },
    formatPunctuation(media) {
      const cfg = this.config(media)
      if (!cfg) return null
      if (BUILT_IN_PUNCTUATION_MODELS.includes(cfg.modelType)) {
        return this.$t("conversation.transcription.punctuation_value_whisper")
      }
      return this.formatBool(cfg.punctuationConfig?.enablePunctuation)
    },
    formatDiarization(media) {
      const diarization = this.config(media)?.diarizationConfig
      if (!diarization) return null
      if (!diarization.enableDiarization) {
        return this.$t("media_explorer.panel.transcription.value_disabled")
      }
      const count = diarization.numberOfSpeaker
      if (Number.isFinite(count) && count > 0) {
        return this.$tc(
          "media_explorer.panel.transcription.speakers_count",
          count,
          { count },
        )
      }
      return this.$t("lang.automatic")
    },
    formatIdentification(media) {
      const cfg = this.config(media)
      if (!cfg) return null
      const collections =
        cfg.diarizationConfig?.speakerIdentificationConfig?.collections
      if (!collections?.length) {
        return this.$t("media_explorer.panel.transcription.value_disabled")
      }
      const names = collections
        .map((qdrantCollectionName) =>
          this.collectionName(qdrantCollectionName),
        )
        .filter(Boolean)
      // Configured but not resolvable (no matching collection): generic label.
      if (names.length === 0) {
        return this.$t("media_explorer.panel.transcription.value_enabled")
      }
      // An array renders one collection per line (see InfoRow).
      return names
    },
    // The config references collections by their `qdrantCollectionName`; resolve
    // it to the human collection name from the org store.
    collectionName(qdrantCollectionName) {
      const collection = this.voiceprintCollections.find(
        (c) => c.qdrantCollectionName === qdrantCollectionName,
      )
      return resolveDiarizationCollectionName(collection, (key) => this.$t(key))
    },
  },
}
</script>

<style scoped>
.media-transcription-info {
  overflow-y: auto;
  padding: 1rem;
}
</style>
