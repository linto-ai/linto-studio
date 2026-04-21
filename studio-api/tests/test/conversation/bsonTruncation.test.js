const { calculateObjectSize } = require("bson")
const { v4: uuidv4 } = require("uuid")

const BSON_MAX_SIZE = 16 * 1024 * 1024

function generateTurn() {
  return {
    speaker_id: uuidv4(),
    turn_id: uuidv4(),
    raw_segment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(5),
    segment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(5),
    stime: Math.random() * 10000,
    etime: Math.random() * 10000,
    lang: "en",
    words: Array.from({ length: 40 }, () => ({
      wid: uuidv4(),
      word: "lorem",
    })),
  }
}

function buildConversation(turnCount) {
  return {
    name: "Test conversation",
    owner: uuidv4(),
    locale: "en",
    organization: { organizationId: uuidv4(), membersRight: 1 },
    speakers: [{ speaker_id: uuidv4(), speaker_name: "Speaker 1" }],
    text: Array.from({ length: turnCount }, () => generateTurn()),
    metadata: {},
    tags: [],
  }
}

function truncateIfNeeded(conversation) {
  if (conversation.text?.length > 0) {
    let docSize = calculateObjectSize(conversation)
    if (docSize > BSON_MAX_SIZE) {
      const originalCount = conversation.text.length
      while (docSize > BSON_MAX_SIZE && conversation.text.length > 0) {
        conversation.text = conversation.text.slice(
          0,
          Math.floor(conversation.text.length * 0.8),
        )
        docSize = calculateObjectSize(conversation)
      }
      return { truncated: true, originalCount, finalCount: conversation.text.length }
    }
  }
  return { truncated: false }
}

describe("BSON truncation for oversized conversations", () => {
  it("should not truncate a conversation within the 16MB limit", () => {
    const conversation = buildConversation(100)
    const result = truncateIfNeeded(conversation)

    expect(result.truncated).toBe(false)
    expect(conversation.text.length).toBe(100)
    expect(calculateObjectSize(conversation)).toBeLessThan(BSON_MAX_SIZE)
  })

  it("should truncate a conversation that exceeds the 16MB limit", () => {
    const conversation = buildConversation(15000)
    const sizeBefore = calculateObjectSize(conversation)

    expect(sizeBefore).toBeGreaterThan(BSON_MAX_SIZE)

    const result = truncateIfNeeded(conversation)

    expect(result.truncated).toBe(true)
    expect(result.originalCount).toBe(15000)
    expect(conversation.text.length).toBeLessThan(15000)
    expect(calculateObjectSize(conversation)).toBeLessThan(BSON_MAX_SIZE)
  })

  it("should keep as many turns as possible after truncation", () => {
    const conversation = buildConversation(15000)
    truncateIfNeeded(conversation)

    // After truncation, the document should be close to but under 16MB
    const finalSize = calculateObjectSize(conversation)
    expect(finalSize).toBeLessThan(BSON_MAX_SIZE)
    expect(conversation.text.length).toBeGreaterThan(2000)
  })
})
