/**
 * SaaS plan rules on publication: custom templates and DOCX export are paid
 * features, a Free organization only gets a locked, marked PDF.
 */

const mockAxios = { get: jest.fn(), post: jest.fn(), delete: jest.fn() }
jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)

const mockSaas = {
  enabled: jest.fn(),
  decide: jest.fn(),
  allowed: jest.fn(),
}
jest.mock(`${process.cwd()}/lib/saas`, () => mockSaas)

const mockModel = { conversations: { getById: jest.fn() } }
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

jest.mock(`${process.cwd()}/lib/logger/logger.js`, () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

const { FOOTER_NOTE, freeExportPlan } = require(
  `${process.cwd()}/tests/utility/saasExportPlan`,
)
const { exportRestrictions } = require(
  `${process.cwd()}/components/WebServer/controllers/publication/exportPolicy`,
)
const {
  getTemplates,
  exportWithTemplate,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
)

const ORG = "64b7f0c2a1b2c3d4e5f60718"
const USER = "user-1"
const LOCKED = { pdf_lock: "true", pdf_footer_note: FOOTER_NOTE }

// Free plan: both publication capabilities are off
function freePlan() {
  freeExportPlan(mockSaas)
  mockSaas.allowed.mockResolvedValue(false)
}

function paidPlan() {
  mockSaas.enabled.mockReturnValue(true)
  mockSaas.allowed.mockResolvedValue(true)
  mockSaas.decide.mockResolvedValue({ allowed: true, pdfFooterNote: null })
}

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    setHeader: jest.fn(),
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.LLM_GATEWAY_SERVICES = "http://gateway"
  mockModel.conversations.getById.mockResolvedValue([
    { _id: "conv-1", organization: { organizationId: { toString: () => ORG } } },
  ])
})

describe("exportRestrictions", () => {
  test("no SaaS plugin: nothing is restricted and the conversation is not read", async () => {
    mockSaas.enabled.mockReturnValue(false)
    for (const format of ["pdf", "docx", "html", "odt"]) {
      await expect(
        exportRestrictions({ conversationId: "conv-1", userId: USER, format }),
      ).resolves.toEqual({})
    }
    expect(mockModel.conversations.getById).not.toHaveBeenCalled()
  })

  test("the plugin decides on the conversation's org, the format and the template", async () => {
    paidPlan()
    await exportRestrictions({
      conversationId: "conv-1",
      userId: USER,
      format: "docx",
      templateScope: "organization",
    })
    expect(mockSaas.decide).toHaveBeenCalledWith("publicationExport", {
      orgId: ORG,
      userId: USER,
      format: "docx",
      templateScope: "organization",
    })
  })

  test("free: a refusal of the plugin goes out as it is", async () => {
    freePlan()
    for (const format of ["docx", "html", "odt"]) {
      await expect(
        exportRestrictions({ conversationId: "conv-1", userId: USER, format }),
      ).rejects.toMatchObject({
        status: 403,
        code: "SAAS_FEATURE_LOCKED",
        capability: "publication.docx_export",
      })
    }
  })

  test("free: the plugin's footer note becomes a locked, marked PDF", async () => {
    freePlan()
    await expect(
      exportRestrictions({ conversationId: "conv-1", userId: USER, format: "pdf" }),
    ).resolves.toEqual(LOCKED)
  })

  test("free: a custom template is refused, a LinTO template is not", async () => {
    freePlan()
    await expect(
      exportRestrictions({
        conversationId: "conv-1",
        userId: USER,
        format: "pdf",
        templateScope: "organization",
      }),
    ).rejects.toMatchObject({ capability: "publication.custom_templates" })
    await expect(
      exportRestrictions({
        conversationId: "conv-1",
        userId: USER,
        format: "pdf",
        templateScope: "system",
      }),
    ).resolves.toEqual(LOCKED)
  })

  test("paid plan: every format, custom templates, unlocked PDF", async () => {
    paidPlan()
    for (const format of ["pdf", "docx", "html"]) {
      await expect(
        exportRestrictions({
          conversationId: "conv-1",
          userId: USER,
          format,
          templateScope: "user",
        }),
      ).resolves.toEqual({})
    }
  })

  test("a conversation without organization is decided without org: the plugin refuses", async () => {
    freePlan()
    mockModel.conversations.getById.mockResolvedValue([{ _id: "conv-1" }])
    await expect(
      exportRestrictions({ conversationId: "conv-1", userId: USER, format: "pdf" }),
    ).rejects.toMatchObject({ status: 403, reason: "no_org" })
    expect(mockSaas.decide.mock.calls[0][1].orgId).toBeNull()
  })
})

