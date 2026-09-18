<template>
  <div class="m-page m-conversation">
    <PageHeader
      :title="$t('mobile.home.media_title')"
      :back-to="{ name: 'media' }" />
    <p v-if="failed" class="m-muted m-conversation__state">
      {{ $t("mobile.conversation.load_failed") }}
    </p>
    <div v-else class="m-conversation__editor">
      <linto-editor v-if="ready" ref="editor" :locale="$i18n.locale" />
      <p v-else class="m-muted m-conversation__state">
        {{ $t("mobile.common.loading") }}
      </p>
    </div>
    <ReportPdfFlow
      v-if="ready"
      ref="reportPdf"
      :conversation-id="$route.params.conversationId"
      :conversation-name="name"
      :organization-id="organizationId" />
  </div>
</template>

<script>
import PageHeader from "@/mobile/components/PageHeader.vue"
import ReportPdfFlow from "@/mobile/components/publication/ReportPdfFlow.vue"
import { ConversationEditorSession } from "@/mobile/services/editor/ConversationEditorSession.js"
import {
  connectRealtime,
  realtimeSocket,
} from "@/mobile/services/realtime/mediaUpdates.js"

// The same editor web component as the classic page, inside the mobile
// app, with a back link to the media list.
export default {
  name: "MobileConversation",
  components: { PageHeader, ReportPdfFlow },
  data() {
    return { ready: false, failed: false, name: "", organizationId: null }
  },
  async created() {
    this.session = new ConversationEditorSession({
      conversationId: this.$route.params.conversationId,
      socket: realtimeSocket,
      store: this.$store,
      i18n: this.$i18n,
      openPublication: (request) => this.$refs.reportPdf?.start(request),
    })
    try {
      await connectRealtime()
      await this.session.load()
    } catch (error) {
      console.error("cannot open conversation", error)
      this.failed = true
      return
    }
    this.name = this.session.name
    this.organizationId = this.session.document.organizationId
    this.ready = true
    await this.$nextTick()
    await this.session.mount(this.$refs.editor)
  },
  beforeDestroy() {
    this.session?.destroy()
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

.m-conversation__editor linto-editor {
  display: block;
  flex: 1;
  min-height: 0;
  --color-primary: var(--m-primary);
  --color-primary-hover: #0e7a65;
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
