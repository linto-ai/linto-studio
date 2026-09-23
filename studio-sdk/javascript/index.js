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
   * @param {Object} [options]
   * @param {string} [options.serviceId] - Only the templates linked to that
   *   LLM Gateway service (id or route).
   * @returns {Promise<Array<Object>>}
   */
  async getPublicationTemplates({ serviceId } = {}) {
    return await this.apiService.getPublicationTemplates({ serviceId })
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
   * @param {Object} options
   * @param {string} options.conversationId - Conversation the job belongs to
   *   (Studio scopes the export by it).
   * @param {string} [options.format="pdf"] - Output format.
   * @param {string} [options.templateId] - Publication template id.
   * @param {number} [options.versionNumber] - Template version.
   * @returns {Promise<*>} Binary content.
   */
  async exportWithTemplate(
    jobId,
    { conversationId, format = "pdf", templateId, versionNumber } = {}
  ) {
    return await this.apiService.exportWithTemplate({
      conversationId,
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

  // ── Live meeting-bot flow (Visio/Meet) ────────────────────────────────────
  // These drive a LIVE quick-meeting bot as the CURRENT USER, so a browser can
  // own the whole flow (create the session, choose translations, launch/stop
  // the bot) with the user's own Studio token — no server-side service account.

  /**
   * List the org's quickMeeting ASR profiles, normalized for a picker.
   * @returns {Promise<Array<{id,name,languages:string[],translations:string[]}>>}
   */
  async listQuickMeetingProfiles({ organizationId } = {}) {
    const profiles = await this.apiService.listTranscriberProfiles({
      organizationId,
      quickMeeting: true,
    })
    return (profiles || []).map((prof) => {
      const config = prof.config || {}
      const languages = (config.languages || [])
        .map((l) => (typeof l === "object" ? l.candidate : l))
        .filter(Boolean)
      const rawTr =
        prof.translations ||
        config.availableTranslations ||
        config.translations ||
        []
      const translations = Array.isArray(rawTr)
        ? rawTr
        : Object.values(rawTr)
            .filter(Array.isArray)
            .flat()
      return {
        id: getId(prof) || prof.id,
        name: prof.name || config.name || "",
        languages,
        translations,
      }
    })
  }

  /**
   * Create a quick-meeting session.
   * @returns the raw session (with `id` and `channels`).
   */
  async createQuickMeeting({ organizationId, channels, meta } = {}) {
    return await this.apiService.createQuickMeeting({
      organizationId,
      channels,
      meta,
    })
  }

  /** Patch a session's fields (e.g. `{ visibility }` or `{ meta }`). */
  async patchSession({ organizationId, sessionId, data } = {}) {
    return await this.apiService.patchSession({
      organizationId,
      sessionId,
      data,
    })
  }

  /** Launch a meeting bot on a channel (provider defaults to "visio"). */
  async startBot({
    organizationId,
    url,
    channelId,
    provider = "visio",
    enableDisplaySub = false,
    subSource = "original",
  } = {}) {
    return await this.apiService.startBot({
      organizationId,
      url,
      channelId,
      provider,
      enableDisplaySub,
      subSource,
    })
  }

  /** Stop a meeting bot by id. */
  async stopBot({ organizationId, botId } = {}) {
    return await this.apiService.stopBot({ organizationId, botId })
  }

  /** Stop (and finalize) a quick-meeting session; `name` names the resulting
   * conversation so it can be resolved afterwards. */
  async stopQuickMeeting({ organizationId, sessionId, name } = {}) {
    return await this.apiService.stopQuickMeeting({
      organizationId,
      sessionId,
      name,
    })
  }

  /**
   * Resolve the conversation finalized for a stopped quick session: match on
   * `type.from_session_id === sessionId`, falling back to an exact `name`.
   * @returns the conversation id, or null.
   */
  async findConversation({ organizationId, name, fromSessionId } = {}) {
    const items = await this.apiService.listConversations({
      organizationId,
      name,
    })
    for (const item of items || []) {
      const type = item.type || {}
      if (type && type.from_session_id === fromSessionId) {
        return getId(item) || item.id
      }
    }
    for (const item of items || []) {
      if (item.name === name) return getId(item) || item.id
    }
    return null
  }

  // ── Live catch-up for late joiners ────────────────────────────────────────
  // A participant who joins while the transcription is already running reads
  // the history through `getPublicSession` and asks studio-api for an LLM
  // summary of it with `catchUp`. Both accept the `publicSessionToken` minted
  // by `getPublicSession` (so an anonymous guest works) or the SDK's own user
  // token when it belongs to an org member.

  /**
   * Fetch a PUBLIC live session: its channels with `closedCaptions` /
   * `translatedCaptions` (the whole history so far) plus the
   * `publicSessionToken` to reuse for the catch-up calls and the live socket.
   * Works without any token — the session must be `visibility: "public"`.
   *
   * @param {string} sessionId
   * @param {Object} [options]
   * @param {string} [options.token] - override the SDK token (rarely needed).
   * @returns {Promise<Object>} the public session body.
   */
  async getPublicSession(sessionId, { token } = {}) {
    return await this.apiService.getPublicSession({ sessionId, token })
  }

  /**
   * Whether the deployment can produce a catch-up summary (an LLM gateway and a
   * catch-up service are configured). Lets a panel hide the block entirely.
   *
   * @param {string} sessionId
   * @param {Object} [options]
   * @param {string} [options.token] - `publicSessionToken`; defaults to the SDK token.
   * @returns {Promise<{enabled: boolean}>}
   */
  async catchUpStatus(sessionId, { token } = {}) {
    return await this.apiService.catchUpStatus({ sessionId, token })
  }

  /**
   * Stream the "what did I miss" summary of everything said BEFORE `before`.
   *
   * The answer is a `text/event-stream` consumed with a `ReadableStream`:
   * every `token` event is appended and handed to `onToken`, and the promise
   * resolves once the `done` event arrives.
   *
   * @param {string} sessionId
   * @param {Object} [options]
   * @param {string} [options.token] - `publicSessionToken`; defaults to the SDK token.
   * @param {string} [options.before] - ISO-8601 join time; captions started
   *   after it are excluded. Omitted = the whole transcript so far.
   * @param {number} [options.channelIndex=0] - channel to summarize.
   * @param {number} [options.maxChars] - cap on the transcript sent to the LLM
   *   (studio-api keeps the LAST characters, dropping the oldest lines).
   * @param {(chunk: string, fullText: string) => void} [options.onToken]
   * @param {AbortSignal} [options.signal] - aborts the underlying fetch.
   * @returns {Promise<{text: string, cached: boolean}>} `cached` is true when
   *   the summary was replayed from studio-api's 60 s cache.
   * @throws {Error} with a typed `err.code`: `catchup_too_short` (nothing to
   *   summarize yet, HTTP 204), `catchup_forbidden` (403),
   *   `catchup_unauthorized` (401), `catchup_rate_limited` (429),
   *   `catchup_unavailable` (503, no LLM configured or gateway down), or
   *   `catchup_error` carrying the gateway message as `err.message`.
   */
  async catchUp(
    sessionId,
    { token, before, channelIndex = 0, maxChars, onToken, signal } = {}
  ) {
    return await this.apiService.catchUp({
      sessionId,
      token,
      before,
      channelIndex,
      maxChars,
      onToken,
      signal,
    })
  }

  /**
   * One-shot orchestration: create the quick-meeting, optionally patch its meta
   * (e.g. inject a native bot join token), make it public, then launch the bot.
   * Returns { sessionId, channelId, botId }.
   *
   * @param {Object} opts
   * @param {string} [opts.organizationId]
   * @param {Object} opts.channel - channel spec (name, transcriberProfileId,
   *   enableLiveTranscripts, diarization, keepAudio, translations).
   * @param {Object} [opts.meta] - session meta (native descriptor).
   * @param {string} opts.botUrl - the room URL the bot navigates to.
   * @param {string} [opts.provider="visio"]
   * @param {boolean} [opts.makePublic=false] - PATCH visibility:"public".
   * @param {boolean} [opts.enableDisplaySub=true] - have the bot show the captions
   *   in the meeting (native visio bot: republish them into the LiveKit room).
   * @param {(sessionId:string, channelId:string) => Promise<Object>} [opts.metaWithToken]
   *   - async hook returning the FULL meta to persist once the channel id is
   *   known (used to add a Meet-minted native join token before the bot starts).
   */
  async launchVisioBot({
    organizationId,
    channel,
    meta,
    botUrl,
    provider = "visio",
    makePublic = false,
    metaWithToken,
    enableDisplaySub = true,
  } = {}) {
    const session = await this.createQuickMeeting({
      organizationId,
      channels: [channel],
      meta,
    })
    const sessionId = getId(session) || session.id
    const channelId = ((session.channels || [])[0] || {}).id
    if (!sessionId || !channelId) {
      throw new Error(
        `quickMeeting response missing ids: ${JSON.stringify(session)}`
      )
    }
    // The org falls back to the first one inside the apiService; reuse the
    // resolved value for the subsequent calls so they hit the same org.
    const org =
      organizationId || (this.apiService.organizations[0] || {})._id

    if (makePublic) {
      try {
        await this.patchSession({
          organizationId: org,
          sessionId,
          data: { visibility: "public" },
        })
      } catch (_) {
        // Best-effort — only affects the public live token, not the bot.
      }
    }
    if (typeof metaWithToken === "function") {
      const fullMeta = await metaWithToken(sessionId, channelId)
      if (fullMeta) {
        await this.patchSession({
          organizationId: org,
          sessionId,
          data: { meta: fullMeta },
        })
      }
    }
    let botId = null
    try {
      const bot = await this.startBot({
        organizationId: org,
        url: botUrl,
        channelId,
        provider,
        // Ask the bot to render the captions INSIDE the meeting: for the native
        // visio bot this is the in-room republish (LiveKit transcription segments)
        // that feeds the Meet overlay/panel, and an explicit `false` opts it out.
        enableDisplaySub,
      })
      botId = getId(bot) || bot.id
    } catch (err) {
      // Roll back the orphan session so Studio is not littered with a bot-less one.
      try {
        await this.stopQuickMeeting({ organizationId: org, sessionId })
      } catch (_) {}
      throw err
    }
    return { sessionId, channelId, botId, organizationId: org }
  }
}

try {
  window.LinTO = LinTO
} catch (error) {}

export default LinTO