describe("getTemplates", () => {
  const TEMPLATES = [
    { id: "t-system", scope: "system" },
    { id: "t-org", scope: "organization" },
    { id: "t-user", scope: "user" },
  ]
  const req = {
    query: {},
    params: { organizationId: ORG },
    payload: { data: { userId: USER } },
  }

  test("off plan, only LinTO templates are listed", async () => {
    freePlan()
    mockAxios.get.mockResolvedValue(TEMPLATES)
    const res = mockRes()
    await getTemplates(req, res, jest.fn())
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      templates: [{ id: "t-system", scope: "system" }],
    })
    expect(mockSaas.allowed).toHaveBeenCalledWith({
      orgId: ORG,
      capability: "publication.custom_templates",
      userId: USER,
    })
  })

  test("on plan, every visible template is listed", async () => {
    paidPlan()
    mockAxios.get.mockResolvedValue(TEMPLATES)
    const res = mockRes()
    await getTemplates(req, res, jest.fn())
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      templates: TEMPLATES,
    })
  })
})

describe("exportWithTemplate", () => {
  const request = (format, query = {}) => ({
    params: { conversationId: "conv-1", jobId: "job-1", format },
    query,
    payload: { data: { userId: USER } },
  })

  test("free PDF: the gateway is asked for a locked, marked PDF", async () => {
    freePlan()
    mockAxios.get.mockResolvedValue(Buffer.from("%PDF"))
    const next = jest.fn()
    await exportWithTemplate(request("pdf"), mockRes(), next)
    expect(next).not.toHaveBeenCalled()
    const url = new URL(mockAxios.get.mock.calls[0][0])
    expect(url.pathname).toBe("/api/v1/jobs/job-1/export/pdf")
    expect(url.searchParams.get("pdf_lock")).toBe("true")
    expect(url.searchParams.get("pdf_footer_note")).toBe(FOOTER_NOTE)
  })

  test("free DOCX: refused before calling the gateway", async () => {
    freePlan()
    const next = jest.fn()
    await exportWithTemplate(request("docx"), mockRes(), next)
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 403, code: "SAAS_FEATURE_LOCKED" }),
    )
    expect(mockAxios.get).not.toHaveBeenCalled()
  })

  test("free with an organization template kept from a paid period: refused", async () => {
    freePlan()
    mockAxios.get.mockResolvedValueOnce({ id: "t-org", scope: "organization" })
    const next = jest.fn()
    await exportWithTemplate(request("pdf", { templateId: "t-org" }), mockRes(), next)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get.mock.calls[0][0]).toBe(
      "http://gateway/api/v1/document-templates/t-org",
    )
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ capability: "publication.custom_templates" }),
    )
  })

  test("paid plan: DOCX with a custom template goes through untouched", async () => {
    paidPlan()
    mockAxios.get
      .mockResolvedValueOnce({ id: "t-user", scope: "user" })
      .mockResolvedValueOnce(Buffer.from("PK"))
    const next = jest.fn()
    await exportWithTemplate(request("docx", { templateId: "t-user" }), mockRes(), next)
    expect(next).not.toHaveBeenCalled()
    const url = new URL(mockAxios.get.mock.calls[1][0])
    expect(url.searchParams.get("template_id")).toBe("t-user")
    expect(url.searchParams.has("pdf_lock")).toBe(false)
  })

  test("no SaaS plugin: the template is not fetched, nothing is added", async () => {
    mockSaas.enabled.mockReturnValue(false)
    mockAxios.get.mockResolvedValue(Buffer.from("PK"))
    await exportWithTemplate(request("docx", { templateId: "t-user" }), mockRes(), jest.fn())
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get.mock.calls[0][0]).toBe(
      "http://gateway/api/v1/jobs/job-1/export/docx?template_id=t-user",
    )
  })
})

describe("routes", () => {
  const routes = require(
    `${process.cwd()}/components/WebServer/routes/api/publication/publication.js`,
  )({})
  const gate = (method, path) =>
    routes.find((r) => r.method === method && r.path === path).requireEntitlement

  test("template writes need custom templates, the base DOCX needs DOCX export", () => {
    const one = "/organizations/:organizationId/templates/:templateId"
    expect(gate("post", "/organizations/:organizationId/templates")).toBe(
      "publication.custom_templates",
    )
    expect(gate("patch", one)).toBe("publication.custom_templates")
    expect(gate("delete", one)).toBe("publication.custom_templates")
    expect(gate("get", `${one}/download`)).toBe("publication.docx_export")
  })

  test("listing and exporting are decided in the controller", () => {
    expect(gate("get", "/organizations/:organizationId/templates")).toBeUndefined()
    expect(
      gate("get", "/conversations/:conversationId/jobs/:jobId/export/:format"),
    ).toBeUndefined()
  })
})
