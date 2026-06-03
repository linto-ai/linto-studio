<template>
  <LayoutV2 noHeader>
    <div class="transcription-editor-wrapper">
      <linto-editor ref="editor" :locale="$i18n.locale" />
      <Loading
        v-if="loading"
        background
        :title="$t('conversation.loading.conversation_data')" />
    </div>
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
import { userName } from "@/tools/userName"
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
import Loading from "@/components/atoms/Loading.vue"
import { apiGetAudioFileFromConversation } from "@/api/conversation"

const COLLAB_SYNC_TIMEOUT_MS = 20000
const COLLAB_SYNC_POLL_MS = 80

export default {
  components: { LayoutV2, PublicationModal, Loading },
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
      canWrite: false,
      loading: true,
      publicationModal: { open: false, jobId: null },
    }
  },
  async mounted() {
    const { doc, organizationId, securityLevel, name } =
      await apiGetConversationAsDoc(this.conversationId)
    this.organizationId = organizationId
    this.securityLevel = securityLevel
    this.conversationName = name

    // A failure here must not block the editor: degrade to read-only.
    try {
      const { right } = await apiGetUserRightFromConversation(
        this.conversationId,
      )
      this.canWrite = USER_RIGHTS.hasRightAccess(right, USER_RIGHTS.WRITE)
    } catch (e) {
      console.error("[host] failed to fetch conversation right", e)
      this.canWrite = false
    }

    await this.initEditor(doc)
  },
  beforeDestroy() {
    this.clearSyncWatchers()
    this.editListeners.forEach((fn) => fn?.())
    this.editListeners = []
    this.llmDispose?.()
    this.llmDispose = null
  },
  methods: {
    // Stable cursor color derived from the user id so each collaborator keeps
    // a consistent, distinct color across sessions.
    cursorColor(id) {
      const palette = [
        "#E57373",
        "#64B5F6",
        "#81C784",
        "#FFB74D",
        "#BA68C8",
        "#4DB6AC",
        "#F06292",
        "#A1887F",
      ]
      const str = String(id || "")
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) | 0
      }
      return palette[Math.abs(hash) % palette.length]
    },
    async initEditor(doc) {
      const el = this.$refs.editor
      const { core } = el
      const ws_url = new URL(getEnv("VUE_APP_CONVO_API"))
      ws_url.protocol = ws_url.protocol === "https:" ? "wss:" : "ws:"
      ws_url.pathname = "/ws/editor"
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
            url: ws_url.toString(),
            token: getCookie("authToken"),
          },
          user: {
            name: userName(this.userInfo),
            color: this.cursorColor(this.userInfo._id),
          },
          readOnly: !this.canWrite,
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
      this.waitForCollabSync()
      this.pushTranscriptionLastUpdate()
      this.attachEditListeners()
    },

    // SDK bundles its own Vue runtime, so its `isConnected` ref isn't tracked
    // by a host-side watch; poll it, with a timeout fallback.
    waitForCollabSync() {
      const isSynced = () =>
        !!this.core?.transcriptionEditor?.isConnected?.value
      if (isSynced()) {
        this.loading = false
        return
      }
      this.clearSyncWatchers()
      this.syncPollTimer = setInterval(() => {
        if (isSynced()) {
          this.loading = false
          this.clearSyncWatchers()
        }
      }, COLLAB_SYNC_POLL_MS)
      this.syncTimeoutTimer = setTimeout(() => {
        this.loading = false
        this.clearSyncWatchers()
      }, COLLAB_SYNC_TIMEOUT_MS)
    },

    clearSyncWatchers() {
      if (this.syncPollTimer) {
        clearInterval(this.syncPollTimer)
        this.syncPollTimer = null
      }
      if (this.syncTimeoutTimer) {
        clearTimeout(this.syncTimeoutTimer)
        this.syncTimeoutTimer = null
      }
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
.transcription-editor-wrapper {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

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
