/**
 * @jest-environment node
 */
import { jest } from "@jest/globals"
import LinTO from "../index.js"

function makeFetchMock(handlers) {
  const captured = []
  const mock = jest.fn(async (req) => {
    captured.push({
      url: req.url,
      method: req.method,
      auth: req.headers.get("authorization"),
    })
    for (const h of handlers) {
      if (h.match(req)) {
        if (typeof h.respond === "function") {
          return await h.respond(req)
        }
        const payload =
          typeof h.payload === "function" ? await h.payload(req) : h.payload
        const status = h.status ?? 200
        return new Response(JSON.stringify(payload), {
          status,
          headers: { "Content-Type": "application/json" },
        })
      }
    }
    return new Response(JSON.stringify({ error: "unmatched", url: req.url }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  })
  return { mock, captured }
}

function binaryResponse(bytes, contentType = "application/octet-stream") {
  return new Response(bytes, {
    status: 200,
    headers: { "Content-Type": contentType },
  })
}

describe("LinTO Exports / Download — high-level wrappers (mocked apiService)", () => {
  let linto

  beforeEach(() => {
    linto = new LinTO({ authToken: "tok-1" })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("getExportList() delegates to apiService.getExportList with conversationId", async () => {
    linto.apiService.getExportList = jest.fn(async () => [
      { _id: "job-1", state: "done" },
    ])
    const res = await linto.getExportList("conv-1")
    expect(linto.apiService.getExportList).toHaveBeenCalledWith({
      conversationId: "conv-1",
    })
    expect(res).toEqual([{ _id: "job-1", state: "done" }])
  })

  test("getExportContent() delegates to apiService.getExportContent with conversationId and jobId", async () => {
    linto.apiService.getExportContent = jest.fn(async () => ({ text: "hi" }))
    const res = await linto.getExportContent("conv-1", "job-1")
    expect(linto.apiService.getExportContent).toHaveBeenCalledWith({
      conversationId: "conv-1",
      jobId: "job-1",
    })
    expect(res).toEqual({ text: "hi" })
  })

  test("downloadConversation() defaults format to 'docx'", async () => {
    linto.apiService.downloadConversation = jest.fn(async () => new ArrayBuffer(8))
    await linto.downloadConversation("conv-1")
    expect(linto.apiService.downloadConversation).toHaveBeenCalledWith({
      conversationId: "conv-1",
      format: "docx",
    })
  })

  test("downloadConversation() forwards custom format", async () => {
    linto.apiService.downloadConversation = jest.fn(async () => ({ ok: true }))
    await linto.downloadConversation("conv-2", { format: "json" })
    expect(linto.apiService.downloadConversation).toHaveBeenCalledWith({
      conversationId: "conv-2",
      format: "json",
    })
  })

  test("getPublicationTemplates() delegates to apiService.getPublicationTemplates", async () => {
    linto.apiService.getPublicationTemplates = jest.fn(async () => [
      { _id: "tpl-1", name: "Default" },
    ])
    const res = await linto.getPublicationTemplates()
    expect(linto.apiService.getPublicationTemplates).toHaveBeenCalledTimes(1)
    expect(res).toEqual([{ _id: "tpl-1", name: "Default" }])
  })

  test("getTemplatePlaceholders() forwards templateId", async () => {
    linto.apiService.getTemplatePlaceholders = jest.fn(async () => [
      { key: "title" },
    ])
    const res = await linto.getTemplatePlaceholders("tpl-1")
    expect(linto.apiService.getTemplatePlaceholders).toHaveBeenCalledWith({
      templateId: "tpl-1",
    })
    expect(res).toEqual([{ key: "title" }])
  })

  test("exportWithTemplate() defaults format to 'pdf', leaves templateId/versionNumber undefined", async () => {
    linto.apiService.exportWithTemplate = jest.fn(async () => new ArrayBuffer(4))
    await linto.exportWithTemplate("job-1")
    expect(linto.apiService.exportWithTemplate).toHaveBeenCalledWith({
      jobId: "job-1",
      format: "pdf",
      templateId: undefined,
      versionNumber: undefined,
    })
  })

  test("exportWithTemplate() forwards format, templateId, versionNumber when provided", async () => {
    linto.apiService.exportWithTemplate = jest.fn(async () => new ArrayBuffer(4))
    await linto.exportWithTemplate("job-1", {
      format: "docx",
      templateId: "tpl-9",
      versionNumber: 2,
    })
    expect(linto.apiService.exportWithTemplate).toHaveBeenCalledWith({
      jobId: "job-1",
      format: "docx",
      templateId: "tpl-9",
      versionNumber: 2,
    })
  })
})

describe("StudioApiService Exports / Download — URL/payload via mocked fetch", () => {
  let originalFetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
    jest.clearAllMocks()
  })

  function makeLinto() {
    return new LinTO({
      authToken: "tok-1",
      baseUrl: "https://example.test",
    })
  }

  test("getExportList GETs /conversations/{id}/export/list and returns array", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" &&
          /\/api\/conversations\/conv-1\/export\/list/.test(req.url),
        payload: [{ _id: "job-1", state: "done" }],
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.getExportList("conv-1")
    expect(res).toEqual([{ _id: "job-1", state: "done" }])
    const call = captured.find((c) =>
      /\/api\/conversations\/conv-1\/export\/list/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.method).toBe("GET")
    expect(call.auth).toBe("Bearer tok-1")
  })

  test("getExportContent GETs /conversations/{id}/export/{jobId}/content", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" &&
          /\/api\/conversations\/conv-1\/export\/job-9\/content/.test(req.url),
        payload: { text: "the content" },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.getExportContent("conv-1", "job-9")
    expect(res).toEqual({ text: "the content" })
    const call = captured.find((c) =>
      /\/api\/conversations\/conv-1\/export\/job-9\/content/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.method).toBe("GET")
  })

  test("downloadConversation POSTs /conversations/{id}/download?format=... with binary body for docx", async () => {
    const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04]) // ZIP/docx magic
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "POST" &&
          /\/api\/conversations\/conv-1\/download\?format=docx/.test(req.url),
        respond: async () => binaryResponse(bytes),
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.downloadConversation("conv-1", { format: "docx" })
    const call = captured.find((c) =>
      /\/api\/conversations\/conv-1\/download\?format=docx/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.method).toBe("POST")
    expect(call.auth).toBe("Bearer tok-1")
    // In Node env we should get an ArrayBuffer back for binary formats.
    expect(res).toBeInstanceOf(ArrayBuffer)
    expect(new Uint8Array(res)).toEqual(bytes)
  })

  test("downloadConversation with json format returns JSON (not binary)", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "POST" &&
          /\/api\/conversations\/conv-2\/download\?format=json/.test(req.url),
        payload: { transcript: "hello world" },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.downloadConversation("conv-2", { format: "json" })
    expect(res).toEqual({ transcript: "hello world" })
    const call = captured.find((c) =>
      /\/api\/conversations\/conv-2\/download\?format=json/.test(c.url)
    )
    expect(call.method).toBe("POST")
  })

  test("getPublicationTemplates GETs /publication/templates?organization_id=... and returns array", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" && /\/api\/organizations(\?|$)/.test(req.url),
        payload: [{ _id: "org-1" }],
      },
      {
        match: (req) =>
          req.method === "GET" &&
          /\/api\/publication\/templates\?organization_id=org-1/.test(req.url),
        payload: [{ _id: "tpl-1", name: "Default" }],
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.getPublicationTemplates()
    expect(res).toEqual([{ _id: "tpl-1", name: "Default" }])
    const call = captured.find((c) =>
      /\/api\/publication\/templates\?organization_id=org-1/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.method).toBe("GET")
    expect(call.auth).toBe("Bearer tok-1")
  })

  test("getTemplatePlaceholders GETs /publication/templates/{templateId}/placeholders", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" &&
          /\/api\/publication\/templates\/tpl-7\/placeholders/.test(req.url),
        payload: [{ key: "title" }, { key: "speaker" }],
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.getTemplatePlaceholders("tpl-7")
    expect(res).toEqual([{ key: "title" }, { key: "speaker" }])
    const call = captured.find((c) =>
      /\/api\/publication\/templates\/tpl-7\/placeholders/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.method).toBe("GET")
  })

  test("exportWithTemplate GETs /publication/{jobId}/export/{format} WITHOUT templateId/versionNumber when undefined", async () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]) // %PDF
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" &&
          /\/api\/publication\/job-1\/export\/pdf/.test(req.url),
        respond: async () => binaryResponse(bytes, "application/pdf"),
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.exportWithTemplate("job-1")
    const call = captured.find((c) =>
      /\/api\/publication\/job-1\/export\/pdf/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.method).toBe("GET")
    expect(call.url).not.toMatch(/templateId=/)
    expect(call.url).not.toMatch(/versionNumber=/)
    expect(res).toBeInstanceOf(ArrayBuffer)
    expect(new Uint8Array(res)).toEqual(bytes)
  })

  test("exportWithTemplate includes templateId in query only when provided", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" &&
          /\/api\/publication\/job-2\/export\/docx/.test(req.url),
        respond: async () => binaryResponse(new Uint8Array([1, 2, 3])),
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.exportWithTemplate("job-2", {
      format: "docx",
      templateId: "tpl-42",
    })
    const call = captured.find((c) =>
      /\/api\/publication\/job-2\/export\/docx/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.url).toMatch(/templateId=tpl-42/)
    expect(call.url).not.toMatch(/versionNumber=/)
  })

  test("exportWithTemplate includes versionNumber in query only when provided", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" &&
          /\/api\/publication\/job-3\/export\/pdf/.test(req.url),
        respond: async () => binaryResponse(new Uint8Array([9])),
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.exportWithTemplate("job-3", {
      format: "pdf",
      templateId: "tpl-1",
      versionNumber: 5,
    })
    const call = captured.find((c) =>
      /\/api\/publication\/job-3\/export\/pdf/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.url).toMatch(/templateId=tpl-1/)
    expect(call.url).toMatch(/versionNumber=5/)
  })

  test("exportWithTemplate propagates format into URL path", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" &&
          /\/api\/publication\/job-4\/export\/odt/.test(req.url),
        respond: async () => binaryResponse(new Uint8Array([7, 7])),
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.exportWithTemplate("job-4", { format: "odt" })
    const call = captured.find((c) =>
      /\/api\/publication\/job-4\/export\/odt/.test(c.url)
    )
    expect(call).toBeDefined()
    // Path-only (no template/version) -> no query other than the t= cache buster.
    expect(call.url).not.toMatch(/templateId=/)
    expect(call.url).not.toMatch(/versionNumber=/)
  })
})
