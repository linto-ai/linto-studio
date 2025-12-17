/**
 * WhisperX Export Format Tests - Sprint 11
 *
 * Tests the WhisperX raw JSON export format implementation
 * according to api-contract.md for Sprint 11.
 *
 * Tests verify:
 * - Correct WhisperX JSON structure (segments, words, language)
 * - Speaker mapping to SPEAKER_XX format
 * - Word-level timing and confidence scores
 * - Segment timing calculated from words
 * - Backward compatibility with existing JSON export
 */

// Mock the MongoDB models
const mockGetById = jest.fn()

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: {
    getById: mockGetById,
  },
  conversationExport: {
    getByConvAndFormat: jest.fn().mockResolvedValue([]),
  },
  tags: {
    getByIdList: jest.fn().mockResolvedValue([]),
  },
  categories: {
    getById: jest.fn().mockResolvedValue([]),
  },
}))

jest.mock(`${process.cwd()}/lib/logger/logger.js`, () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

// Sample conversation data matching conv-example.json structure
const createMockConversation = (overrides = {}) => ({
  _id: { toString: () => "62b07202e2d80f12c74a77be" },
  name: "test-conversation",
  description: "Test conversation for WhisperX export",
  lang: "fr",
  speakers: [
    {
      speaker_id: "b1ded461-8e09-46ad-bf34-d6f304af32ec",
      speaker_name: "Speaker One",
      stime: 0.42,
      etime: 2.22,
    },
  ],
  text: [
    {
      speaker_id: "b1ded461-8e09-46ad-bf34-d6f304af32ec",
      turn_id: "06fa527d-e118-4d04-b436-9cb2f1232368",
      raw_segment: "je veux appeler gabonaise sort dit",
      segment: "je veux appeler gabonaise sort dit",
      words: [
        {
          wid: "7fa64fec-5ed4-4cd4-85cc-817321fd5fe5",
          stime: 0.42,
          etime: 0.66,
          word: "je",
          confidence: 1,
        },
        {
          wid: "6db04537-3d12-4ca3-b8ed-e56c62859ce4",
          stime: 0.66,
          etime: 0.87,
          word: "veux",
          confidence: 1,
        },
        {
          wid: "5c0073c5-fed0-447e-9bab-ac6bdb7e1e10",
          stime: 0.87,
          etime: 1.23,
          word: "appeler",
          confidence: 0.925502,
        },
        {
          wid: "7e61d677-c1e1-4182-9926-3a90ced9e737",
          stime: 1.26,
          etime: 1.735276,
          word: "gabonaise",
          confidence: 0.70126,
        },
        {
          wid: "b75187c9-1c89-4e1b-ba6d-1db417f108b3",
          stime: 1.735276,
          etime: 1.95,
          word: "sort",
          confidence: 0.700923,
        },
        {
          wid: "ecf56f07-d351-4b9b-a99a-93759452fcdd",
          stime: 1.95,
          etime: 2.22,
          word: "dit",
          confidence: 0.666191,
        },
      ],
    },
  ],
  transcriptionConfig: { lang: "fr" },
  ...overrides,
})

// Multi-speaker conversation
const createMultiSpeakerConversation = () => ({
  _id: { toString: () => "conv-multi-speaker" },
  name: "multi-speaker-conversation",
  lang: "en",
  speakers: [
    { speaker_id: "spk-001", speaker_name: "Alice" },
    { speaker_id: "spk-002", speaker_name: "Bob" },
    { speaker_id: "spk-003", speaker_name: "Charlie" },
  ],
  text: [
    {
      speaker_id: "spk-001",
      turn_id: "turn-1",
      segment: "Hello everyone",
      words: [
        { word: "Hello", stime: 0.0, etime: 0.5, confidence: 0.95 },
        { word: "everyone", stime: 0.6, etime: 1.2, confidence: 0.92 },
      ],
    },
    {
      speaker_id: "spk-002",
      turn_id: "turn-2",
      segment: "Hi Alice",
      words: [
        { word: "Hi", stime: 1.5, etime: 1.8, confidence: 0.98 },
        { word: "Alice", stime: 1.9, etime: 2.3, confidence: 0.90 },
      ],
    },
    {
      speaker_id: "spk-003",
      turn_id: "turn-3",
      segment: "Good morning",
      words: [
        { word: "Good", stime: 2.5, etime: 2.8, confidence: 0.88 },
        { word: "morning", stime: 2.9, etime: 3.5, confidence: 0.91 },
      ],
    },
    {
      speaker_id: "spk-001",
      turn_id: "turn-4",
      segment: "How are you",
      words: [
        { word: "How", stime: 4.0, etime: 4.2, confidence: 0.93 },
        { word: "are", stime: 4.3, etime: 4.5, confidence: 0.89 },
        { word: "you", stime: 4.6, etime: 4.9, confidence: 0.94 },
      ],
    },
  ],
  transcriptionConfig: {},
})

// Helper to setup mock for WhisperX export
// The export function calls getById twice:
// 1. First in exportConversation to load initial data
// 2. Second in handleWhisperXFormat to get raw data with words
// IMPORTANT: We use a factory function to return fresh copies because prepateData mutates the conversation object
const setupMockForWhisperX = (conversationFactory) => {
  // Return a fresh copy of conversation for each call to prevent mutation issues
  mockGetById.mockImplementation(() => {
    const freshConversation = typeof conversationFactory === 'function'
      ? conversationFactory()
      : JSON.parse(JSON.stringify(conversationFactory))
    // Restore the _id object structure that JSON.stringify loses
    if (typeof freshConversation._id === 'string') {
      const idValue = freshConversation._id
      freshConversation._id = { toString: () => idValue }
    }
    return Promise.resolve([freshConversation])
  })
}

describe("WhisperX Export Format - Sprint 11", () => {
  let mockRes
  let sendSpy
  let setHeaderSpy
  let exportModule

  beforeAll(() => {
    // Load module once
    exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sendSpy = jest.fn()
    setHeaderSpy = jest.fn()
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: sendSpy,
      setHeader: setHeaderSpy,
    }
  })

  describe("handleWhisperXFormat function", () => {
    it("[CONTRACT] should return valid WhisperX JSON structure", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }
      const mockNext = jest.fn()

      await exportModule.exportConversation(mockReq, mockRes, mockNext)

      // Verify Content-Type header
      expect(setHeaderSpy).toHaveBeenCalledWith(
        "Content-Type",
        "application/json"
      )

      // Verify response status
      expect(mockRes.status).toHaveBeenCalledWith(200)

      // Verify WhisperX structure
      expect(sendSpy).toHaveBeenCalled()
      const output = sendSpy.mock.calls[0][0]

      expect(output).toHaveProperty("segments")
      expect(output).toHaveProperty("language")
      expect(Array.isArray(output.segments)).toBe(true)
    })

    it("[CONTRACT] should include segments with required fields", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      const segment = output.segments[0]

      // Per api-contract.md, each segment must have:
      expect(segment).toHaveProperty("start")
      expect(segment).toHaveProperty("end")
      expect(segment).toHaveProperty("text")
      expect(segment).toHaveProperty("speaker")
      expect(segment).toHaveProperty("words")

      // Types should match contract
      expect(typeof segment.start).toBe("number")
      expect(typeof segment.end).toBe("number")
      expect(typeof segment.text).toBe("string")
      expect(typeof segment.speaker).toBe("string")
      expect(Array.isArray(segment.words)).toBe(true)
    })

    it("[CONTRACT] should include word-level data with timing and confidence", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      expect(output.segments).toBeDefined()
      expect(output.segments.length).toBeGreaterThan(0)
      expect(output.segments[0].words).toBeDefined()
      expect(output.segments[0].words.length).toBeGreaterThan(0)

      const word = output.segments[0].words[0]

      // Per api-contract.md, each word must have:
      expect(word).toHaveProperty("word")
      expect(word).toHaveProperty("start")
      expect(word).toHaveProperty("end")
      expect(word).toHaveProperty("score")
      expect(word).toHaveProperty("speaker")

      // Types
      expect(typeof word.word).toBe("string")
      expect(typeof word.start).toBe("number")
      expect(typeof word.end).toBe("number")
      expect(typeof word.score).toBe("number")
      expect(typeof word.speaker).toBe("string")
    })

    it("[CONTRACT] should map speakers to SPEAKER_XX format", async () => {
      setupMockForWhisperX(createMultiSpeakerConversation)

      const mockReq = {
        params: { conversationId: "conv-multi-speaker" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]

      // Verify speaker format: SPEAKER_XX (zero-padded)
      const speakerLabels = output.segments.map((s) => s.speaker)
      expect(speakerLabels).toContain("SPEAKER_00")
      expect(speakerLabels).toContain("SPEAKER_01")
      expect(speakerLabels).toContain("SPEAKER_02")

      // Verify word speakers match segment speakers
      output.segments.forEach((segment) => {
        segment.words.forEach((word) => {
          expect(word.speaker).toBe(segment.speaker)
        })
      })
    })

    it("[CONTRACT] should maintain speaker consistency across segments", async () => {
      setupMockForWhisperX(createMultiSpeakerConversation)

      const mockReq = {
        params: { conversationId: "conv-multi-speaker" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]

      // Speaker spk-001 (Alice) appears in segments 0 and 3
      // Should both map to SPEAKER_00
      expect(output.segments[0].speaker).toBe("SPEAKER_00") // Alice
      expect(output.segments[1].speaker).toBe("SPEAKER_01") // Bob
      expect(output.segments[2].speaker).toBe("SPEAKER_02") // Charlie
      expect(output.segments[3].speaker).toBe("SPEAKER_00") // Alice again
    })

    it("[CONTRACT] should calculate segment timing from words", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      const segment = output.segments[0]

      // Per api-contract.md:
      // segment.start = min(words[].start) = 0.42
      // segment.end = max(words[].end) = 2.22
      expect(segment.start).toBe(0.42)
      expect(segment.end).toBe(2.22)
    })

    it("[CONTRACT] should use corrected text (segment) not raw_segment", async () => {
      setupMockForWhisperX(() => createMockConversation({
        text: [
          {
            speaker_id: "b1ded461-8e09-46ad-bf34-d6f304af32ec",
            raw_segment: "original raw text",
            segment: "corrected text with edits",
            words: [
              { word: "corrected", stime: 0, etime: 0.5, confidence: 1 },
              { word: "text", stime: 0.5, etime: 1, confidence: 1 },
            ],
          },
        ],
      }))

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]

      // Should use segment (corrected text) not raw_segment
      expect(output.segments[0].text).toBe("corrected text with edits")
      expect(output.segments[0].text).not.toBe("original raw text")
    })

    it("[CONTRACT] should include language field from conversation", async () => {
      setupMockForWhisperX(() => createMockConversation({ lang: "fr" }))

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      expect(output.language).toBe("fr")
    })

    it("[CONTRACT] should fallback to transcriptionConfig.lang if lang is null", async () => {
      setupMockForWhisperX(() => createMockConversation({
        lang: null,
        transcriptionConfig: { lang: "en" },
      }))

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      expect(output.language).toBe("en")
    })

    it("[CONTRACT] should return 'unknown' if no language available", async () => {
      setupMockForWhisperX(() => createMockConversation({
        lang: null,
        transcriptionConfig: {},
      }))

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      expect(output.language).toBe("unknown")
    })

    it("[CONTRACT] should default confidence score to 1.0 when missing", async () => {
      setupMockForWhisperX(() => createMockConversation({
        text: [
          {
            speaker_id: "b1ded461-8e09-46ad-bf34-d6f304af32ec",
            segment: "test words",
            words: [
              { word: "test", stime: 0, etime: 0.5, confidence: null },
              { word: "words", stime: 0.5, etime: 1 }, // no confidence field
            ],
          },
        ],
      }))

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      const words = output.segments[0].words

      // Both should default to 1.0
      expect(words[0].score).toBe(1.0)
      expect(words[1].score).toBe(1.0)
    })

    it("[CONTRACT] should include segments with empty words array", async () => {
      // Test that segments with empty words arrays are included with fallback timing
      // Create a conversation with one normal segment and one with empty words
      setupMockForWhisperX(() => createMockConversation({
        text: [
          {
            speaker_id: "b1ded461-8e09-46ad-bf34-d6f304af32ec",
            segment: "first segment",
            words: [
              { word: "first", stime: 0, etime: 0.5, confidence: 1 },
              { word: "segment", stime: 0.5, etime: 1, confidence: 1 },
            ],
          },
          {
            speaker_id: "b1ded461-8e09-46ad-bf34-d6f304af32ec",
            segment: "segment without words",
            stime: 2,
            etime: 3,
            words: [],
          },
        ],
      }))

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]

      // First segment should have words
      expect(output.segments[0].words.length).toBeGreaterThan(0)

      // Second segment should have empty words array with fallback timing
      expect(output.segments[1].text).toBe("segment without words")
      expect(output.segments[1].start).toBe(2)
      expect(output.segments[1].end).toBe(3)
      expect(output.segments[1].words).toEqual([])
    })

    it("[CONTRACT] should return 404 for non-existent conversation", async () => {
      mockGetById.mockResolvedValue([])

      const mockReq = {
        params: { conversationId: "non-existent-id" },
        query: { format: "whisperx" },
        body: {},
      }
      const mockNext = jest.fn()

      await exportModule.exportConversation(mockReq, mockRes, mockNext)

      // Should call next with ConversationNotFound error
      expect(mockNext).toHaveBeenCalled()
      const error = mockNext.mock.calls[0][0]
      expect(error).toBeDefined()
    })
  })

  describe("Backward Compatibility - JSON export", () => {
    it("[CONTRACT] should still support existing JSON export format", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "json" },
        body: {
          metadata: { description: true, tags: true, speakers: true },
        },
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]

      // JSON format should have different structure than WhisperX
      expect(output).toHaveProperty("text")
      expect(output).not.toHaveProperty("segments")
      expect(output).not.toHaveProperty("language")
    })

    it("[CONTRACT] should differentiate JSON and WhisperX exports", async () => {
      // Test JSON format
      setupMockForWhisperX(createMockConversation)
      const jsonReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "json" },
        body: {},
      }

      await exportModule.exportConversation(jsonReq, mockRes, jest.fn())
      const jsonOutput = sendSpy.mock.calls[0][0]

      // Reset for WhisperX
      sendSpy.mockClear()
      setupMockForWhisperX(createMockConversation)

      const whisperxReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(whisperxReq, mockRes, jest.fn())
      const whisperxOutput = sendSpy.mock.calls[0][0]

      // Structures should be different
      expect(jsonOutput).not.toEqual(whisperxOutput)
      expect(whisperxOutput).toHaveProperty("segments")
      expect(whisperxOutput).toHaveProperty("language")
      expect(jsonOutput).toHaveProperty("text")
    })
  })

  describe("Data Integrity", () => {
    it("should preserve all word timing data accurately", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      const words = output.segments[0].words

      // Verify exact timing values from input
      expect(words[0].start).toBe(0.42)
      expect(words[0].end).toBe(0.66)
      expect(words[1].start).toBe(0.66)
      expect(words[1].end).toBe(0.87)
    })

    it("should preserve confidence scores with full precision", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      const words = output.segments[0].words

      // Verify exact confidence values
      expect(words[2].score).toBe(0.925502)
      expect(words[3].score).toBe(0.70126)
      expect(words[4].score).toBe(0.700923)
      expect(words[5].score).toBe(0.666191)
    })

    it("should handle segments with undefined words gracefully", async () => {
      // Create a conversation with one normal segment and one with undefined words
      setupMockForWhisperX(() => createMockConversation({
        text: [
          {
            speaker_id: "b1ded461-8e09-46ad-bf34-d6f304af32ec",
            segment: "normal segment",
            words: [
              { word: "normal", stime: 0, etime: 0.5, confidence: 1 },
              { word: "segment", stime: 0.5, etime: 1, confidence: 1 },
            ],
          },
          {
            speaker_id: "b1ded461-8e09-46ad-bf34-d6f304af32ec",
            segment: "segment with undefined words",
            stime: 2,
            etime: 3,
            // words is undefined
          },
        ],
      }))

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      // Should not throw and should return 200
      expect(mockRes.status).toHaveBeenCalledWith(200)

      const output = sendSpy.mock.calls[0][0]

      // First segment should have words
      expect(output.segments[0].words.length).toBe(2)

      // Second segment should have empty words array (undefined converted to [])
      expect(output.segments[1].words).toEqual([])
    })
  })

  describe("Error Handling", () => {
    it("should return 204 for conversation with empty text after filtering", async () => {
      setupMockForWhisperX(createMockConversation)

      // Use a speaker filter that matches no segments
      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {
          filter: { speaker: "non-existent-speaker", keyword: "" },
        },
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      expect(mockRes.status).toHaveBeenCalledWith(204)
    })
  })

  describe("TypeScript Interface Compliance", () => {
    it("should match WhisperXOutput interface", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]

      // WhisperXOutput interface compliance
      expect(typeof output.language).toBe("string")
      expect(Array.isArray(output.segments)).toBe(true)

      // WhisperXSegment interface compliance
      const segment = output.segments[0]
      expect(typeof segment.start).toBe("number")
      expect(typeof segment.end).toBe("number")
      expect(typeof segment.text).toBe("string")
      expect(typeof segment.speaker).toBe("string")
      expect(Array.isArray(segment.words)).toBe(true)

      // WhisperXWord interface compliance
      const word = segment.words[0]
      expect(typeof word.word).toBe("string")
      expect(typeof word.start).toBe("number")
      expect(typeof word.end).toBe("number")
      expect(typeof word.score).toBe("number")
      expect(typeof word.speaker).toBe("string")
    })

    it("should have score in 0.0-1.0 range", async () => {
      setupMockForWhisperX(createMockConversation)

      const mockReq = {
        params: { conversationId: "62b07202e2d80f12c74a77be" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]

      // Verify all scores are within valid range
      output.segments.forEach((segment) => {
        segment.words.forEach((word) => {
          expect(word.score).toBeGreaterThanOrEqual(0.0)
          expect(word.score).toBeLessThanOrEqual(1.0)
        })
      })
    })

    it("should have speaker in SPEAKER_XX format", async () => {
      setupMockForWhisperX(createMultiSpeakerConversation)

      const mockReq = {
        params: { conversationId: "conv-multi-speaker" },
        query: { format: "whisperx" },
        body: {},
      }

      await exportModule.exportConversation(mockReq, mockRes, jest.fn())

      const output = sendSpy.mock.calls[0][0]
      const speakerPattern = /^SPEAKER_\d{2}$/

      output.segments.forEach((segment) => {
        expect(segment.speaker).toMatch(speakerPattern)
        segment.words.forEach((word) => {
          expect(word.speaker).toMatch(speakerPattern)
        })
      })
    })
  })
})
