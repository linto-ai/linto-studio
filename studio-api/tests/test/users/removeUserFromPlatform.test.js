jest.mock("debug", () => () => () => {})

const mockModel = {
  conversations: { getByShare: jest.fn(), update: jest.fn() },
  organizations: { listSelf: jest.fn(), update: jest.fn() },
  voiceSamples: { getByUserId: jest.fn(), deleteAllFromUser: jest.fn() },
  voiceOptIns: { getByUserId: jest.fn(), deleteAllFromUser: jest.fn() },
  voiceprints: { deleteAllFromUser: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info: () => {},
  error: () => {},
}))

const mockCountAdmin = jest.fn()
const mockCancelBilling = jest.fn()
const mockDeleteOrganizationCascade = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({
    countAdmin: (...args) => mockCountAdmin(...args),
    cancelBilling: (...args) => mockCancelBilling(...args),
    deleteOrganizationCascade: (...args) =>
      mockDeleteOrganizationCascade(...args),
  }),
)

const mockCascadeDeleteSampleFiles = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    cascadeDeleteSampleFiles: (...args) =>
      mockCascadeDeleteSampleFiles(...args),
  }),
)

const mockRemoveUserEverywhere = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
  () => ({
    removeUserEverywhere: (...args) => mockRemoveUserEverywhere(...args),
  }),
)

const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const { removeUserFromPlatform } = require(
  `${process.cwd()}/components/WebServer/controllers/user/utility`,
)

const USER_ID = "0123456789abcdef01234567"

