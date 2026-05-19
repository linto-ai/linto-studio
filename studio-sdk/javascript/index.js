import { StudioApiService } from "./src/services/studioApiService.js"
import { PollingService } from "./src/services/pollingService.js"
import { SummaryPollingService } from "./src/services/summaryPollingService.js"
class LinTO {
  constructor({ authToken, baseUrl = "https://studio.linto.ai/cm-api" } = {}) {
    this.baseUrl = baseUrl
    this.apiService = new StudioApiService({
      token: authToken,
      baseUrl,
    })
  }

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
    })
    const mediaId = res.conversationId
    return new PollingService(mediaId, this.apiService)
  }

  async listServices() {
    const services = await this.apiService.fetchAsrServices()
    return services.map((service) => {
      const s = { ...service, service_name: service.serviceName }
      delete s.serviceName
      return s
    })
  }

  async listLlmServices() {
    return await this.apiService.fetchLlmServices()
  }

  async summarize(conversationId, serviceRoute, { flavor } = {}) {
    await this.apiService.triggerSummary({
      conversationId,
      format: serviceRoute,
      flavor,
    })
    return new SummaryPollingService(conversationId, serviceRoute, this.apiService)
  }

  // --- Exports / Download / Publication ---

  async getExportList(conversationId) {
    return await this.apiService.getExportList({ conversationId })
  }

  async getExportContent(conversationId, jobId) {
    return await this.apiService.getExportContent({ conversationId, jobId })
  }

  async downloadConversation(conversationId, { format = "docx" } = {}) {
    return await this.apiService.downloadConversation({
      conversationId,
      format,
    })
  }

  async getPublicationTemplates() {
    return await this.apiService.getPublicationTemplates()
  }

  async getTemplatePlaceholders(templateId) {
    return await this.apiService.getTemplatePlaceholders({ templateId })
  }

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

  async listCategories() {
    return await this.apiService.listCategories()
  }

  async listTags(categoryId) {
    return await this.apiService.listTags({ categoryId })
  }

  async createTag(categoryId, name, { color, emoji } = {}) {
    return await this.apiService.createTag({ categoryId, name, color, emoji })
  }

  async ensureTag(name, { categoryName = "tags", color, emoji } = {}) {
    const categories = await this.listCategories()
    if (!Array.isArray(categories) || categories.length === 0) {
      return null
    }

    let cat = null
    for (const c of categories) {
      if (
        String(c?.name ?? "").toLowerCase() === String(categoryName).toLowerCase()
      ) {
        cat = c
        break
      }
    }
    if (cat === null) {
      cat = categories[0]
    }
    const categoryId = String(cat?._id ?? cat?.id ?? "")
    if (!categoryId) {
      return null
    }

    const tags = await this.listTags(categoryId)
    if (Array.isArray(tags)) {
      for (const t of tags) {
        if (String(t?.name ?? "").toLowerCase() === String(name).toLowerCase()) {
          return String(t?._id ?? t?.id ?? "")
        }
      }
    }

    const created = await this.createTag(categoryId, name, { color, emoji })
    if (created && typeof created === "object") {
      return String(created._id ?? created.id ?? "") || null
    }
    return null
  }

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

  async listFolders({ tree = false, withConversationCount = false } = {}) {
    return await this.apiService.listFolders({ tree, withConversationCount })
  }

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

  async ensureFolder(name, { parentId, visibility = "public" } = {}) {
    const folders = await this.listFolders()
    if (Array.isArray(folders)) {
      for (const f of folders) {
        const folderParent = f?.parentId ?? null
        const targetParent = parentId ?? null
        if (
          String(f?.name ?? "").toLowerCase() === String(name).toLowerCase() &&
          folderParent === targetParent
        ) {
          return String(f?._id ?? f?.id ?? "")
        }
      }
    }

    const created = await this.createFolder(name, { parentId, visibility })
    if (created && typeof created === "object") {
      return String(created._id ?? created.id ?? "") || null
    }
    return null
  }

  async moveToFolder(folderId, conversationId) {
    return await this.apiService.moveConversationToFolder({
      folderId,
      conversationId,
    })
  }

  // --- Sharing & user management ---

  async shareConversation(conversationId, email, { right = 1, notify = true } = {}) {
    return await this.apiService.shareConversation({
      conversationId,
      email,
      right,
      notify,
    })
  }

  async searchUsers(search) {
    return await this.apiService.searchUsers({ search })
  }

  async updateConversation(conversationId, data) {
    return await this.apiService.updateConversation({ conversationId, data })
  }

  async setConversationOwner(conversationId, email) {
    const users = await this.searchUsers(email)
    if (!users || !Array.isArray(users) || users.length === 0) {
      return null
    }

    let userId = null
    const target = String(email).toLowerCase()
    for (const u of users) {
      if (String(u?.email ?? "").toLowerCase() === target) {
        userId = String(u?._id ?? "")
        break
      }
    }

    if (!userId) {
      return null
    }

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
