jest.mock("debug", () => () => () => {})

// --- files/store mock (enums + pure helpers) -------------------------------
const STORAGE_MODE = { AUDIO: "audio", EMBEDDINGS: "embeddings" }
const SYNC_STATE = { SYNCED: "synced", PENDING: "pending", ERROR: "error" }
const COLLECTION_TYPE = { CUSTOM: "custom", ORGANIZATION: "organization" }
const mockResolveStoragePath = jest.fn((p) => (p ? `/abs/${p}` : null))
const mockCascadeDeleteSampleFiles = jest.fn()

jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    resolveStoragePath: (...a) => mockResolveStoragePath(...a),
    cascadeDeleteSampleFiles: (...a) => mockCascadeDeleteSampleFiles(...a),
    COLLECTION_TYPE: { CUSTOM: "custom", ORGANIZATION: "organization" },
    STORAGE_MODE: { AUDIO: "audio", EMBEDDINGS: "embeddings" },
    SYNC_STATE: { SYNCED: "synced", PENDING: "pending", ERROR: "error" },
  }),
)

// --- model mock ------------------------------------------------------------
const mockCollGetById = jest.fn()
const mockSamplesGetBySpeakerLabelId = jest.fn()
const mockSamplesDeleteAllFromSpeakerLabel = jest.fn()
const mockVoiceprintsUpsert = jest.fn()
const mockLabelsUpdate = jest.fn()
const mockCollUpdate = jest.fn()
const mockEnqueue = jest.fn()

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  speakerIdSyncOps: {
    SYNC_OP: { UPSERT: "upsert", DELETE_SPEAKER: "delete_speaker", DROP_COLLECTION: "drop_collection" },
    enqueue: (...a) => mockEnqueue(...a),
  },
  voiceprintCollections: { getById: (...a) => mockCollGetById(...a), update: (...a) => mockCollUpdate(...a) },
  voiceprints: { upsert: (...a) => mockVoiceprintsUpsert(...a) },
  speakerLabels: { update: (...a) => mockLabelsUpdate(...a) },
  voiceSamples: {
    getBySpeakerLabelId: (...a) => mockSamplesGetBySpeakerLabelId(...a),
    deleteAllFromSpeakerLabel: (...a) => mockSamplesDeleteAllFromSpeakerLabel(...a),
  },
}))

