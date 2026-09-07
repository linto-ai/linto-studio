jest.mock("debug", () => () => () => {})

const mockModel = {
  conversations: { getByOrga: jest.fn(), delete: jest.fn() },
  conversationSubtitles: {
    deleteAllFromConv: jest.fn(),
    deleteAllFromOrga: jest.fn(),
  },
  categories: { getByScope: jest.fn(), delete: jest.fn() },
  tags: { deleteAllFromCategory: jest.fn() },
  voiceSamples: {
    getByOrganizationId: jest.fn(),
    deleteAllFromOrganization: jest.fn(),
  },
  speakerLabels: {
    getByOrganizationId: jest.fn(),
    deleteAllFromOrganization: jest.fn(),
  },
  voiceprintCollections: {
    getByOrganizationId: jest.fn(),
    deleteAllFromOrganization: jest.fn(),
  },
  voiceOptIns: { deleteAllFromOrganization: jest.fn() },
  speakerIdSyncOps: { deleteAllFromOrganization: jest.fn() },
  organizations: { delete: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const mockDeleteAudioFileIfOrphaned = jest.fn()
const mockCascadeDeleteSampleFiles = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    deleteAudioFileIfOrphaned: (...args) =>
      mockDeleteAudioFileIfOrphaned(...args),
    cascadeDeleteSampleFiles: (...args) =>
      mockCascadeDeleteSampleFiles(...args),
  }),
)

const mockDropOrganizationSpeakers = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
  () => ({
    dropOrganizationSpeakers: (...args) =>
      mockDropOrganizationSpeakers(...args),
  }),
)

const { deleteOrganizationCascade } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const ORG_ID = "0123456789abcdef01234567"

function lastCallOrder(mockFn) {
  return mockFn.mock.invocationCallOrder.at(-1)
}

describe("deleteOrganizationCascade", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockModel.conversations.getByOrga.mockResolvedValue([])
    mockModel.conversations.delete.mockResolvedValue({ deletedCount: 1 })
    mockModel.conversationSubtitles.deleteAllFromConv.mockResolvedValue({
      deletedCount: 0,
    })
    mockModel.conversationSubtitles.deleteAllFromOrga.mockResolvedValue({
      deletedCount: 0,
    })
    mockModel.categories.getByScope.mockResolvedValue([])
    mockModel.categories.delete.mockResolvedValue({ deletedCount: 1 })
    mockModel.tags.deleteAllFromCategory.mockResolvedValue({ deletedCount: 0 })
    mockModel.voiceSamples.getByOrganizationId.mockResolvedValue([])
    mockModel.voiceprintCollections.getByOrganizationId.mockResolvedValue([])
    mockModel.speakerLabels.getByOrganizationId.mockResolvedValue([])
    mockModel.voiceSamples.deleteAllFromOrganization.mockResolvedValue({
      deletedCount: 0,
    })
    mockModel.speakerLabels.deleteAllFromOrganization.mockResolvedValue({
      deletedCount: 0,
    })
    mockModel.voiceprintCollections.deleteAllFromOrganization.mockResolvedValue(
      { deletedCount: 0 },
    )
    mockModel.voiceOptIns.deleteAllFromOrganization.mockResolvedValue({
      deletedCount: 0,
    })
    mockModel.speakerIdSyncOps.deleteAllFromOrganization.mockResolvedValue({
      deletedCount: 0,
    })
    mockModel.organizations.delete.mockResolvedValue({ deletedCount: 1 })
  })

  test("deletes media, taxonomy, then speaker identification, then the organization", async () => {
    mockModel.conversations.getByOrga.mockResolvedValue([
      { _id: "conv1", metadata: { audio: { filepath: "audio/conv1.mp3" } } },
    ])
    mockModel.categories.getByScope.mockImplementation(async (scopeId) => {
      if (scopeId === ORG_ID) return [{ _id: "cat1" }]
      return []
    })

    await expect(deleteOrganizationCascade(ORG_ID)).resolves.toBeUndefined()

    expect(mockDeleteAudioFileIfOrphaned).toHaveBeenCalledWith(
      "audio/conv1.mp3",
    )
    expect(mockModel.conversations.delete).toHaveBeenCalledWith("conv1")
    expect(
      mockModel.conversationSubtitles.deleteAllFromConv,
    ).toHaveBeenCalledWith("conv1")
    expect(mockModel.tags.deleteAllFromCategory).toHaveBeenCalledWith("cat1")
    expect(mockModel.categories.delete).toHaveBeenCalledWith("cat1")
    expect(mockDropOrganizationSpeakers).toHaveBeenCalledWith(ORG_ID, [], [])
    expect(mockModel.organizations.delete).toHaveBeenCalledWith(ORG_ID)

    const convOrder = lastCallOrder(mockModel.conversations.delete)
    const taxonomyOrder = lastCallOrder(mockModel.categories.delete)
    const speakerIdOrder = lastCallOrder(
      mockModel.voiceSamples.deleteAllFromOrganization,
    )
    const orgaOrder = lastCallOrder(mockModel.organizations.delete)
    expect(convOrder).toBeLessThan(taxonomyOrder)
    expect(taxonomyOrder).toBeLessThan(speakerIdOrder)
    expect(speakerIdOrder).toBeLessThan(orgaOrder)
  })

  test("does not delete the organization when a conversation deletion fails", async () => {
    mockModel.conversations.getByOrga.mockResolvedValue([{ _id: "conv1" }])
    mockModel.conversations.delete.mockResolvedValue({ deletedCount: 0 })

    await expect(deleteOrganizationCascade(ORG_ID)).rejects.toThrow(
      "Error when deleting conversation",
    )
    expect(mockModel.organizations.delete).not.toHaveBeenCalled()
  })

  test("does not delete the organization when a model returns an Error", async () => {
    mockModel.speakerLabels.deleteAllFromOrganization.mockResolvedValue(
      new Error("labels unavailable"),
    )

    await expect(deleteOrganizationCascade(ORG_ID)).rejects.toThrow(
      "labels unavailable",
    )
    expect(mockModel.organizations.delete).not.toHaveBeenCalled()
  })

  test("rejects when the organization record deletion matches nothing", async () => {
    mockModel.organizations.delete.mockResolvedValue({ deletedCount: 0 })

    await expect(deleteOrganizationCascade(ORG_ID)).rejects.toThrow(
      "Error when deleting organization",
    )
  })
})
