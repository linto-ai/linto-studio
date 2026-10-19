// Placeholder speakers (defined === false) are rendered with a label in the
// interface language in human-readable exports; data exports stay raw.

const mockGetById = jest.fn()

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { getById: mockGetById },
  conversationExport: { getByConvAndFormat: jest.fn().mockResolvedValue([]) },
  tags: { getByIdList: jest.fn().mockResolvedValue([]) },
  categories: { getById: jest.fn().mockResolvedValue([]) },
}))

jest.mock(`${process.cwd()}/lib/logger/logger.js`, () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

const mockGenerateVerbatimDocx = jest.fn()
jest.mock(`${process.cwd()}/components/WebServer/controllers/export/docx`, () => ({
  generateVerbatimDocx: mockGenerateVerbatimDocx,
  generateDocxOnFormat: jest.fn(),
  convertToPDF: jest.fn(),
}))

const exportModule = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/export`,
)

function createConversation() {
  return {
    _id: { toString: () => "conv-1" },
    name: "Meeting",
    speakers: [
      { speaker_id: "id-1", speaker_name: "spk02", defined: false },
      { speaker_id: "id-2", speaker_name: "Marie", defined: true },
      // Legacy speaker without the flag: a real name.
      { speaker_id: "id-3", speaker_name: "speaker3" },
    ],
    text: [
      { turn_id: "t1", speaker_id: "id-1", segment: "hello", stime: 0.5, etime: 1 },
      { turn_id: "t2", speaker_id: "id-2", segment: "hi", stime: 1, etime: 2 },
      { turn_id: "t3", speaker_id: "id-3", segment: "hey", stime: 2, etime: 3 },
    ],
  }
}

function makeRes() {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    setHeader: jest.fn(),
    sendFile: jest.fn(),
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetById.mockImplementation(() => Promise.resolve([createConversation()]))
  mockGenerateVerbatimDocx.mockResolvedValue({ path: "/tmp/x.docx", name: "x" })
})

test("text export labels placeholders in the requested locale", async () => {
  const res = makeRes()
  await exportModule.exportConversation(
    {
      params: { conversationId: "conv-1" },
      query: { format: "text", locale: "fr-FR" },
      body: {},
    },
    res,
    jest.fn(),
  )

  const output = res.send.mock.calls[0][0]
  expect(output).toContain("Intervenant 2 : ")
  expect(output).toContain("Marie : ")
  expect(output).toContain("speaker3 : ")
  expect(output).not.toContain("spk02")
})

test("docx/verbatim export gets localized turns, after the speaker filter", async () => {
  const res = makeRes()
  await exportModule.exportConversation(
    {
      params: { conversationId: "conv-1" },
      query: { format: "verbatim", locale: "en-US" },
      body: { filter: { speaker: ["id-1", "id-2"] } },
    },
    res,
    jest.fn(),
  )

  const [, conversation, metadata] = mockGenerateVerbatimDocx.mock.calls[0]
  expect(conversation.text.map((t) => t.speaker_name)).toEqual([
    "Speaker 2",
    "Marie",
  ])
  expect(metadata.speakers).toEqual(["Speaker 2", "Marie", "speaker3"])
})

test("JSON export keeps the stored names", async () => {
  const res = makeRes()
  await exportModule.exportConversation(
    {
      params: { conversationId: "conv-1" },
      query: { format: "json", locale: "fr-FR" },
      body: {},
    },
    res,
    jest.fn(),
  )

  const output = res.send.mock.calls[0][0]
  expect(output.text.map((t) => t.speaker_name)).toEqual([
    "spk02",
    "Marie",
    "speaker3",
  ])
  expect(output.metadata.speakers).toEqual(["spk02", "Marie", "speaker3"])
})
