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

import USER_RIGHTS from "@/const/userRights.js"

import { apiGetConversationAsDoc } from "@/api/conversation.d/apiGetConversationAsDoc.js"
import {
  apiGetConversationById,
  apiGetConversationLastUpdate,
  apiGetUserRightFromConversation,
} from "@/api/conversation"

import {
  createTranscriptionEditorPlugin,
  createAudioPlugin,
  mapApiTurns,
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
    this.$apiEventWS.leaveEditorRoom()
  },
  methods: {
    async initEditor(doc) {
      const el = this.$refs.editor
      // Torn down during the async mount: the custom element is gone, so there
      // is nothing to wire up (and destructuring `el` would throw).
      if (this.isDestroyed || !el) return
      const { core } = el
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

      // Lock+save editor: mutations go through the shared socket.io
      // connection (see "Editor v2" design); the room is joined below.
      core.use(
        createTranscriptionEditorPlugin({
          saveTurn: (payload) => this.$apiEventWS.saveEditorTurn(payload),
        }),
      )
      const mode = this.canWrite ? "edit" : "view"
      core.capabilities.value = { text: mode, speakers: mode }
      this.$apiEventWS.joinEditorRoom(this.conversationId)

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

      // The REST skeleton carries no content: turns and speakers are loaded
      // per translation, lazily — now for the active one, then on every
      // track/channel switch.
      this.attachTranslationLoader()
      this.loadActiveTranslation()
    },

    // A translation's content is its child conversation's text+speakers.
    // Already-loaded tracks are kept as-is (turns present = trivial cache).
    async loadActiveTranslation() {
      const channel = this.core?.activeChannel?.value
      if (!channel) return
      const translation = channel.translations.get(
        channel.activeTranslation.value.id,
      )
      if (!translation || translation.turns.value.length > 0) return

      channel.isLoadingHistory.value = true
      try {
        const conv = await apiGetConversationById(
          translation.id,
          ["text", "speakers"].toString(),
        )
        if (this.isDestroyed || !conv) return
        for (const s of conv.speakers ?? []) {
          this.core.speakers.ensure(s.speaker_id, s.speaker_name)
        }
        translation.setTurns(mapApiTurns(conv.text ?? []))
        // Whole content arrives in one fetch: mark the history complete so
        // the panel shows its "beginning of transcription" boundary.
        channel.hasMoreHistory.value = false
      } catch (err) {
        console.error("[host] failed to load translation content", err)
      } finally {
        channel.isLoadingHistory.value = false
      }
    },

    attachTranslationLoader() {
      const load = () => this.loadActiveTranslation()
      this.editListeners.push(
        this.core.on("translation:change", load),
        this.core.on("channel:change", load),
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