describe("removeUserFromPlatform", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockModel.conversations.getByShare.mockResolvedValue([])
    mockModel.organizations.listSelf.mockResolvedValue([])
    mockCancelBilling.mockResolvedValue(undefined)
    mockModel.voiceSamples.getByUserId.mockResolvedValue([])
    mockModel.voiceOptIns.getByUserId.mockResolvedValue([])
    mockModel.voiceSamples.deleteAllFromUser.mockResolvedValue({
      deletedCount: 0,
    })
    mockModel.voiceOptIns.deleteAllFromUser.mockResolvedValue({
      deletedCount: 0,
    })
    mockModel.voiceprints.deleteAllFromUser.mockResolvedValue({
      deletedCount: 0,
    })
  })

  test("resolves when the full cascade succeeds", async () => {
    mockModel.conversations.getByShare.mockResolvedValue([
      { sharedWithUsers: [{ userId: USER_ID }, { userId: "other" }] },
    ])
    mockModel.conversations.update.mockResolvedValue({ matchedCount: 1 })
    mockModel.organizations.listSelf.mockResolvedValue([
      { _id: "org1", users: [{ userId: USER_ID }, { userId: "other" }] },
    ])
    mockCountAdmin.mockReturnValue({ adminCount: 2, isAdmin: false })
    mockModel.organizations.update.mockResolvedValue({ matchedCount: 1 })

    await expect(removeUserFromPlatform(USER_ID)).resolves.toBeUndefined()

    expect(mockModel.voiceSamples.deleteAllFromUser).toHaveBeenCalledWith(
      USER_ID,
    )
    expect(mockModel.voiceprints.deleteAllFromUser).toHaveBeenCalledWith(
      USER_ID,
    )
    expect(mockRemoveUserEverywhere).toHaveBeenCalled()
  })

  test("runs the organization deletion cascade when the user is its last admin", async () => {
    mockModel.organizations.listSelf.mockResolvedValue([
      { _id: "org1", users: [{ userId: USER_ID }] },
    ])
    mockCountAdmin.mockReturnValue({ adminCount: 1, isAdmin: true })
    mockDeleteOrganizationCascade.mockResolvedValue(undefined)

    await expect(removeUserFromPlatform(USER_ID)).resolves.toBeUndefined()

    expect(mockDeleteOrganizationCascade).toHaveBeenCalledWith("org1")
  })

  test("cancels the billing of the organizations it will delete before touching anything", async () => {
    const calls = []
    mockCancelBilling.mockImplementation(async (id) =>
      calls.push(`cancel ${id}`),
    )
    mockModel.conversations.getByShare.mockResolvedValue([
      { sharedWithUsers: [{ userId: USER_ID }] },
    ])
    mockModel.conversations.update.mockImplementation(async () => {
      calls.push("share stripped")
      return { matchedCount: 1 }
    })
    mockModel.organizations.listSelf.mockResolvedValue([
      { _id: "org1", users: [{ userId: USER_ID }] },
      { _id: "org2", users: [{ userId: USER_ID }, { userId: "other" }] },
    ])
    mockCountAdmin.mockImplementation((organization) => {
      if (organization._id === "org1") return { adminCount: 1, isAdmin: true }
      return { adminCount: 2, isAdmin: false }
    })
    mockModel.organizations.update.mockResolvedValue({ matchedCount: 1 })

    await expect(removeUserFromPlatform(USER_ID)).resolves.toBeUndefined()

    expect(calls).toEqual(["cancel org1", "share stripped"])
    expect(mockDeleteOrganizationCascade).toHaveBeenCalledWith("org1")
    expect(mockDeleteOrganizationCascade).toHaveBeenCalledTimes(1)
  })

  test("keeps the account whole when a subscription cannot be canceled", async () => {
    mockCancelBilling.mockRejectedValue(
      new Error("organization kept: stripe down"),
    )
    mockModel.conversations.getByShare.mockResolvedValue([
      { sharedWithUsers: [{ userId: USER_ID }] },
    ])
    mockModel.organizations.listSelf.mockResolvedValue([
      { _id: "org1", users: [{ userId: USER_ID }] },
    ])
    mockCountAdmin.mockReturnValue({ adminCount: 1, isAdmin: true })

    await expect(removeUserFromPlatform(USER_ID)).rejects.toThrow(
      "organization kept: stripe down",
    )
    expect(mockModel.conversations.update).not.toHaveBeenCalled()
    expect(mockDeleteOrganizationCascade).not.toHaveBeenCalled()
    expect(mockModel.voiceSamples.deleteAllFromUser).not.toHaveBeenCalled()
  })

  test("rejects when the organization deletion cascade fails", async () => {
    mockModel.organizations.listSelf.mockResolvedValue([
      { _id: "org1", users: [{ userId: USER_ID }] },
    ])
    mockCountAdmin.mockReturnValue({ adminCount: 1, isAdmin: true })
    mockDeleteOrganizationCascade.mockRejectedValue(new Error("cascade failed"))

    await expect(removeUserFromPlatform(USER_ID)).rejects.toThrow(
      "cascade failed",
    )
    expect(mockModel.voiceSamples.deleteAllFromUser).not.toHaveBeenCalled()
  })

  test("rejects when a shared conversation update matches nothing", async () => {
    mockModel.conversations.getByShare.mockResolvedValue([
      { sharedWithUsers: [{ userId: USER_ID }] },
    ])
    mockModel.conversations.update.mockResolvedValue({ matchedCount: 0 })

    await expect(removeUserFromPlatform(USER_ID)).rejects.toBeInstanceOf(
      UserError,
    )
  })

  test("rejects when a model read returns an Error instead of throwing", async () => {
    mockModel.organizations.listSelf.mockResolvedValue(new Error("db down"))

    await expect(removeUserFromPlatform(USER_ID)).rejects.toThrow("db down")
  })

  test("rejects when the voice data cleanup fails instead of swallowing it", async () => {
    mockModel.voiceprints.deleteAllFromUser.mockResolvedValue(
      new Error("voiceprints unavailable"),
    )

    await expect(removeUserFromPlatform(USER_ID)).rejects.toThrow(
      "voiceprints unavailable",
    )
    expect(mockRemoveUserEverywhere).not.toHaveBeenCalled()
  })

  test("rejects when the voice sample read fails, before deleting anything voice-related", async () => {
    mockModel.voiceSamples.getByUserId.mockResolvedValue(
      new Error("samples read failed"),
    )

    await expect(removeUserFromPlatform(USER_ID)).rejects.toThrow(
      "samples read failed",
    )
    expect(mockModel.voiceSamples.deleteAllFromUser).not.toHaveBeenCalled()
    expect(mockCascadeDeleteSampleFiles).not.toHaveBeenCalled()
  })
})
