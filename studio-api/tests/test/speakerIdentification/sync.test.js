jest.mock("debug", () => () => () => {})

const SYNC_OP = {
  UPSERT: "upsert",
  DELETE_SPEAKER: "delete_speaker",
  DROP_COLLECTION: "drop_collection",
}

// --- model mock ------------------------------------------------------------
const mockGetDue = jest.fn()
const mockMarkError = jest.fn()
const mockDeleteOp = jest.fn()
const mockGetBySubject = jest.fn()
const mockHasComputedVoiceprint = jest.fn()
const mockLabelsGetById = jest.fn()
const mockUsersGetById = jest.fn()

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  speakerIdSyncOps: {
    SYNC_OP: {
      UPSERT: "upsert",
      DELETE_SPEAKER: "delete_speaker",
      DROP_COLLECTION: "drop_collection",
    },
    getDue: (...a) => mockGetDue(...a),
    markError: (...a) => mockMarkError(...a),
    delete: (...a) => mockDeleteOp(...a),
  },
  voiceprints: {
    getBySubject: (...a) => mockGetBySubject(...a),
    hasComputedVoiceprint: (...a) => mockHasComputedVoiceprint(...a),
  },
  speakerLabels: { getById: (...a) => mockLabelsGetById(...a) },
  users: { getById: (...a) => mockUsersGetById(...a) },
}))

// --- connector mock --------------------------------------------------------
const mockUpsertSpeaker = jest.fn()
const mockDeleteSpeaker = jest.fn()
const mockDropCollection = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/connector`,
  () => ({
    upsertSpeaker: (...a) => mockUpsertSpeaker(...a),
    deleteSpeaker: (...a) => mockDeleteSpeaker(...a),
    dropCollection: (...a) => mockDropCollection(...a),
  }),
)

const sync = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/sync`,
)

const ORG_ID = "0123456789abcdef01234567"
const LABEL_ID = "89abcdef0123456789abcdef"
const QDRANT = `spkid_${ORG_ID}_${LABEL_ID}`

function op(overrides = {}) {
  return {
    _id: { toString: () => "op-1" },
    organizationId: { toString: () => ORG_ID },
    op: SYNC_OP.UPSERT,
    qdrantCollectionName: QDRANT,
    pointId: `label:${LABEL_ID}`,
    attempts: 0,
    created: new Date().toISOString(),
    ...overrides,
  }
}

