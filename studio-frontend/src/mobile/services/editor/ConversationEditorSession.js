import { markRaw } from "vue"
import USER_RIGHTS from "@/const/userRights.js"
import { apiGetConversationAsDoc } from "@/api/conversation.d/apiGetConversationAsDoc.js"
import {
  apiGetConversationLastUpdate,
  apiGetUserRightFromConversation,
} from "@/api/conversation"
import { apiGetChatStatus } from "@/api/chat"
import { setupLLMServices } from "@/services/llmServicesIntegration"
import { setupChat } from "@/services/chatIntegration"
import { loadEditor } from "@/mobile/services/editor/loadEditor.js"
import {
  buildAudioPlugin,
  buildTranscriptionEditorPlugin,
  buildEditorRoomHandlers,
} from "@/mobile/services/editor/editorPlugins.js"
import {
  loadActiveTranslation,
  refetchTranslation,
} from "@/mobile/services/editor/translationContent.js"
import { VERBATIM_FORMATS } from "@/mobile/const/verbatimFormats.js"

const EDIT_EVENTS = [
  "turn:add",
  "turn:update",
  "turn:remove",
  "speaker:add",
  "speaker:update",
  "speaker:remove",
]

// One open conversation in the editor web component: loads the document,
// wires the plugins on the shared socket, and releases everything in
// destroy(). Mirrors the classic ConversationsTranscription page.
export class ConversationEditorSession {
  constructor({ conversationId, socket, store, i18n }) {
    this.conversationId = conversationId
    this.socket = socket
    this.store = store
    this.i18n = i18n
    this.core = null
    this.destroyed = false
    this.disposers = []
    this.name = ""
  }

  async load() {
    const [module, document] = await Promise.all([
      loadEditor(),
      apiGetConversationAsDoc(this.conversationId),
    ])
    this.module = module
    this.document = document
    this.name = document.name
    this.canWrite = await this.fetchCanWrite()
    return document
  }

  async mount(element) {
    if (this.destroyed || !element) return
    const { createAudioPlugin, createTranscriptionEditorPlugin, mapApiTurns } =
      this.module
    const core = markRaw(element.core)
    this.core = core
    const refetch = (translationId) =>
      refetchTranslation(core, translationId, mapApiTurns)
    core.use(buildAudioPlugin(createAudioPlugin))
    core.use(
      buildTranscriptionEditorPlugin(
        createTranscriptionEditorPlugin,
        this.socket,
        refetch,
      ),
    )
    const mode = this.canWrite ? "edit" : "view"
    core.capabilities.value = { text: mode, speakers: mode }
    core.verbatimFormats.value = VERBATIM_FORMATS
    this.socket.joinEditorRoom(
      this.conversationId,
      buildEditorRoomHandlers(core),
    )
    this.disposers.push(this.setupServices(core))
    await this.setupChatIfEnabled(core)
    if (this.destroyed) return
    core.setDocument(this.document.doc)
    this.pushLastUpdate()
    const load = () => loadActiveTranslation(core, mapApiTurns)
    const bump = () => this.markEdited()
    this.disposers.push(
      core.on("translation:change", load),
      core.on("channel:change", load),
    )
    this.disposers.push(...EDIT_EVENTS.map((event) => core.on(event, bump)))
    load()
  }

  destroy() {
    this.destroyed = true
    this.disposers.forEach((dispose) => dispose?.())
    this.disposers = []
    this.socket.leaveEditorRoom()
  }

  async fetchCanWrite() {
    try {
      const { right } = await apiGetUserRightFromConversation(
        this.conversationId,
      )
      return USER_RIGHTS.hasRightAccess(right, USER_RIGHTS.WRITE)
    } catch (error) {
      console.error("cannot fetch conversation right", error)
      return false
    }
  }

  setupServices(core) {
    const { organizationId, securityLevel } = this.document
    return setupLLMServices(core, {
      conversationId: this.conversationId,
      organizationId,
      securityLevel,
      conversationName: this.name,
      apiEventWS: this.socket,
      locale: this.i18n.locale,
      t: (key, params) => this.i18n.t(key, params),
      notify: (type, message) =>
        this.store.dispatch("system/addNotification", { type, message }),
      openPublication: () =>
        this.store.dispatch(
          "system/showInfo",
          this.i18n.t("mobile.conversation.publish_in_studio"),
        ),
    }).dispose
  }

  async setupChatIfEnabled(core) {
    const { enabled } = await apiGetChatStatus().catch(() => ({
      enabled: false,
    }))
    if (this.destroyed || !enabled) return
    this.disposers.push(
      setupChat(core, { conversationId: this.conversationId }),
    )
  }

  async pushLastUpdate() {
    try {
      const res = await apiGetConversationLastUpdate(this.conversationId)
      const timestamp = new Date(res?.last_update).getTime()
      if (Number.isFinite(timestamp)) this.markEdited(timestamp)
    } catch (error) {
      console.error("cannot fetch conversation last update", error)
    }
  }

  markEdited(timestamp) {
    const translation =
      this.core?.activeChannel?.value?.activeTranslation?.value
    translation?.setLastModifiedAt(timestamp ?? Date.now())
  }
}
