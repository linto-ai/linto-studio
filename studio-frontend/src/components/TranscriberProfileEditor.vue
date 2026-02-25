<template>
  <div class="flex flex1 col gap-small">
    <NotificationBanner variant="warning" v-if="!organizationId">
      {{ $t("backoffice.transcriber_profile_detail.warning_global.line_1") }}
    </NotificationBanner>

    <!-- Side-by-side layout: Config form + JSON editor -->
    <div class="editor-content flex1">
      <!-- Left: Configuration form -->
      <Panel :title="`Configuration ${typesLabels[currentType]}`">
        <TranscriberProfileConfigLinto
          v-if="currentType === 'linto'"
          v-model="l_transcriberProfile.config"
          :quickMeeting="l_transcriberProfile.quickMeeting"
          @update:quickMeeting="l_transcriberProfile.quickMeeting = $event" />

        <TranscriberProfileConfigMicrosoft
          v-if="currentType === 'microsoft'"
          v-model="l_transcriberProfile.config"
          :quickMeeting="l_transcriberProfile.quickMeeting"
          @update:quickMeeting="l_transcriberProfile.quickMeeting = $event" />

        <TranscriberProfileConfigAmazon
          v-if="currentType === 'amazon'"
          ref="amazonConfig"
          v-model="l_transcriberProfile.config"
          :quickMeeting="l_transcriberProfile.quickMeeting"
          @update:quickMeeting="l_transcriberProfile.quickMeeting = $event"
          @files-changed="onFilesChanged" />

        <TranscriberProfileConfigVoxstral
          v-if="currentType === 'voxstral'"
          v-model="l_transcriberProfile.config"
          :quickMeeting="l_transcriberProfile.quickMeeting"
          @update:quickMeeting="l_transcriberProfile.quickMeeting = $event" />
      </Panel>

      <!-- Right: JSON editor -->
      <Panel title="JSON" variant="dark" noPadding>
        <TranscriberProfileEditorPlain
          v-model="l_transcriberProfile"
          ref="editorPlain" />
      </Panel>
    </div>
  </div>
</template>

<script>
import TRANSCRIBER_PROFILES_TEMPLATES from "@/const/transcriberProfilesTemplates"
import TranscriberProfileEditorPlain from "@/components/TranscriberProfileEditorPlain.vue"
import Panel from "@/components/atoms/Panel.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import TranscriberProfileConfigLinto from "@/components/TranscriberProfileConfigLinto.vue"
import TranscriberProfileConfigMicrosoft from "@/components/TranscriberProfileConfigMicrosoft.vue"
import TranscriberProfileConfigAmazon from "@/components/TranscriberProfileConfigAmazon.vue"
import TranscriberProfileConfigVoxstral from "@/components/TranscriberProfileConfigVoxstral.vue"

export default {
  props: {
    transcriberProfile: {
      type: Object,
      required: false,
      default: () => TRANSCRIBER_PROFILES_TEMPLATES.linto,
    },
    organizationId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      typesLabels: {
        linto: "LinTO",
        microsoft: "Microsoft",
        amazon: "Amazon",
        voxstral: "Voxstral",
      },
      l_transcriberProfile: {
        ...structuredClone(this.transcriberProfile),
        organizationId: this.organizationId,
      },
      amazonFiles: {
        certificate: null,
        privateKey: null,
      },
      skipNextEmit: false,
    }
  },
  computed: {
    currentType() {
      return this.transcriberProfile.config.type
    },
    currentSecurityLevel: {
      get() {
        return (
          this.transcriberProfile.meta?.securityLevel ?? DEFAULT_SECURITY_LEVEL
        )
      },
      set(value) {
        const updatedProfile = structuredClone(this.transcriberProfile)
        if (!updatedProfile.meta) {
          updatedProfile.meta = {}
        }
        updatedProfile.meta.securityLevel = value
        this.$emit("input", updatedProfile)
        this.$nextTick(() => {
          this.reset()
        })
      },
    },
  },
  watch: {
    transcriberProfile: {
      handler(value) {
        this.skipNextEmit = true
        this.l_transcriberProfile = {
          ...structuredClone(value),
          organizationId: this.organizationId,
        }
        this.$nextTick(() => {
          this.$refs.editorPlain?.resetValue()
        })
      },
      deep: true,
    },
    organizationId(value) {
      this.l_transcriberProfile.organizationId = value
    },
    l_transcriberProfile: {
      handler(value) {
        if (this.skipNextEmit) {
          this.skipNextEmit = false
          return
        }
        this.$emit("input", value)
      },
      deep: true,
    },
  },
  methods: {
    async reset() {
      await this.$nextTick()
      this.l_transcriberProfile = {
        ...structuredClone(this.transcriberProfile),
        organizationId: this.organizationId,
      }
      this.amazonFiles = { certificate: null, privateKey: null }
      if (this.$refs.amazonConfig) {
        this.$refs.amazonConfig.resetFiles()
      }
      this.$nextTick(() => {
        this.$refs.editorPlain.resetValue()
      })
    },
    onFilesChanged(files) {
      this.amazonFiles = files
      this.$emit("files-changed", files)
    },
    getAmazonFiles() {
      return this.amazonFiles
    },
  },
  components: {
    TranscriberProfileEditorPlain,
    Panel,
    NotificationBanner,
    TranscriberProfileConfigLinto,
    TranscriberProfileConfigMicrosoft,
    TranscriberProfileConfigAmazon,
    TranscriberProfileConfigVoxstral,
  },
}
</script>

<style scoped>
.editor-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--medium-gap);
}

.editor-content :deep(.panel) {
  min-height: 0;
}

.editor-content :deep(.panel__body) {
  min-height: 0;
}

.editor-content :deep(.form-label) {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.editor-content :deep(input[type="text"]),
.editor-content :deep(input[type="password"]) {
  padding: var(--small-gap) var(--small-gap);
  border: var(--border-input);
  border-radius: 4px;
  font-size: var(--text-sm);
  background: var(--input-background);
}

.editor-content :deep(input[type="text"]:focus),
.editor-content :deep(input[type="password"]:focus) {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-soft);
}

/* JSON editor textarea */
.editor-content :deep(.transcriber-profile-editor__plain) {
  flex: 1;
  min-height: 200px;
}

@media (max-width: 800px) {
  .editor-content {
    grid-template-columns: 1fr;
  }
}
</style>