describe("sync.processDueOps", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "true"
    process.env.SPEAKER_ID_SYNC_RETRY_INTERVAL = "60"
  })

  it("returns zero counts and does nothing when getDue returns a non-array", async () => {
    mockGetDue.mockResolvedValue(new Error("db down"))
    const res = await sync.processDueOps()
    expect(res).toEqual({ processed: 0, failed: 0 })
    expect(mockUpsertSpeaker).not.toHaveBeenCalled()
  })

  it("rebuilds an UPSERT op from Mongo (label) and deletes it on success", async () => {
    mockGetDue.mockResolvedValue([op()])
    mockGetBySubject.mockResolvedValue({
      vector: [0.1, 0.2],
      modelId: "model-A",
    })
    mockHasComputedVoiceprint.mockReturnValue(true)
    mockLabelsGetById.mockResolvedValue([{ name: "Jane Doe" }])

    const res = await sync.processDueOps()

    expect(mockGetBySubject).toHaveBeenCalledWith("label", LABEL_ID)
    expect(mockUpsertSpeaker).toHaveBeenCalledWith(
      ORG_ID,
      QDRANT,
      `label:${LABEL_ID}`,
      { name: "Jane Doe", vector: [0.1, 0.2], modelId: "model-A" },
    )
    expect(mockDeleteOp).toHaveBeenCalledWith("op-1")
    expect(mockMarkError).not.toHaveBeenCalled()
    expect(res).toEqual({ processed: 1, failed: 0 })
  })

  it("rebuilds an UPSERT op from Mongo (user) using the resolved display name", async () => {
    const USER_ID = "1111111111111111111111aa"
    mockGetDue.mockResolvedValue([op({ pointId: `user:${USER_ID}` })])
    mockGetBySubject.mockResolvedValue({ vector: [0.3], modelId: "model-B" })
    mockHasComputedVoiceprint.mockReturnValue(true)
    mockUsersGetById.mockResolvedValue([{ firstname: "Bob", lastname: "Smith" }])

    await sync.processDueOps()

    expect(mockUpsertSpeaker).toHaveBeenCalledWith(
      ORG_ID,
      QDRANT,
      `user:${USER_ID}`,
      { name: "Bob Smith", vector: [0.3], modelId: "model-B" },
    )
    expect(mockDeleteOp).toHaveBeenCalledWith("op-1")
  })

  it("drops an obsolete UPSERT op (voiceprint gone) without calling the connector", async () => {
    mockGetDue.mockResolvedValue([op()])
    mockGetBySubject.mockResolvedValue(null)
    mockHasComputedVoiceprint.mockReturnValue(false)

    const res = await sync.processDueOps()

    expect(mockUpsertSpeaker).not.toHaveBeenCalled()
    // The op is consumed (deleted), not retried: nothing left to upsert.
    expect(mockDeleteOp).toHaveBeenCalledWith("op-1")
    expect(mockMarkError).not.toHaveBeenCalled()
    expect(res).toEqual({ processed: 1, failed: 0 })
  })

  it("marks an op in error with exponential backoff when the connector fails", async () => {
    mockGetDue.mockResolvedValue([op({ attempts: 2 })])
    mockGetBySubject.mockResolvedValue({ vector: [0.1], modelId: "m" })
    mockHasComputedVoiceprint.mockReturnValue(true)
    mockLabelsGetById.mockResolvedValue([{ name: "Jane" }])
    mockUpsertSpeaker.mockRejectedValue(new Error("qdrant 500"))

    const res = await sync.processDueOps()

    expect(mockDeleteOp).not.toHaveBeenCalled()
    expect(mockMarkError).toHaveBeenCalledTimes(1)
    const [id, patch] = mockMarkError.mock.calls[0]
    expect(id).toBe("op-1")
    expect(patch.attempts).toBe(3)
    expect(patch.lastError).toBe("qdrant 500")
    expect(typeof patch.nextRetryAt).toBe("string")
    expect(res).toEqual({ processed: 0, failed: 1 })
  })

  it("applies a DELETE_SPEAKER op via the connector and deletes it on success", async () => {
    mockGetDue.mockResolvedValue([op({ op: SYNC_OP.DELETE_SPEAKER })])
    await sync.processDueOps()
    expect(mockDeleteSpeaker).toHaveBeenCalledWith(ORG_ID, QDRANT, `label:${LABEL_ID}`)
    expect(mockDeleteOp).toHaveBeenCalledWith("op-1")
  })

  it("applies a DROP_COLLECTION op via the connector", async () => {
    mockGetDue.mockResolvedValue([op({ op: SYNC_OP.DROP_COLLECTION })])
    await sync.processDueOps()
    expect(mockDropCollection).toHaveBeenCalledWith(ORG_ID, QDRANT)
    expect(mockDeleteOp).toHaveBeenCalledWith("op-1")
  })

  it("processes multiple ops independently, counting success and failure", async () => {
    mockGetDue.mockResolvedValue([
      op({ _id: { toString: () => "op-1" }, op: SYNC_OP.DROP_COLLECTION }),
      op({ _id: { toString: () => "op-2" }, op: SYNC_OP.DELETE_SPEAKER }),
    ])
    mockDeleteSpeaker.mockRejectedValue(new Error("boom"))

    const res = await sync.processDueOps()
    expect(res).toEqual({ processed: 1, failed: 1 })
    expect(mockDeleteOp).toHaveBeenCalledWith("op-1")
    expect(mockMarkError).toHaveBeenCalledTimes(1)
    expect(mockMarkError.mock.calls[0][0]).toBe("op-2")
  })
})

describe("sync.tick concurrency guard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "true"
  })

  it("does not overlap: a second tick is a no-op while the first is running", async () => {
    let resolveGetDue
    const gate = new Promise((r) => (resolveGetDue = r))
    mockGetDue.mockImplementation(() => gate.then(() => []))

    const first = sync.tick()
    // While the first tick is awaiting getDue, fire a second tick.
    await sync.tick()
    // The second tick must not have triggered another getDue call.
    expect(mockGetDue).toHaveBeenCalledTimes(1)

    resolveGetDue()
    await first
  })
})
