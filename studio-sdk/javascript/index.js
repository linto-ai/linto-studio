import { StudioApiService } from "./src/services/studioApiService.js"
import { PollingService } from "./src/services/pollingService.js"
import { SummaryPollingService } from "./src/services/summaryPollingService.js"
import { getId } from "./src/tools/getId.js"
import { equalsIgnoreCase } from "./src/tools/equalsIgnoreCase.js"

/**
 * High-level client for the LinTO Studio API.
 *
 * Wraps the lower-level {@link StudioApiService} and exposes convenience
 * helpers for transcription, LLM summaries, taxonomy, sharing, and exports.
 */
class LinTO {
  /**
   * @param {Object} options
   * @param {string} options.authToken - LinTO Studio bearer token.
   * @param {string} [options.baseUrl="https://studio.linto.ai/cm-api"] - Base URL of the studio-api gateway.
   */
  constructor({ authToken, baseUrl = "https://studio.linto.ai/cm-api" } = {}) {
    this.baseUrl = baseUrl
    this.apiService = new StudioApiService({
      token: authToken,
      baseUrl,
    })
  }

  /**
   * Upload a media file and start a transcription job.
   *
   * @param {Blob|Buffer|File} file - Media payload to upload.
   * @param {Object} [options]
   * @param {boolean} [options.enableDiarization=true] - Run speaker diarization.
   * @param {string} [options.numberOfSpeaker="0"] - Expected speaker count, "0" = auto.
   * @param {boolean} [options.enablePunctuation=true] - Apply punctuation post-processing.
   * @param {string} [options.language="*"] - BCP-47 language code or "*" for auto-detect.
   * @param {string} [options.quality] - Service quality tier.
   * @param {string} [options.modelType] - ASR model identifier.
   * @param {string} [options.name] - Display name of the resulting conversation.
   * @param {string} [options.serviceName] - Force a specific ASR service.
   * @param {string} [options.endpointAsr] - Override ASR endpoint URL.
   * @param {string} [options.diarizationServiceName] - Force a diarization service.
   * @param {string} [options.punctuationServiceName] - Force a punctuation service.
   * @param {number} [options.membersRight] - Default permission bitmask for organization members on the resulting conversation.
   * @returns {Promise<PollingService>} Polling handle emitting "update", "done", "error".
   */
  async transcribe(
    file,
    {
      enableDiarization = true,
      numberOfSpeaker = "0",
      enablePunctuation = true,
      language = "*",
      quality = null,
      modelType = null,
      name = null,
      serviceName = null,
      endpointAsr = null,
      diarizationServiceName = null,
      punctuationServiceName = null,
      membersRight = null,
    } = {}
  ) {
    const res = await this.apiService.uploadFile({
      file,
      enableDiarization,
      numberOfSpeaker,
      enablePunctuation: enablePunctuation,
      language,
      quality,
      modelType,
      name,
      serviceName,
      endpointAsr,
      diarizationServiceName,
      punctuationServiceName,
      membersRight,
    })
    const mediaId = res.conversationId
    return new PollingService(mediaId, this.apiService)
  }

  /**
   * List ASR (speech-to-text) services available to the current account.
   *
   * @returns {Promise<Array<Object>>} Services with a `service_name` field.
   */
  async listServices() {
    const services = await this.apiService.fetchAsrServices()
    return services.map((service) => {
      const s = { ...service, service_name: service.serviceName }
      delete s.serviceName
      return s
    })
  }

  /**
   * List LLM services available for summarization.
   *
   * @returns {Promise<Array<Object>>}
   */
  async listLlmServices() {
    return await this.apiService.fetchLlmServices()
  }

  /**
   * Trigger an LLM summary and return a polling handle.
   *
   * @param {string} conversationId - Target conversation id.
   * @param {string} serviceRoute - LLM service route (see {@link LinTO#listLlmServices}).
   * @param {Object} [options]
   * @param {string} [options.flavor] - Optional flavor / preset name.
   * @returns {Promise<SummaryPollingService>} Handle emitting "update", "done", "error".
   * @example
   * const services = await linto.listLlmServices()
   * const summary = await linto.summarize(convId, services[0].route, { flavor: "concise" })
   * summary.addEventListener("done", (e) => console.log(e.detail.content))
   */
  async summarize(conversationId, serviceRoute, { flavor } = {}) {
    await this.apiService.triggerSummary({
      conversationId,
      format: serviceRoute,
      flavor,
    })
    return new SummaryPollingService(conversationId, serviceRoute, this.apiService)
  }

  // --- Exports / Download / Publication ---

  /**
   * List existing export jobs for a conversation.
   *
   * @param {string} conversationId
   * @returns {Promise<Array<Object>>}
   */
  async getExportList(conversationId) {
    return await this.apiService.getExportList({ conversationId })
  }

