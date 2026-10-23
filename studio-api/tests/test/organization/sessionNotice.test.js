jest.mock("debug", () => () => () => {})

const mockModel = {
  organizations: {
    getSessionNotice: jest.fn(),
    updateSessionNotice: jest.fn(),
    deleteSessionNotice: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const { parseSessionNotice, SESSION_NOTICE_MAX_LENGTH } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/sessionNotice`,
)
const { getSessionNotice, updateSessionNotice } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/sessionNotice`,
)

const ORG_ID = "0123456789abcdef01234567"

function mockRes() {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

function mockReq(body) {
  return { params: { organizationId: ORG_ID }, body }
}

beforeEach(() => jest.clearAllMocks())

describe("parseSessionNotice", () => {
  test("trims the Markdown content", () => {
    expect(parseSessionNotice("  **Disclaimer**\n\nText \n")).toBe(
      "**Disclaimer**\n\nText",
    )
  })

  test("blank content means no notice", () => {
    expect(parseSessionNotice("")).toBe("")
    expect(parseSessionNotice(" \n\t ")).toBe("")
  })

  test.each([undefined, null, 42, {}, ["text"]])(
    "%p is refused with a 400",
    (content) => {
      expect(() => parseSessionNotice(content)).toThrow(
        expect.objectContaining({
          name: "OrganizationSessionNoticeInvalid",
          status: 400,
        }),
      )
    },
  )

  test("the length limit applies to the trimmed content", () => {
    const longest = "a".repeat(SESSION_NOTICE_MAX_LENGTH)
    expect(parseSessionNotice(`  ${longest}  `)).toBe(longest)
    expect(() => parseSessionNotice(`${longest}a`)).toThrow(
      expect.objectContaining({ status: 400 }),
    )
  })
})

describe("session notice route controllers", () => {
  test("GET answers the stored notice", async () => {
    mockModel.organizations.getSessionNotice.mockResolvedValue("Notice")
    const res = mockRes()
    const next = jest.fn()
    await getSessionNotice(mockReq(), res, next)
    expect(mockModel.organizations.getSessionNotice).toHaveBeenCalledWith(
      ORG_ID,
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ content: "Notice" })
    expect(next).not.toHaveBeenCalled()
  })

  test("GET answers an empty string when there is no notice", async () => {
    mockModel.organizations.getSessionNotice.mockResolvedValue("")
    const res = mockRes()
    await getSessionNotice(mockReq(), res, jest.fn())
    expect(res.send).toHaveBeenCalledWith({ content: "" })
  })

  test("GET on a missing organization is a 404", async () => {
    mockModel.organizations.getSessionNotice.mockResolvedValue(null)
    const next = jest.fn()
    await getSessionNotice(mockReq(), mockRes(), next)
    expect(next.mock.calls[0][0]).toMatchObject({
      name: "OrganizationNotFound",
      status: 404,
    })
  })

  test("PUT stores the trimmed notice", async () => {
    mockModel.organizations.updateSessionNotice.mockResolvedValue({
      matchedCount: 1,
    })
    const res = mockRes()
    await updateSessionNotice(mockReq({ content: " Notice " }), res, jest.fn())
    expect(mockModel.organizations.updateSessionNotice).toHaveBeenCalledWith(
      ORG_ID,
      "Notice",
    )
    expect(mockModel.organizations.deleteSessionNotice).not.toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith({ content: "Notice" })
  })

  test("PUT with a blank content removes the notice", async () => {
    mockModel.organizations.deleteSessionNotice.mockResolvedValue({
      matchedCount: 1,
    })
    const res = mockRes()
    await updateSessionNotice(mockReq({ content: "  " }), res, jest.fn())
    expect(mockModel.organizations.deleteSessionNotice).toHaveBeenCalledWith(
      ORG_ID,
    )
    expect(mockModel.organizations.updateSessionNotice).not.toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith({ content: "" })
  })

  test("PUT with an invalid body writes nothing", async () => {
    const next = jest.fn()
    await updateSessionNotice(mockReq(undefined), mockRes(), next)
    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(mockModel.organizations.updateSessionNotice).not.toHaveBeenCalled()
    expect(mockModel.organizations.deleteSessionNotice).not.toHaveBeenCalled()
  })

  test("PUT on a missing organization is a 404", async () => {
    mockModel.organizations.updateSessionNotice.mockResolvedValue({
      matchedCount: 0,
    })
    const next = jest.fn()
    await updateSessionNotice(mockReq({ content: "Notice" }), mockRes(), next)
    expect(next.mock.calls[0][0]).toMatchObject({ status: 404 })
  })
})
