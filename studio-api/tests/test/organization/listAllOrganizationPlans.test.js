jest.mock("debug", () => () => () => {})

const mockSaas = {
  enabled: jest.fn(() => false),
  organizationsOnPlan: jest.fn(async () => null),
  organizationPlans: jest.fn(async () => ({})),
}
jest.mock(`${process.cwd()}/lib/saas`, () => mockSaas)

const mockModel = {
  organizations: { getAll: jest.fn() },
  conversations: { countMediaFromOrga: jest.fn(async () => []) },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const { listAllOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/organizations`,
)
const { OrganizationUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const ORG_A = "aaaaaaaaaaaaaaaaaaaaaaaa"
const ORG_B = "bbbbbbbbbbbbbbbbbbbbbbbb"
const BUSINESS = { planKey: "business", state: "active", mode: "normal" }
const FREE = { planKey: "free_payg", state: "active", mode: "normal" }

async function call(query) {
  const req = { query }
  const res = { status: jest.fn(() => res), send: jest.fn() }
  const next = jest.fn()
  await listAllOrganization(req, res, next)
  return { sent: res.send.mock.calls[0]?.[0], next }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockSaas.enabled.mockReturnValue(false)
  mockModel.organizations.getAll.mockResolvedValue({
    count: 2,
    list: [
      { _id: ORG_A, name: "A" },
      { _id: ORG_B, name: "B" },
    ],
  })
})

describe("listAllOrganization: plan state", () => {
  test("without SaaS the plan filter is ignored and rows carry no plan", async () => {
    const { sent, next } = await call({ plan: "business", state: "active" })
    expect(next).not.toHaveBeenCalled()
    expect(mockSaas.organizationsOnPlan).not.toHaveBeenCalled()
    expect(mockModel.organizations.getAll).toHaveBeenCalledWith(
      expect.anything(),
      {},
    )
    expect(sent.list.map((org) => org.plan)).toEqual([undefined, undefined])
  })

  test("in SaaS mode the plugin's set restricts the query and each row carries its plan", async () => {
    mockSaas.enabled.mockReturnValue(true)
    const onPlan = { organizationIds: [ORG_A], exclude: false }
    mockSaas.organizationsOnPlan.mockResolvedValue(onPlan)
    mockSaas.organizationPlans.mockResolvedValue({
      [ORG_A]: BUSINESS,
      [ORG_B]: FREE,
    })

    const query = { plan: "business", state: "active", mode: "normal" }
    const { sent, next } = await call(query)
    expect(next).not.toHaveBeenCalled()
    expect(mockSaas.organizationsOnPlan).toHaveBeenCalledWith({
      planKey: "business",
      state: "active",
      mode: "normal",
    })
    expect(mockModel.organizations.getAll).toHaveBeenCalledWith(query, {
      ids: [ORG_A],
    })
    expect(mockSaas.organizationPlans).toHaveBeenCalledWith([ORG_A, ORG_B])
    expect(sent.list).toEqual([
      expect.objectContaining({ _id: ORG_A, plan: BUSINESS, mediaCount: 0 }),
      expect.objectContaining({ _id: ORG_B, plan: FREE, mediaCount: 0 }),
    ])
  })

  test("a state or a mode alone filters without a plan", async () => {
    mockSaas.enabled.mockReturnValue(true)
    mockSaas.organizationsOnPlan.mockResolvedValue({
      organizationIds: [ORG_A],
      exclude: false,
    })
    await call({ state: "expired" })
    expect(mockSaas.organizationsOnPlan).toHaveBeenLastCalledWith({
      planKey: undefined,
      state: "expired",
      mode: undefined,
    })
    await call({ mode: "managed" })
    expect(mockSaas.organizationsOnPlan).toHaveBeenLastCalledWith({
      planKey: undefined,
      state: undefined,
      mode: "managed",
    })
  })

  test("a filter matching the default plan drops the organizations it does not keep", async () => {
    mockSaas.enabled.mockReturnValue(true)
    mockSaas.organizationsOnPlan.mockResolvedValue({
      organizationIds: [ORG_B],
      exclude: true,
    })
    const { next } = await call({ plan: "free_payg" })
    expect(next).not.toHaveBeenCalled()
    expect(mockModel.organizations.getAll).toHaveBeenCalledWith(
      { plan: "free_payg" },
      { excludeIds: [ORG_B] },
    )
  })

  test("in SaaS mode an unknown plan, state or mode is refused", async () => {
    mockSaas.enabled.mockReturnValue(true)
    mockSaas.organizationsOnPlan.mockResolvedValue(null)
    const { next } = await call({ plan: "platinum" })
    expect(next.mock.calls[0][0]).toBeInstanceOf(
      OrganizationUnsupportedMediaType,
    )
    expect(mockModel.organizations.getAll).not.toHaveBeenCalled()
  })
})
