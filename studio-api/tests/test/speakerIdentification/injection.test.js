jest.mock("debug", () => () => () => {})

// Mock the Mongo models barrel: only voiceprintCollections.getById is used.
const mockGetById = jest.fn()
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  voiceprintCollections: { getById: (...args) => mockGetById(...args) },
}))

// Real permissions module is pure (bitmask), keep it. But guarantee it is
// loaded after the model mock so injection.js wires up correctly.
const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

const {
  applySpeakerIdentification,
} = require(`${process.cwd()}/components/WebServer/controllers/speakerIdentification/injection`)

const ORG_ID = "0123456789abcdef01234567"
const OTHER_ORG_ID = "ffffffffffffffffffffffff"
const COLL_ID = "89abcdef0123456789abcdef"
const QDRANT_NAME = `spkid_${ORG_ID}_${COLL_ID}`

function makeOrg({ withPermission = true } = {}) {
  return {
    _id: { toString: () => ORG_ID },
    permissions: withPermission ? PERMISSIONS.SPEAKER_IDENTIFICATION : 0,
  }
}

function diarConfig() {
  return { diarizationConfig: { enableDiarization: true } }
}

describe("applySpeakerIdentification", () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...OLD_ENV }
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "true"
    delete process.env.SPEAKER_ID_API_TOKEN
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it("(a) returns enabled:false and leaves transcriptionConfig unchanged when no collections", async () => {
    const body = { transcriptionConfig: { foo: "bar", diarizationConfig: { enableDiarization: true } } }
    const result = await applySpeakerIdentification(body, makeOrg())

    expect(result.enabled).toBe(false)
    expect(result.headers).toEqual({})
    // the diarizationConfig has no speakerIdentificationConfig injected
    expect(
      result.transcriptionConfig.diarizationConfig.speakerIdentificationConfig,
    ).toBeUndefined()
    expect(result.transcriptionConfig.foo).toBe("bar")
    expect(mockGetById).not.toHaveBeenCalled()
  })

  it("(b) discards a client-supplied speakerIdentificationConfig (D6)", async () => {
    const body = {
      transcriptionConfig: {
        diarizationConfig: {
          enableDiarization: true,
          speakerIdentificationConfig: { collections: ["spkid_evil"], speakers: "*" },
        },
      },
      // no collections requested -> stays disabled, but client config still dropped
    }
    const result = await applySpeakerIdentification(body, makeOrg())

    expect(result.enabled).toBe(false)
    expect(
      result.transcriptionConfig.diarizationConfig.speakerIdentificationConfig,
    ).toBeUndefined()
  })

  it("(b2) discards client config even when collections are requested, rebuilding server-side", async () => {
    mockGetById.mockResolvedValue([
      { organizationId: { toString: () => ORG_ID }, qdrantCollectionName: QDRANT_NAME },
    ])
    const body = {
      transcriptionConfig: {
        diarizationConfig: {
          enableDiarization: true,
          speakerIdentificationConfig: { collections: ["spkid_evil"] },
        },
      },
      speakerIdentificationCollections: [COLL_ID],
    }
    const result = await applySpeakerIdentification(body, makeOrg())

    expect(result.enabled).toBe(true)
    expect(
      result.transcriptionConfig.diarizationConfig.speakerIdentificationConfig
        .collections,
    ).toEqual([QDRANT_NAME])
  })

  it("(c) throws SpeakerIdentificationForbidden (403) for a collection of another org", async () => {
    mockGetById.mockResolvedValue([
      {
        organizationId: { toString: () => OTHER_ORG_ID },
        qdrantCollectionName: `spkid_${OTHER_ORG_ID}_${COLL_ID}`,
      },
    ])
    const body = {
      transcriptionConfig: diarConfig(),
      speakerIdentificationCollections: [COLL_ID],
    }
    await expect(
      applySpeakerIdentification(body, makeOrg()),
    ).rejects.toMatchObject({ status: 403 })
  })

  it("(c2) throws SpeakerIdentificationForbidden when the collection does not exist", async () => {
    mockGetById.mockResolvedValue([])
    const body = {
      transcriptionConfig: diarConfig(),
      speakerIdentificationCollections: [COLL_ID],
    }
    await expect(
      applySpeakerIdentification(body, makeOrg()),
    ).rejects.toMatchObject({ status: 403 })
  })

  it("(d) throws when diarization is disabled", async () => {
    const body = {
      transcriptionConfig: { diarizationConfig: { enableDiarization: false } },
      speakerIdentificationCollections: [COLL_ID],
    }
    await expect(applySpeakerIdentification(body, makeOrg())).rejects.toThrow(
      /requires diarization/,
    )
    expect(mockGetById).not.toHaveBeenCalled()
  })

  it("(d2) throws when there is no diarizationConfig at all", async () => {
    const body = {
      transcriptionConfig: {},
      speakerIdentificationCollections: [COLL_ID],
    }
    await expect(applySpeakerIdentification(body, makeOrg())).rejects.toThrow(
      /requires diarization/,
    )
  })

  it("(e) throws when the feature flag is off", async () => {
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "false"
    const body = {
      transcriptionConfig: diarConfig(),
      speakerIdentificationCollections: [COLL_ID],
    }
    await expect(applySpeakerIdentification(body, makeOrg())).rejects.toThrow(
      /not enabled/,
    )
  })

  it("(f) throws when the organization lacks the speaker identification permission", async () => {
    const body = {
      transcriptionConfig: diarConfig(),
      speakerIdentificationCollections: [COLL_ID],
    }
    await expect(
      applySpeakerIdentification(body, makeOrg({ withPermission: false })),
    ).rejects.toThrow(/does not have the speaker identification permission/)
  })

  it("(g) nominal: builds the server-side config and X-Organization-Id header", async () => {
    mockGetById.mockResolvedValue([
      { organizationId: { toString: () => ORG_ID }, qdrantCollectionName: QDRANT_NAME },
    ])
    const body = {
      transcriptionConfig: diarConfig(),
      speakerIdentificationCollections: [COLL_ID],
    }
    const result = await applySpeakerIdentification(body, makeOrg())

    expect(result.enabled).toBe(true)
    const cfg =
      result.transcriptionConfig.diarizationConfig.speakerIdentificationConfig
    expect(cfg.organizationId).toBe(ORG_ID)
    expect(cfg.collections).toEqual([QDRANT_NAME])
    expect(cfg.speakers).toBe("*")
    expect(result.headers["X-Organization-Id"]).toBe(ORG_ID)
    // No token configured -> no token header
    expect(result.headers["X-Speaker-Id-Token"]).toBeUndefined()
    expect(mockGetById).toHaveBeenCalledWith(COLL_ID)
  })

  it("(g2) adds the token header when SPEAKER_ID_API_TOKEN is set", async () => {
    process.env.SPEAKER_ID_API_TOKEN = "secret-token"
    mockGetById.mockResolvedValue([
      { organizationId: { toString: () => ORG_ID }, qdrantCollectionName: QDRANT_NAME },
    ])
    const body = {
      transcriptionConfig: diarConfig(),
      speakerIdentificationCollections: [COLL_ID],
    }
    const result = await applySpeakerIdentification(body, makeOrg())
    expect(result.headers["X-Speaker-Id-Token"]).toBe("secret-token")
  })

  it("(g3) supports multiple collections, mapping each to its qdrant name", async () => {
    const COLL_ID_2 = "11111111111111111111111a"
    const QDRANT_2 = `spkid_${ORG_ID}_${COLL_ID_2}`
    mockGetById.mockImplementation(async (id) => {
      if (id === COLL_ID)
        return [{ organizationId: { toString: () => ORG_ID }, qdrantCollectionName: QDRANT_NAME }]
      return [{ organizationId: { toString: () => ORG_ID }, qdrantCollectionName: QDRANT_2 }]
    })
    const body = {
      transcriptionConfig: diarConfig(),
      speakerIdentificationCollections: [COLL_ID, COLL_ID_2],
    }
    const result = await applySpeakerIdentification(body, makeOrg())
    expect(
      result.transcriptionConfig.diarizationConfig.speakerIdentificationConfig
        .collections,
    ).toEqual([QDRANT_NAME, QDRANT_2])
  })

  it("parses a JSON string transcriptionConfig and a JSON-array collections string", async () => {
    mockGetById.mockResolvedValue([
      { organizationId: { toString: () => ORG_ID }, qdrantCollectionName: QDRANT_NAME },
    ])
    const body = {
      transcriptionConfig: JSON.stringify(diarConfig()),
      speakerIdentificationCollections: JSON.stringify([COLL_ID]),
    }
    const result = await applySpeakerIdentification(body, makeOrg())
    expect(result.enabled).toBe(true)
    expect(
      result.transcriptionConfig.diarizationConfig.speakerIdentificationConfig
        .collections,
    ).toEqual([QDRANT_NAME])
  })
})