// --- connector mock --------------------------------------------------------
const mockComputeVoiceprint = jest.fn()
const mockUpsertSpeaker = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/connector`,
  () => ({
    computeVoiceprint: (...a) => mockComputeVoiceprint(...a),
    upsertSpeaker: (...a) => mockUpsertSpeaker(...a),
  }),
)

const triggers = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
)

const ORG_ID = "0123456789abcdef01234567"
const LABEL_ID = "89abcdef0123456789abcdef"
const QDRANT = `spkid_${ORG_ID}_${LABEL_ID}`

function makeLabel() {
  return {
    _id: { toString: () => LABEL_ID },
    name: "Jane Doe",
    collectionId: "collid",
    organizationId: { toString: () => ORG_ID },
  }
}

function makeCollection({ storageMode = STORAGE_MODE.AUDIO } = {}) {
  return {
    _id: { toString: () => "collid" },
    qdrantCollectionName: QDRANT,
    storageMode,
  }
}

describe("triggers.recomputeLabel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "true"
  })

  it("is a no-op when the feature is disabled", async () => {
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "false"
    await triggers.recomputeLabel(makeLabel())
    expect(mockCollGetById).not.toHaveBeenCalled()
    expect(mockComputeVoiceprint).not.toHaveBeenCalled()
  })

  it("does nothing if the collection is missing", async () => {
    mockCollGetById.mockResolvedValue([])
    await triggers.recomputeLabel(makeLabel())
    expect(mockComputeVoiceprint).not.toHaveBeenCalled()
  })

  it("does nothing if there are no sample audio files", async () => {
    mockCollGetById.mockResolvedValue([makeCollection()])
    mockSamplesGetBySpeakerLabelId.mockResolvedValue([{ /* no audioFilePath */ }])
    await triggers.recomputeLabel(makeLabel())
    expect(mockComputeVoiceprint).not.toHaveBeenCalled()
    expect(mockVoiceprintsUpsert).not.toHaveBeenCalled()
  })

  it("nominal: compute -> voiceprints.upsert -> pushSpeaker -> setLabelState(synced)", async () => {
    mockCollGetById.mockResolvedValue([makeCollection()])
    mockSamplesGetBySpeakerLabelId.mockResolvedValue([
      { _id: "s1", audioFilePath: "a.wav" },
    ])
    mockComputeVoiceprint.mockResolvedValue({
      vector: [0.1, 0.2],
      modelId: "model-A",
      dim: 2,
      durationUsed: 5,
    })
    mockVoiceprintsUpsert.mockResolvedValue({ _id: "vp1" })
    mockUpsertSpeaker.mockResolvedValue(undefined)

    await triggers.recomputeLabel(makeLabel())

    expect(mockComputeVoiceprint).toHaveBeenCalledWith(ORG_ID, ["/abs/a.wav"])
    // voiceprint stored from compute result
    expect(mockVoiceprintsUpsert).toHaveBeenCalledWith(
      "label",
      expect.anything(),
      expect.objectContaining({ vector: [0.1, 0.2], modelId: "model-A", dim: 2 }),
    )
    // pushed to Qdrant via connector
    expect(mockUpsertSpeaker).toHaveBeenCalledWith(
      ORG_ID,
      QDRANT,
      `label:${LABEL_ID}`,
      { name: "Jane Doe", vector: [0.1, 0.2], modelId: "model-A" },
    )
    // label marked synced with hasVoiceprint=true
    expect(mockLabelsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ _id: LABEL_ID, syncState: SYNC_STATE.SYNCED, hasVoiceprint: true }),
    )
    // no enqueue on success
    expect(mockEnqueue).not.toHaveBeenCalled()
  })

  it("connector upsert failure: enqueue UPSERT op + label syncState pending", async () => {
    mockCollGetById.mockResolvedValue([makeCollection()])
    mockSamplesGetBySpeakerLabelId.mockResolvedValue([
      { _id: "s1", audioFilePath: "a.wav" },
    ])
    mockComputeVoiceprint.mockResolvedValue({
      vector: [0.1],
      modelId: "model-A",
      dim: 1,
      durationUsed: 3,
    })
    mockVoiceprintsUpsert.mockResolvedValue({ _id: "vp1" })
    mockUpsertSpeaker.mockRejectedValue(new Error("qdrant down"))

    await triggers.recomputeLabel(makeLabel())

    // voiceprint still stored in Mongo (source of truth)
    expect(mockVoiceprintsUpsert).toHaveBeenCalled()
    // op queued for reconciliation
    expect(mockEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        op: "upsert",
        qdrantCollectionName: QDRANT,
        organizationId: ORG_ID,
        pointId: `label:${LABEL_ID}`,
        voiceprintId: "vp1",
      }),
    )
    // label marked pending
    expect(mockLabelsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ syncState: SYNC_STATE.PENDING }),
    )
  })

  it("embeddings mode: purges sample files and DB records after a successful compute", async () => {
    mockCollGetById.mockResolvedValue([
      makeCollection({ storageMode: STORAGE_MODE.EMBEDDINGS }),
    ])
    const samples = [{ _id: "s1", audioFilePath: "a.wav" }]
    mockSamplesGetBySpeakerLabelId.mockResolvedValue(samples)
    mockComputeVoiceprint.mockResolvedValue({
      vector: [0.1],
      modelId: "model-A",
      dim: 1,
      durationUsed: 2,
    })
    mockVoiceprintsUpsert.mockResolvedValue({ _id: "vp1" })
    mockUpsertSpeaker.mockResolvedValue(undefined)

    await triggers.recomputeLabel(makeLabel())

    expect(mockCascadeDeleteSampleFiles).toHaveBeenCalled()
    expect(mockSamplesDeleteAllFromSpeakerLabel).toHaveBeenCalled()
  })

  it("audio mode: does NOT purge sample files", async () => {
    mockCollGetById.mockResolvedValue([makeCollection({ storageMode: STORAGE_MODE.AUDIO })])
    mockSamplesGetBySpeakerLabelId.mockResolvedValue([{ _id: "s1", audioFilePath: "a.wav" }])
    mockComputeVoiceprint.mockResolvedValue({ vector: [0.1], modelId: "m", dim: 1, durationUsed: 1 })
    mockVoiceprintsUpsert.mockResolvedValue({ _id: "vp1" })
    mockUpsertSpeaker.mockResolvedValue(undefined)

    await triggers.recomputeLabel(makeLabel())

    expect(mockCascadeDeleteSampleFiles).not.toHaveBeenCalled()
    expect(mockSamplesDeleteAllFromSpeakerLabel).not.toHaveBeenCalled()
  })

  it("on an unexpected compute failure, marks label syncState error and never throws", async () => {
    mockCollGetById.mockResolvedValue([makeCollection()])
    mockSamplesGetBySpeakerLabelId.mockResolvedValue([{ _id: "s1", audioFilePath: "a.wav" }])
    mockComputeVoiceprint.mockRejectedValue(new Error("compute exploded"))

    await expect(triggers.recomputeLabel(makeLabel())).resolves.toBeUndefined()
    expect(mockLabelsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ syncState: SYNC_STATE.ERROR }),
    )
  })
})
