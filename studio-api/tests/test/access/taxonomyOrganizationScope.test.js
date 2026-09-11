jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { getById: jest.fn() },
}))

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { categoryBelongsToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/taxonomy/organizationScope`,
)

beforeEach(() => {
  jest.clearAllMocks()
  model.conversations.getById.mockImplementation(async (id) =>
    id === "conv-of-org" ? [{ organization: { organizationId: "org" } }] : [],
  )
})

describe("categoryBelongsToOrganization", () => {
  test("accepts a category scoped to the organization itself", async () => {
    expect(await categoryBelongsToOrganization({ scopeId: "org" }, "org")).toBe(
      true,
    )
    expect(model.conversations.getById).not.toHaveBeenCalled()
  })

  test("accepts a category scoped to a conversation of the organization", async () => {
    expect(
      await categoryBelongsToOrganization({ scopeId: "conv-of-org" }, "org"),
    ).toBe(true)
  })

  test("refuses a category of another organization", async () => {
    expect(
      await categoryBelongsToOrganization({ scopeId: "other-org" }, "org"),
    ).toBe(false)
  })

  test("refuses a category scoped to a conversation of another organization", async () => {
    model.conversations.getById.mockResolvedValue([
      { organization: { organizationId: "other-org" } },
    ])
    expect(
      await categoryBelongsToOrganization({ scopeId: "conv-x" }, "org"),
    ).toBe(false)
  })

  test("refuses when the category or the organization is missing", async () => {
    expect(await categoryBelongsToOrganization(undefined, "org")).toBe(false)
    expect(
      await categoryBelongsToOrganization({ scopeId: "org" }, undefined),
    ).toBe(false)
  })
})
