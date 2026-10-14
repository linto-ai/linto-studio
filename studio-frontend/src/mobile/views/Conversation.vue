<template>
  <div class="m-page m-conversation">
    <PageHeader
      :title="$t('mobile.home.media_title')"
      :back-to="{ name: 'media' }" />
    <p v-if="failed" class="m-muted m-conversation__state">
      {{ $t("mobile.conversation.load_failed") }}
    </p>
    <div v-else-if="ready" class="m-conversation__editor">
      <!-- no-theme-toggle: this shell has no dark values. -->
      <linto-transcript-ui
        ref="editor"
        :locale="editorLocale"
        no-theme-toggle />
    </div>
    <p v-else class="m-muted m-conversation__state">
      {{ $t("mobile.common.loading") }}
    </p>
    <ReportPdfFlow
      v-if="ready"
      ref="reportPdf"
      :conversation-name="conversationName"
      :organization-id="organizationId" />
  </div>
</template>

<script>
import PageHeader from "@/mobile/components/PageHeader.vue"
import ReportPdfFlow from "@/mobile/components/publication/ReportPdfFlow.vue"
import { loadEditor } from "@/mobile/services/editor/loadEditor.js"
import {
  connectRealtime,
  realtimeSocket,
} from "@/mobile/services/realtime/mediaUpdates.js"
import { apiGetConversationWithRight } from "@/api/conversation.d/apiGetConversationWithRight.js"
import { TranscriptionController } from "@/services/transcriptUi/TranscriptionController/index.js"
import { SummaryController } from "@/services/transcriptUi/SummaryController/index.js"
import { ChatController } from "@/services/transcriptUi/ChatController/index.js"
import { convRoleMixin } from "@/mixins/convRole.js"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"
import { readBrandColor } from "@/tools/readBrandColor"
import { computeLanguageCode } from "@/tools/computeLanguageCode.js"

export default {
  name: "MobileConversation",
  components: { PageHeader, ReportPdfFlow },
  mixins: [convRoleMixin],
  data() {
    return {
      ready: false,
      failed: false,
      organizationId: null,
      conversationName: "",
    }
  },
  computed: {
    // The editor only knows bare languages: "en", not the app's "en-US".
    editorLocale() {
      return computeLanguageCode(this.$i18n.locale)
    },
  },
  async mounted() {
    // The web component is fetched on demand: registered alongside the load.
    // The socket carries the editing protocol; a late connection is fine,
    // the editor room is joined again on connect.
    const [editorModule, loaded] = await Promise.all([
      loadEditor().catch((error) => console.error(error)),
      apiGetConversationWithRight(this.$route.params.conversationId),
      connectRealtime(),
    ])
    // Left during the load: beforeDestroy already ran, nothing to wire.
    if (this._isDestroyed) return
    if (!editorModule || !loaded) {
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
      core.primaryColor.value = readBrandColor("--m-primary") || null
      core.capabilities.value = this.computeCapabilities(right)
      core.setDocument(conversation.doc)
      this.transcription = new TranscriptionController(core, {
        conversationId: this.$route.params.conversationId,
        conversationName: conversation.name,
        socket: realtimeSocket,
        t: this.translate,
        notify: this.notify,
      })
      this.summary = new SummaryController(core, {
        organizationId: conversation.organizationId,
        securityLevel: conversation.securityLevel,
        socket: realtimeSocket,
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
    // "Download" on a report: exported as a PDF read in the app
    openPublication(request) {
      this.$refs.reportPdf?.start(request)
    },
    // Summaries are generated in the mobile app, never edited. Forcing a
    // regeneration takes every right: organization admin, owner, or full
    // rights shared.
    computeCapabilities(right) {
      const mode = this.hasWriteRight(right) ? "edit" : "view"
      return {
        text: mode,
        speakers: mode,
        summary: {
          generate: this.hasWriteRight(right),
          edit: false,
          forceGenerate: this.hasFullRight(right),
        },
        chat: this.hasReadRight(right) ? "enabled" : "disabled",
      }
    },
  },
}
</script>

<style scoped>
.m-conversation {
  max-width: none;
  height: 100dvh;
}

.m-conversation__editor {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.m-conversation__editor linto-transcript-ui {
  display: block;
  flex: 1;
  min-height: 0;
  --color-primary: var(--m-primary);
  --color-primary-hover: var(--m-primary);
  --color-background: var(--m-bg);
  --color-surface: var(--m-surface);
  --color-text-primary: var(--m-text);
  --color-text-secondary: var(--m-text-muted);
  --color-border: var(--m-border);
}

.m-conversation__state {
  text-align: center;
  padding: var(--m-space-6) var(--m-space-4);
}
</style>