  /**
   * Fetch the content of a finished export job.
   *
   * @param {string} conversationId
   * @param {string} jobId
   * @returns {Promise<*>} Binary content or structured data depending on format.
   */
  async getExportContent(conversationId, jobId) {
    return await this.apiService.getExportContent({ conversationId, jobId })
  }

  /**
   * Download the raw transcription (no LLM step).
   *
   * @param {string} conversationId
   * @param {Object} [options]
   * @param {string} [options.format="docx"] - "docx", "odt", "json", etc.
   * @returns {Promise<*>} Binary content for docx/odt, object for json.
   */
  async downloadConversation(conversationId, { format = "docx" } = {}) {
    return await this.apiService.downloadConversation({
      conversationId,
      format,
    })
  }

  /**
   * List publication templates available on the organization.
   *
   * @returns {Promise<Array<Object>>}
   */
  async getPublicationTemplates() {
    return await this.apiService.getPublicationTemplates()
  }

  /**
   * Get placeholders defined on a publication template.
   *
   * @param {string} templateId
   * @returns {Promise<Array<Object>>}
   */
  async getTemplatePlaceholders(templateId) {
    return await this.apiService.getTemplatePlaceholders({ templateId })
  }

  /**
   * Render a publication template to a downloadable document.
   *
   * @param {string} jobId - Source export job id.
   * @param {Object} [options]
   * @param {string} [options.format="pdf"] - Output format.
   * @param {string} [options.templateId] - Publication template id.
   * @param {number} [options.versionNumber] - Template version.
   * @returns {Promise<*>} Binary content.
   */
  async exportWithTemplate(
    jobId,
    { format = "pdf", templateId, versionNumber } = {}
  ) {
    return await this.apiService.exportWithTemplate({
      jobId,
      format,
      templateId,
      versionNumber,
    })
  }

  // --- Taxonomy: categories, tags, folders ---

  /**
   * List taxonomy categories on the current organization.
   *
   * @returns {Promise<Array<Object>>}
   */
  async listCategories() {
    return await this.apiService.listCategories()
  }

  /**
   * List tags inside a category.
   *
   * @param {string} categoryId
   * @returns {Promise<Array<Object>>}
   */
  async listTags(categoryId) {
    return await this.apiService.listTags({ categoryId })
  }

  /**
   * Create a tag inside a category.
   *
   * @param {string} categoryId
   * @param {string} name
   * @param {Object} [options]
   * @param {string} [options.color]
   * @param {string} [options.emoji]
   * @returns {Promise<Object>} Created tag.
   */
  async createTag(categoryId, name, { color, emoji } = {}) {
    return await this.apiService.createTag({ categoryId, name, color, emoji })
  }

  /**
   * Return the id of tag `name`, creating it if needed.
   *
   * Defaults to the built-in `"tags"` category (whose entries surface as chips
   * on media cards). Falls back to the first available category if the named
   * one is missing. Returns `null` if no category exists at all.
   *
   * @param {string} name - Tag name (case-insensitive lookup).
   * @param {Object} [options]
   * @param {string} [options.categoryName="tags"]
   * @param {string} [options.color]
   * @param {string} [options.emoji]
   * @returns {Promise<string|null>} Tag id, or null on failure.
   * @example
   * const tagId = await linto.ensureTag("important")
   * await linto.addConversationTag(convId, tagId)
   */
  async ensureTag(name, { categoryName = "tags", color, emoji } = {}) {
    const categories = await this.listCategories()
    if (!Array.isArray(categories) || categories.length === 0) return null

    const cat =
      categories.find((c) => equalsIgnoreCase(c?.name, categoryName)) ??
      categories[0]
    const categoryId = getId(cat)
    if (!categoryId) return null

    const tags = await this.listTags(categoryId)
    const existing = Array.isArray(tags)
      ? tags.find((t) => equalsIgnoreCase(t?.name, name))
      : null
    if (existing) return getId(existing)

    const created = await this.createTag(categoryId, name, { color, emoji })
    return getId(created) || null
  }

  /**
   * Append a tag to a conversation, preserving existing tags.
   *
   * @param {string} conversationId
   * @param {string} tagId
   * @returns {Promise<Array<string>|null>} The new tag id list, or null if `tagId` is falsy.
   */
  async addConversationTag(conversationId, tagId) {
    if (!tagId) {
      return null
    }
    const conv = await this.apiService.getConversation({ conversationId })
    let existing = []
    if (conv && typeof conv === "object") {
      const raw = conv.tags ?? []
      if (Array.isArray(raw)) {
        existing = raw.filter((t) => t).map((t) => String(t))
      }
    }
    if (existing.includes(tagId)) {
      return existing
    }
    const newTags = [...existing, tagId]
    await this.apiService.updateConversation({
      conversationId,
      data: { tags: newTags },
    })
    return newTags
  }

