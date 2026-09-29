/**
 * SaaS plan rules on the other two routes that turn an AI report into a file:
 * POST /conversations/:id/download (format = AI service) and
 * POST /conversations/:id/export/:jobId/document.
 */

const mockAxios = { get: jest.fn() }
jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)

const mockSaas = {
  enabled: jest.fn(),
  enforce: jest.fn(),
  allowed: jest.fn(),
  record: jest.fn(),
}
jest.mock(`${process.cwd()}/lib/saas`, () => mockSaas)

const mockModel = {
  conversations: { getById: jest.fn() },
  conversationExport: { getByConvAndFormat: jest.fn(), update: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const mockLlm = { exportJobDocument: jest.fn() }
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/llm/index`,
  () => mockLlm,
)
const mockDocx = { generateDocxOnFormat: jest.fn() }
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/export/docx`,
  () => mockDocx,
)
jest.mock(`${process.cwd()}/components/WebServer/controllers/llm/llm_ws`, () => ({}))
jest.mock(`${process.cwd()}/lib/logger/logger.js`, () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

const { SaasFeatureLocked } = require(
  `${process.cwd()}/components/WebServer/error/exception/saas`,
)
const { FOOTER_NOTE } = require(
  `${process.cwd()}/components/WebServer/controllers/publication/exportPolicy`,
)
const { exportConversation, generateExportDocument } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`,
)

const ORG = "64b7f0c2a1b2c3d4e5f60718"
const USER = "user-1"
const LOCKED = { pdf_lock: "true", pdf_footer_note: FOOTER_NOTE }

function freePlan() {
  mockSaas.enabled.mockReturnValue(true)
  mockSaas.allowed.mockResolvedValue(false)
  mockSaas.enforce.mockImplementation(async ({ capability }) => {
    throw new SaasFeatureLocked("locked", { capability })
  })
}

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    setHeader: jest.fn(),
    sendFile: jest.fn(),
  }
}

// Wait for the fire-and-forget branches of exportConversation
const flush = () => new Promise((resolve) => setImmediate(resolve))

beforeEach(() => {
  jest.clearAllMocks()
  process.env.LLM_GATEWAY_SERVICES = "http://gateway"
  mockModel.conversations.getById.mockResolvedValue([
    {
      _id: { toString: () => "conv-1" },
      name: "Réunion",
      speakers: [],
      text: [],
      organization: { organizationId: { toString: () => ORG } },
    },
  ])
  mockModel.conversationExport.getByConvAndFormat.mockResolvedValue([
    { status: "done", jobId: "job-1", data: "legacy local content" },
  ])
})

describe("POST /conversations/:id/download on a finished AI report", () => {
  const request = (query) => ({
    params: { conversationId: "conv-1" },
    query: { format: "summary", ...query },
    payload: { data: { userId: USER } },
  })

  test("free preview: the gateway PDF is locked and marked", async () => {
    freePlan()
    mockLlm.exportJobDocument.mockResolvedValue(Buffer.from("%PDF"))
    const next = jest.fn()
    await exportConversation(request({ preview: "true" }), mockRes(), next)
    expect(next).not.toHaveBeenCalled()
    expect(mockLlm.exportJobDocument).toHaveBeenCalledWith(
      "job-1",
      "pdf",
      null,
      null,
      LOCKED,
    )
  })

  test("free DOCX and ODT are refused", async () => {
    freePlan()
    for (const exportFormat of ["docx", "odt"]) {
      const next = jest.fn()
      await exportConversation(request({ exportFormat }), mockRes(), next)
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ status: 403, capability: "publication.docx_export" }),
      )
    }
    expect(mockLlm.exportJobDocument).not.toHaveBeenCalled()
    expect(mockDocx.generateDocxOnFormat).not.toHaveBeenCalled()
  })

  test("free PDF with the gateway down: no unlocked local fallback", async () => {
    freePlan()
    mockLlm.exportJobDocument.mockRejectedValue(new Error("connect ECONNREFUSED"))
    const next = jest.fn()
    await exportConversation(request({ exportFormat: "pdf" }), mockRes(), next)
    await flush()
    expect(mockDocx.generateDocxOnFormat).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: expect.any(Number) }))
  })

  test("no SaaS plugin: the local fallback still works", async () => {
    mockSaas.enabled.mockReturnValue(false)
    mockLlm.exportJobDocument.mockRejectedValue(new Error("connect ECONNREFUSED"))
    mockDocx.generateDocxOnFormat.mockResolvedValue({ name: "report", path: "/tmp/report.docx" })
    const res = mockRes()
    await exportConversation(request({ exportFormat: "docx" }), res, jest.fn())
    await flush()
    expect(mockLlm.exportJobDocument).toHaveBeenCalledWith("job-1", "docx", null, null, {})
    expect(mockDocx.generateDocxOnFormat).toHaveBeenCalled()
  })
})

describe("POST /conversations/:id/export/:jobId/document", () => {
  const request = (format, versionNumber) => ({
    params: { conversationId: "conv-1", jobId: "job-1" },
    body: { format, versionNumber },
    payload: { data: { userId: USER } },
  })

  test("free PDF of a version: locked and marked", async () => {
    freePlan()
    mockAxios.get.mockResolvedValue(Buffer.from("%PDF"))
    const next = jest.fn()
    await generateExportDocument(request("pdf", 2), mockRes(), next)
    expect(next).not.toHaveBeenCalled()
    const url = new URL(mockAxios.get.mock.calls[0][0])
    expect(url.pathname).toBe("/api/v1/jobs/job-1/export/pdf")
    expect(url.searchParams.get("version_number")).toBe("2")
    expect(url.searchParams.get("pdf_lock")).toBe("true")
    expect(url.searchParams.get("pdf_footer_note")).toBe(FOOTER_NOTE)
  })

  test("free DOCX: refused before calling the gateway", async () => {
    freePlan()
    const next = jest.fn()
    await generateExportDocument(request("docx"), mockRes(), next)
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 403, code: "SAAS_FEATURE_LOCKED" }),
    )
    expect(mockAxios.get).not.toHaveBeenCalled()
  })
})
