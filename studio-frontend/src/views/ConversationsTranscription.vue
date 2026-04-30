<template>
  <LayoutV2 noHeader>
    <linto-editor ref="editor" :locale="$i18n.locale" />
    <PublicationModal
      v-model="publicationModal.open"
      :jobId="publicationModal.jobId"
      :organizationId="organizationId"
      :conversationName="conversationName" />
  </LayoutV2>
</template>
<script>
import { markRaw } from "vue"

import { getCookie } from "@/tools/getCookie"
import { getEnv } from "@/tools/getEnv"

import { apiGetConversationAsDoc } from "@/api/conversation.d/apiGetConversationAsDoc.js"

import {
  createTranscriptionEditorPlugin,
  createAudioPlugin,
} from "@linto/transcript-ui/webcomponent"

import { setupLLMServices } from "@/services/llmServicesIntegration.js"

import LayoutV2 from "@/layouts/v2-layout.vue"
import PublicationModal from "@/components/molecules/PublicationModal.vue"
import { apiGetAudioFileFromConversation } from "@/api/conversation"

export default {
  components: { LayoutV2, PublicationModal },
  props: {
    userInfo: { type: Object, required: true },
  },
  data() {
    return {
      conversationId: this.$route.params.conversationId,
      core: null,
      llmDispose: null,
      organizationId: null,
      conversationName: "",
      publicationModal: { open: false, jobId: null },
    }
  },
  async mounted() {
    const { doc, organizationId, securityLevel, name } =
      await apiGetConversationAsDoc(this.conversationId)
    this.organizationId = organizationId
    this.conversationName = name
    await this.initEditor(doc, { organizationId, securityLevel, name })
  },
  beforeDestroy() {
    this.llmDispose?.()
    this.llmDispose = null
  },
  methods: {
    async initEditor(doc, meta) {
      const el = this.$refs.editor
      const { core } = el
      const ws_url = new URL(getEnv("VUE_APP_CONVO_API"))
      ws_url.protocol = "ws"
      this.core = markRaw(core)
      core.use(
        createAudioPlugin({
          resolveSrc: async (source) => {
            const res = await apiGetAudioFileFromConversation(source.src, false)
            if (res?.status !== "success" || !res.data || res.data.size === 0) {
              throw new Error("Audio unavailable")
            }
            return URL.createObjectURL(res.data)
          },
        }),
      )

      core.use(
        createTranscriptionEditorPlugin({
          collab: {
            url: `ws://localhost:8001/ws/editor`,
            token: getCookie("authToken"),
          },
          user: { name: "test", color: "#E57373" },
        }),
      )

      this.llmDispose = setupLLMServices(core, {
        conversationId: this.conversationId,
        organizationId: meta.organizationId,
        securityLevel: meta.securityLevel,
        conversationName: meta.name,
        apiEventWS: this.$apiEventWS,
        locale: this.$i18n.locale,
        t: (key, params) => this.$t(key, params),
        notify: (type, message) =>
          this.$store.dispatch("system/addNotification", { type, message }),
        openPublication: ({ jobId }) => {
          this.publicationModal = { open: true, jobId }
        },
      })

      core.setDocument(doc)
    },
  },
}
</script>

<style scoped>
linto-editor {
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
