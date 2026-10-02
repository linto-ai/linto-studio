import { markRaw } from "vue"
import USER_RIGHTS from "@/const/userRights.js"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"
import { apiGetConversationAsDoc } from "@/api/conversation.d/apiGetConversationAsDoc.js"
import { apiGetUserRightFromConversation } from "@/api/conversation"
import { ChannelAssistants } from "@/services/assistantsIntegration/ChannelAssistants.js"
import { loadSourceLastUpdate } from "@/services/editorIntegration/loadSourceLastUpdate.js"
import { loadEditor } from "@/mobile/services/editor/loadEditor.js"
import { readBrandColor } from "@/tools/readBrandColor"
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

// One open conversation in the editor web component: loads the document,
// wires the plugins on the shared socket, and releases everything in
// destroy(). Mirrors the classic ConversationsTranscription page.
export class ConversationEditorSession {
  constructor({ conversationId, socket, store, i18n, openPublication }) {
    this.conversationId = conversationId
    this.socket = socket
    this.store = store
    this.i18n = i18n
    // Called when "Download" is pressed on a report
    this.openPublication = openPublication
    this.core = null
    this.assistants = null
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
    // The editor's theme tokens can't be overridden from outside the web
    // component: the brand colour is pushed (no theme switch here)
    core.primaryColor.value = readBrandColor("--m-primary") || null
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
      buildEditorRoomHandlers(core, () => this.loadActiveSourceLastUpdate()),
    )
    this.setupServices(core)
    await this.assistants.enableChatIfAvailable()
    if (this.destroyed) return
    core.setDocument(this.document.doc)
    this.loadActiveSourceLastUpdate()
    const load = () => loadActiveTranslation(core, mapApiTurns)
    this.disposers.push(
      core.on("translation:change", load),
      core.on("channel:change", load),
      core.on("channel:change", () => this.loadActiveSourceLastUpdate()),
    )
    load()
  }

  destroy() {
    this.destroyed = true
    this.assistants?.destroy()
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

  // Starts on the first channel of the document, then follows the active one.
  setupServices(core) {
    const { doc, organizationId, securityLevel } = this.document
    this.assistants = new ChannelAssistants(core, {
      conversationId: doc.channels[0].id,
      organizationId,
      securityLevel,
      conversationName: this.name,
      apiEventWS: this.socket,
      locale: this.i18n.locale,
      t: (key, params) => this.i18n.t(key, params),
      notify: (type, message) =>
        this.store.dispatch("system/addNotification", { type, message }),
      openPublication: (request) => this.openPublication?.(request),
      isOrganizationAdmin: () =>
        this.store.getters["organizations/getUserRoleInOrganization"] ===
        ORGANIZATION_ROLES.ADMINISTRATOR,
      openUpgradeModal: (refusal) =>
        this.store.dispatch("billing/openUpgradeModal", refusal),
    })
  }

  // Reports are generated from the channel conversation (its source track):
  // seed the timestamp they are compared against. Later modifications come
  // with the editor broadcasts.
  loadActiveSourceLastUpdate() {
    loadSourceLastUpdate(this.core?.activeChannel?.value)
  }
}
