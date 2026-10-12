jest.mock("debug", () => () => () => {})

const mockGetBySubject = jest.fn()
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  voiceprints: {
    getBySubject: (...a) => mockGetBySubject(...a),
    hasComputedVoiceprint: (v) =>
      Boolean(v && Array.isArray(v.vector) && v.vector.length > 0),
  },
}))

const mockComputeVoiceprint = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/connector`,
  () => ({ computeVoiceprint: (...a) => mockComputeVoiceprint(...a) }),
)

const mockResolveUserComputeOrgId = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
  () => ({
    enabled: () => process.env.ENABLE_SPEAKER_IDENTIFICATION === "true",
    resolveUserComputeOrgId: (...a) => mockResolveUserComputeOrgId(...a),
  }),
)

const { checkSampleHomogeneity } = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/homogeneity`,
)
const { cosineSimilarity } = require(
  `${process.cwd()}/lib/dao/speakerIdentification/similarity`,
)
const {
  VoiceSampleUnprocessable,
  VoiceSampleMismatch,
  SpeakerIdentificationUnavailable,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)

const ORG_ID = "0123456789abcdef01234567"
const SAMPLE = {
  organizationId: ORG_ID,
  subjectType: "label",
  subjectId: "89abcdef0123456789abcdef",
  absolutePath: "/abs/sample.flac",
}
const USER_SAMPLE = {
  subjectType: "user",
  subjectId: "0123456789abcdef89abcdef",
  absolutePath: "/abs/sample.flac",
}
const MODEL = "ecapa-v1"

function reference(vector) {
  return { vector, modelId: MODEL, dim: vector.length }
}

async function rejection(promise) {
  try {
    await promise
  } catch (err) {
    return err
  }
  return null
}

describe("cosineSimilarity", () => {
  test("is 1 for identical vectors and 0 for orthogonal ones", () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 6)
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 6)
  })

  test("ignores the vector scale", () => {
    expect(cosineSimilarity([1, 1], [5, 5])).toBeCloseTo(1, 6)
  })

  test("is null when the vectors cannot be compared", () => {
    expect(cosineSimilarity([1, 2], [1, 2, 3])).toBeNull()
    expect(cosineSimilarity([0, 0], [1, 2])).toBeNull()
    expect(cosineSimilarity(null, [1])).toBeNull()
  })
})

describe("checkSampleHomogeneity", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "true"
    delete process.env.SPEAKER_ID_MIN_SAMPLE_SIMILARITY
  })

  test("does nothing when speaker identification is disabled", async () => {
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "false"
    await checkSampleHomogeneity(SAMPLE)
    expect(mockComputeVoiceprint).not.toHaveBeenCalled()
  })

  test("does nothing when the threshold is 0", async () => {
    process.env.SPEAKER_ID_MIN_SAMPLE_SIMILARITY = "0"
    await checkSampleHomogeneity(SAMPLE)
    expect(mockComputeVoiceprint).not.toHaveBeenCalled()
  })

  test("computes the sample alone and accepts it without a reference", async () => {
    mockComputeVoiceprint.mockResolvedValue({ vector: [1, 0], modelId: MODEL })
    mockGetBySubject.mockResolvedValue(null)
    await checkSampleHomogeneity(SAMPLE)
    expect(mockComputeVoiceprint).toHaveBeenCalledWith(ORG_ID, [
      SAMPLE.absolutePath,
    ])
    expect(mockGetBySubject).toHaveBeenCalledWith(
      SAMPLE.subjectType,
      SAMPLE.subjectId,
    )
  })

  test("resolves the organization of a user subject", async () => {
    mockResolveUserComputeOrgId.mockResolvedValue(ORG_ID)
    mockComputeVoiceprint.mockResolvedValue({ vector: [1, 0], modelId: MODEL })
    mockGetBySubject.mockResolvedValue(null)
    await checkSampleHomogeneity(USER_SAMPLE)
    expect(mockResolveUserComputeOrgId).toHaveBeenCalledWith(
      USER_SAMPLE.subjectId,
    )
    expect(mockComputeVoiceprint).toHaveBeenCalledWith(ORG_ID, [
      USER_SAMPLE.absolutePath,
    ])
  })

  test("skips a user who belongs to no organization", async () => {
    mockResolveUserComputeOrgId.mockResolvedValue(null)
    await checkSampleHomogeneity(USER_SAMPLE)
    expect(mockComputeVoiceprint).not.toHaveBeenCalled()
  })

  test("accepts a sample close to the reference", async () => {
    mockComputeVoiceprint.mockResolvedValue({
      vector: [1, 0.1],
      modelId: MODEL,
    })
    mockGetBySubject.mockResolvedValue(reference([1, 0]))
    await expect(checkSampleHomogeneity(SAMPLE)).resolves.toBeUndefined()
  })

  test("rejects a sample under the threshold with a 422", async () => {
    mockComputeVoiceprint.mockResolvedValue({ vector: [0, 1], modelId: MODEL })
    mockGetBySubject.mockResolvedValue(reference([1, 0]))
    const err = await rejection(checkSampleHomogeneity(SAMPLE))
    expect(err).toBeInstanceOf(VoiceSampleMismatch)
    expect(err.status).toBe(422)
    expect(err.similarity).toBeCloseTo(0, 6)
    expect(err.threshold).toBe(0.6)
    expect(err.message).toContain("not kept")
  })

  test("uses the threshold from the environment", async () => {
    process.env.SPEAKER_ID_MIN_SAMPLE_SIMILARITY = "0.9"
    mockComputeVoiceprint.mockResolvedValue({ vector: [1, 1], modelId: MODEL })
    mockGetBySubject.mockResolvedValue(reference([1, 0]))
    const err = await rejection(checkSampleHomogeneity(SAMPLE))
    expect(err).toBeInstanceOf(VoiceSampleMismatch)
    expect(err.threshold).toBe(0.9)
  })

  test("skips the comparison when the reference comes from another model", async () => {
    mockComputeVoiceprint.mockResolvedValue({
      vector: [0, 1],
      modelId: "other-model",
    })
    mockGetBySubject.mockResolvedValue(reference([1, 0]))
    await expect(checkSampleHomogeneity(SAMPLE)).resolves.toBeUndefined()
  })

  test("answers 503 when the service cannot be reached", async () => {
    mockComputeVoiceprint.mockRejectedValue(new Error("ECONNREFUSED"))
    const err = await rejection(checkSampleHomogeneity(SAMPLE))
    expect(err).toBeInstanceOf(SpeakerIdentificationUnavailable)
    expect(err.status).toBe(503)
    expect(mockGetBySubject).not.toHaveBeenCalled()
  })

  test("answers 400 when the service rejects the file", async () => {
    const serviceError = new Error("Request failed with status code 400")
    serviceError.response = { status: 400 }
    mockComputeVoiceprint.mockRejectedValue(serviceError)
    const err = await rejection(checkSampleHomogeneity(SAMPLE))
    expect(err).toBeInstanceOf(VoiceSampleUnprocessable)
    expect(err.status).toBe(400)
  })
})
