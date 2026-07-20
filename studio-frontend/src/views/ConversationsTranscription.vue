<template>
  <LayoutV2 noHeader>
    <div class="transcription-editor-wrapper">
      <linto-editor ref="editor" :locale="$i18n.locale" />
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
import { setupChat } from "@/services/chatIntegration"
import { apiGetChatStatus } from "@/api/chat"

import LayoutV2 from "@/layouts/v2-layout.vue"
import PublicationModal from "@/components/molecules/PublicationModal.vue"
import {
  apiGetAudioFileFromConversation,
  apiGetAudioWaveFormFromConversation,
} from "@/api/conversation"

// Editor epoch per translation id, read by the collab plugin to build the
// Hocuspocus document name (the epoch identifies the server-side CRDT
// history lineage).
function collectEditorEpochs(doc) {
  const epochs = {}
  for (const channel of doc.channels ?? []) {
    for (const translation of channel.translations ?? []) {
      epochs[translation.id] = translation.editorEpoch ?? 0
    }
  }
  return epochs
}

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
      isDestroyed: false,
      llmDispose: null,
      chatDispose: null,
      editListeners: [],
      canWrite: false,
      publicationModal: { open: false, jobId: null },
      // Mutable map shared with the collab plugin: sessions read it at
      // (re)creation, so refreshing its values + setDocument() is enough to
      // reconnect on a new epoch. markRaw'd via core anyway; keep it plain.
      collabEpochs: {},
      collabReloadInFlight: false,
    }
  },
  async mounted() {
    const { doc, organizationId, securityLevel, name } =
      await apiGetConversationAsDoc(this.conversationId)
    // mounted() is async: the user can navigate away mid-await, in which case
    // beforeDestroy already ran. Bail at every await boundary so we never wire
    // up an editor that is no longer in the DOM (see initEditor).
    if (this.isDestroyed) return
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
    if (this.isDestroyed) return

    await this.initEditor(doc)
  },
  beforeDestroy() {
    this.isDestroyed = true
    this.editListeners.forEach((fn) => fn?.())
    this.editListeners = []
    this.llmDispose?.()
    this.llmDispose = null
    this.chatDispose?.()
    this.chatDispose = null
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
      // Torn down during the async mount: the custom element is gone, so there
      // is nothing to wire up (and destructuring `el` would throw).
      if (this.isDestroyed || !el) return
      const { core } = el
      const ws_url = new URL(getEnv("VUE_APP_CONVO_API"))
      ws_url.protocol = ws_url.protocol === "https:" ? "wss:" : "ws:"
      ws_url.pathname = ws_url.pathname.replace(/\/api$/, "/ws/editor")
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
          resolveWaveform: async (source) => {
            const res = await apiGetAudioWaveFormFromConversation(
              source.src,
              false,
            )
            if (res?.status !== "success" || !Array.isArray(res.data?.data)) {
              return null
            }
            return res.data.data
          },
        }),
      )

      Object.assign(this.collabEpochs, collectEditorEpochs(doc))

      core.use(
        createTranscriptionEditorPlugin({
          collabOptions: {
            url: ws_url.toString(),
            token: getCookie("authToken"),
            epochs: this.collabEpochs,
            onAuthenticationFailed: (reason) => this.onCollabAuthFailed(reason),
          },
          user: {
            name: userName(this.userInfo),
            color: this.cursorColor(this.userInfo._id),
          },
          readOnly: !this.canWrite,
        }),
      )

      // setupLLMServices returns { dispose }; store the disposer so it matches
      // chatDispose (a bare function) and beforeDestroy can call llmDispose().
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
      }).dispose

      // Chat assistant: only wire it when the backend feature is enabled, so
      // the SDK's "ask" button stays disabled otherwise (core.chat absent).
      const { enabled: chatEnabled } = await apiGetChatStatus().catch(() => ({
        enabled: false,
      }))
      // Destroyed during the await: everything below (chat, collab connection,
      // sync timers, edit listeners) is created after beforeDestroy ran, so it
      // would leak. llmDispose was set before the await, so beforeDestroy
      // already disposed it; just stop here.
      if (this.isDestroyed || !this.$refs.editor) return
      if (chatEnabled) {
        this.chatDispose = setupChat(core, {
          conversationId: this.conversationId,
        })
      }

      core.setDocument(doc)
      this.pushTranscriptionLastUpdate()
      this.attachEditListeners()
    },

    // The collab server rejected the connection. The recoverable case is a
    // stale editor epoch (conversation rewritten outside the editor):
    // refetching gives fresh epochs, and reloading the document recreates
    // the sessions on the new lineage. Anything else (expired token, lost
    // access) is not recoverable from here — only log it.
    async onCollabAuthFailed(reason) {
      console.warn("[host] collab authentication failed:", reason)
      if (this.collabReloadInFlight || !this.core) return
      this.collabReloadInFlight = true
      try {
        const { doc } = await apiGetConversationAsDoc(this.conversationId)
        const fresh = collectEditorEpochs(doc)
        const changed = Object.entries(fresh).some(
          ([id, epoch]) => this.collabEpochs[id] !== epoch,
        )
        if (!changed) {
          // Not a stale epoch: the rejection is non-recoverable (invalid
          // document name, lost access, expired token). Surface it in the
          // editor instead of leaving a blank canvas after the load timeout.
          this.core.transcriptionEditor?.setError(reason)
          return
        }
        Object.assign(this.collabEpochs, fresh)
        // The editor re-shows its own loading overlay on setDocument
        // (document:change), which also clears any prior error.
        this.core.setDocument(doc)
      } catch (e) {
        console.error("[host] failed to reload after collab auth failure", e)
        this.core.transcriptionEditor?.setError(reason)
      } finally {
        this.collabReloadInFlight = false
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
