<template>
  <LayoutV2 noHeader>
    <p v-if="failed" class="transcription-state">
      {{ $t("conversation.error.load_failed") }}
    </p>
    <div v-else-if="ready" class="transcription-editor-wrapper">
      <!-- no-theme-toggle: this view's chrome has no dark values. -->
      <linto-transcript-ui
        ref="editor"
        :locale="editorLocale"
        no-theme-toggle />
    </div>
    <p v-else class="transcription-state">
      {{ $t("conversation.loading.conversation_data") }}
    </p>
    <PublicationModal
      v-if="ready"
      v-model="publicationModal.open"
      :jobId="publicationModal.jobId"
      :serviceId="publicationModal.serviceId"
      :conversationId="publicationModal.conversationId"
      :organizationId="organizationId"
      :conversationName="conversationName" />
  </LayoutV2>
</template>

<script>
import LayoutV2 from "@/layouts/v2-layout.vue"
import PublicationModal from "@/components/molecules/PublicationModal.vue"
import { apiGetConversationWithRight } from "@/api/conversation.d/apiGetConversationWithRight.js"
import { TranscriptionController } from "@/services/transcriptUi/TranscriptionController/index.js"
import { SummaryController } from "@/services/transcriptUi/SummaryController/index.js"
import { ChatController } from "@/services/transcriptUi/ChatController/index.js"
import { convRoleMixin } from "@/mixins/convRole.js"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"
import { readBrandColor } from "@/tools/readBrandColor"
import { computeLanguageCode } from "@/tools/computeLanguageCode.js"

export default {
  name: "ConversationsTranscription",
  components: { LayoutV2, PublicationModal },
  mixins: [convRoleMixin],
  props: {
    userInfo: { type: Object, required: true },
  },
  data() {
    return {
      ready: false,
      failed: false,
      organizationId: null,
      conversationName: "",
      publicationModal: {
        open: false,
        jobId: null,
        serviceId: null,
        conversationId: null,
      },
    }
  },
  computed: {
    // The editor only knows bare languages: "en", not the app's "en-US".
    editorLocale() {
      return computeLanguageCode(this.$i18n.locale)
    },
  },
  async mounted() {
    const loaded = await apiGetConversationWithRight(
      this.$route.params.conversationId,
    )
    // Left during the load: beforeDestroy already ran, nothing to wire.
    if (this._isDestroyed) return
    if (!loaded) {
      this.failed = true
      return
    }
    this.organizationId = loaded.conversation.organizationId
    this.conversationName = loaded.conversation.name
    this.ready = true
    await this.$nextTick()
    if (this._isDestroyed) return
    this.mountTranscriptUi(this.$refs.editor.core, loaded)
  },
  beforeDestroy() {
    this.transcription?.destroy()
    this.summary?.destroy()
    this.chat?.destroy()
  },
  methods: {
    // The document is set before the controllers exist: they all start
    // from a core that knows its channels and tracks.
    mountTranscriptUi(core, { conversation, right }) {
      // The editor's theme tokens can't be overridden from outside the web
      // component: the brand colour is pushed (no theme switch here)
      core.primaryColor.value = readBrandColor() || null
      core.capabilities.value = this.computeCapabilities(right)
      core.setDocument(conversation.doc)
      this.transcription = new TranscriptionController(core, {
        conversationId: this.$route.params.conversationId,
        conversationName: conversation.name,
        socket: this.$apiEventWS,
        t: this.translate,
        notify: this.notify,
      })
      this.summary = new SummaryController(core, {
        organizationId: conversation.organizationId,
        securityLevel: conversation.securityLevel,
        socket: this.$apiEventWS,
        locale: this.$i18n.locale,
        t: this.translate,
        notify: this.notify,
        openPublication: this.openPublication,
      })
      this.chat = new ChatController(core, {
        t: this.translate,
        notify: this.notify,
        isOrganizationAdmin: this.isOrganizationAdmin,
        openUpgradeModal: this.openUpgradeModal,
      })
    },
    translate(key, params) {
      return this.$t(key, params)
    },
    notify(type, message) {
      this.$store.dispatch("system/addNotification", { type, message })
    },
    isOrganizationAdmin() {
      return (
        this.$store.getters["organizations/getUserRoleInOrganization"] ===
        ORGANIZATION_ROLES.ADMINISTRATOR
      )
    },
    // A SaaS refusal (quota, plan) offers to upgrade
    openUpgradeModal(refusal) {
      this.$store.dispatch("billing/openUpgradeModal", refusal)
    },
    // "Download" on a report
    openPublication(request) {
      this.publicationModal = { open: true, ...request }
    },
    // Forcing a regeneration takes every right: organization admin, owner,
    // or full rights shared.
    computeCapabilities(right) {
      const mode = this.hasWriteRight(right) ? "edit" : "view"
      return {
        text: mode,
        speakers: mode,
        summary: {
          generate: this.hasWriteRight(right),
          edit: this.hasWriteRight(right),
          forceGenerate: this.hasFullRight(right),
        },
        chat: this.hasReadRight(right) ? "enabled" : "disabled",
      }
    },
  },
}
</script>

<style scoped>
.transcription-state {
  margin: auto;
  padding: var(--large-gap);
  color: var(--text-secondary);
}

.transcription-editor-wrapper {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

linto-transcript-ui {
  display: block;
  flex: 1;
  min-height: 0;

  /* Map host theme variables to editor tokens */
  --color-primary: var(--primary-color);
  --color-primary-hover: var(--primary-color);
  --color-background: var(--background-app);
  --color-surface: var(--background-primary);
  --color-surface-hover: var(--neutral-20);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--neutral-60);
  --color-border: var(--neutral-30);
  --color-border-light: var(--neutral-20);
}
</style>