  /**
   * List folders on the current organization.
   *
   * @param {Object} [options]
   * @param {boolean} [options.tree=false] - Return nested tree structure.
   * @param {boolean} [options.withConversationCount=false] - Include conversation counts.
   * @returns {Promise<Array<Object>>}
   */
  async listFolders({ tree = false, withConversationCount = false } = {}) {
    return await this.apiService.listFolders({ tree, withConversationCount })
  }

  /**
   * Create a folder.
   *
   * @param {string} name
   * @param {Object} [options]
   * @param {string} [options.parentId] - Parent folder id (root if omitted).
   * @param {string} [options.color]
   * @param {string} [options.emoji]
   * @param {string} [options.visibility="public"] - "public" or "private".
   * @returns {Promise<Object>} Created folder.
   */
  async createFolder(
    name,
    { parentId, color, emoji, visibility = "public" } = {}
  ) {
    return await this.apiService.createFolder({
      name,
      parentId,
      color,
      emoji,
      visibility,
    })
  }

  /**
   * Return folder id for `name`, creating it if missing.
   *
   * Matches on `(name, parentId)` so the same name at different levels stays
   * distinct. With `visibility: "private"`, the service account becomes the
   * owner and moved conversations are hidden from members below MAINTAINER.
   *
   * @param {string} name
   * @param {Object} [options]
   * @param {string} [options.parentId] - Match within this parent (root if omitted).
   * @param {string} [options.visibility="public"]
   * @returns {Promise<string|null>} Folder id, or null on failure.
   */
  async ensureFolder(name, { parentId, visibility = "public" } = {}) {
    const folders = await this.listFolders()
    const existing = Array.isArray(folders)
      ? folders.find(
          (f) =>
            equalsIgnoreCase(f?.name, name) &&
            (f?.parentId ?? null) === (parentId ?? null)
        )
      : null
    if (existing) return getId(existing)

    const created = await this.createFolder(name, { parentId, visibility })
    return getId(created) || null
  }

  /**
   * Move a conversation into a folder.
   *
   * @param {string} folderId
   * @param {string} conversationId
   * @returns {Promise<*>}
   */
  async moveToFolder(folderId, conversationId) {
    return await this.apiService.moveConversationToFolder({
      folderId,
      conversationId,
    })
  }

  // --- Sharing & user management ---

  /**
   * Share a conversation with a user by email.
   *
   * By default LinTO Studio sends a notification email. Pass `notify: false`
   * to suppress it.
   *
   * @param {string} conversationId
   * @param {string} email
   * @param {Object} [options]
   * @param {number} [options.right=1] - Permission level bitmask (1 = read).
   * @param {boolean} [options.notify=true]
   * @returns {Promise<*>}
   */
  async shareConversation(conversationId, email, { right = 1, notify = true } = {}) {
    return await this.apiService.shareConversation({
      conversationId,
      email,
      right,
      notify,
    })
  }

  /**
   * Search users by email or display name.
   *
   * @param {string} search
   * @returns {Promise<Array<Object>>}
   */
  async searchUsers(search) {
    return await this.apiService.searchUsers({ search })
  }

  /**
   * Patch arbitrary conversation fields.
   *
   * @param {string} conversationId
   * @param {Object} data - Fields to update (e.g. `owner`, `sharedWithUsers`, `tags`).
   * @returns {Promise<*>}
   */
  async updateConversation(conversationId, data) {
    return await this.apiService.updateConversation({ conversationId, data })
  }

  /**
   * Transfer conversation ownership to the user matching `email`.
   *
   * Resolves the user via {@link LinTO#searchUsers}, then sets `owner` and
   * clears `sharedWithUsers`. Returns the resolved user id, or `null` if the
   * email cannot be matched.
   *
   * @param {string} conversationId
   * @param {string} email
   * @returns {Promise<string|null>}
   * @example
   * const userId = await linto.setConversationOwner(convId, "alice@example.com")
   * if (!userId) console.warn("user not found")
   */
  async setConversationOwner(conversationId, email) {
    const users = await this.searchUsers(email)
    const user = Array.isArray(users)
      ? users.find((u) => equalsIgnoreCase(u?.email, email))
      : null
    const userId = getId(user)
    if (!userId) return null

    await this.updateConversation(conversationId, {
      owner: userId,
      sharedWithUsers: [],
    })
    return userId
  }
}

try {
  window.LinTO = LinTO
} catch (error) {}

export default LinTO
