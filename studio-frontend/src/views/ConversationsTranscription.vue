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
import USER_RIGHTS from "@/const/userRights.js"

import { apiGetConversationAsDoc } from "@/api/conversation.d/apiGetConversationAsDoc.js"
import {
  apiGetConversationLastUpdate,
  apiGetUserRightFromConversation,
} from "@/api/conversation"

import {
  createTranscriptionEditorPlugin,
  createAudioPlugin,
} from "@linto/transcript-ui/webcomponent"

import { setupLLMServices } from "@/services/llmServicesIntegration"

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
      organizationId: null,
      securityLevel: null,
      conversationName: "",
      core: null,
      llmDispose: null,
      editListeners: [],
      readOnlyWatcher: null,
      canWrite: false,
      publicationModal: { open: false, jobId: null },
    }
  },
  async mounted() {
    const { doc, organizationId, securityLevel, name } =
      await apiGetConversationAsDoc(this.conversationId)
    this.organizationId = organizationId
    this.securityLevel = securityLevel
    this.conversationName = name

    const { right } = await apiGetUserRightFromConversation(this.conversationId)
    this.canWrite = USER_RIGHTS.hasRightAccess(right, USER_RIGHTS.WRITE)

    await this.initEditor(doc)
  },
  beforeDestroy() {
    this.editListeners.forEach((fn) => fn?.())
    this.editListeners = []
    this.readOnlyWatcher?.()
    this.readOnlyWatcher = null
    this.llmDispose?.()
    this.llmDispose = null
  },
  methods: {
    async initEditor(doc) {
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
        organizationId: this.organizationId,
        securityLevel: this.securityLevel,
        conversationName: this.conversationName,
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
      if (!this.canWrite) {
        this.enforceReadOnly()
      }
      this.pushTranscriptionLastUpdate()
      this.attachEditListeners()
    },

    // Read-only users still connect to the collaborative session (to receive
    // live edits) but must not be able to modify the transcription. The server
    // also rejects their edits; this keeps the UI consistent.
    enforceReadOnly() {
      const api = this.core?.transcriptionEditor
      if (!api) return
      const disable = (editor) => editor?.setEditable(false)
      disable(api.tiptapEditor.value)
      // The tiptap instance is (re)created once the collab provider connects.
      this.readOnlyWatcher = this.$watch(
        () => api.tiptapEditor.value,
        (editor) => disable(editor),
      )
    },

    async pushTranscriptionLastUpdate() {
      try {
        const res = await apiGetConversationLastUpdate(this.conversationId)
        const lastUpdate = res?.last_update
        if (!lastUpdate) return
        const ts = new Date(lastUpdate).getTime()
        if (!Number.isFinite(ts)) return
        this.markTranscriptionEdited(ts)
      } catch (e) {
        console.error("[host] failed to fetch conversation last update", e)
      }
    },

    // Pushes a "last modified" timestamp to the active translation so the
    // SDK can drive the "compte rendu obsolète" status. Triggered by:
    //   - initial fetch (server-side timestamp at mount)
    //   - every local edit event (turn:* / speaker:*)
    markTranscriptionEdited(ts) {
      const translation =
        this.core?.activeChannel?.value?.activeTranslation?.value
      translation?.setLastModifiedAt(ts ?? Date.now())
    },

    attachEditListeners() {
      const core = this.core
      if (!core) return
      const bump = () => this.markTranscriptionEdited()
      this.editListeners = [
        core.on("turn:add", bump),
        core.on("turn:update", bump),
        core.on("turn:remove", bump),
        core.on("speaker:add", bump),
        core.on("speaker:update", bump),
        core.on("speaker:remove", bump),
      ]
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
