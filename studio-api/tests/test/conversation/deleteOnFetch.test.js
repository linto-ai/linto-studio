// A conversation created with deleteOnFetch is given once: it is deleted after
// the fetch of the whole conversation, once its transcription is over.

const { EventEmitter } = require("events")

jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({ error: jest.fn() }))

let mockStored

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: {
    getById: jest.fn(async () => (mockStored ? [mockStored] : [])),
    getByIdWithFilter: jest.fn(async () => (mockStored ? [mockStored] : [])),
    create: jest.fn(async () => ({ insertedId: "copy-1" })),
  },
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/utility`,
  () => ({
    getUserRightFromConversation: jest.fn(async () => ({
      access: 1,
      personal: false,
    })),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({ deleteConversationCascade: jest.fn(async () => {}) }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
  () => ({ fetchJob: jest.fn(async () => {}) }),
)
for (const dep of [
  "controllers/user/utility",
  "middlewares/access/conversation",
]) {
  jest.mock(`${process.cwd()}/components/WebServer/${dep}`, () => ({}))
}

const model = require(`${process.cwd()}/lib/mongodb/models`)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const { deleteConversationCascade } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)
const { fetchJob } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)
const { getConversation, duplicateConversation } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation`,
)

function stored(state, overrides = {}) {
  return {
    _id: "conv-1",
    name: "meeting",
    deleteOnFetch: true,
    type: { mode: "canonical", child_conversations: [] },
    text: [{ turn_id: "turn-1", segment: "hello" }],
    metadata: { audio: { filepath: "audios/first.mp3", duration: 12.5 } },
    jobs: { transcription: { job_id: "job-1", state } },
    ...overrides,
  }
}

function request(query = {}) {
  return {
    params: { conversationId: "conv-1" },
    payload: { data: { userId: "user-1" } },
    query,
  }
}

async function fetch(query) {
  const res = new EventEmitter()
  res.status = jest.fn(() => res)
  res.send = jest.fn(() => res)
  const next = jest.fn()
  await getConversation(request(query), res, next)
  return { res, next }
}

// The deletion follows the answer, nothing waits for it
async function written(res) {
  res.emit("finish")
  await new Promise(setImmediate)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockStored = undefined
})

describe("fetch of a conversation created with deleteOnFetch", () => {
  test("is answered whole, then deleted once the answer is written out", async () => {
    mockStored = stored("done")

    const { res, next } = await fetch()

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({
      ...mockStored,
      userAccess: 1,
      personal: false,
    })
    expect(deleteConversationCascade).not.toHaveBeenCalled()

    await written(res)

    expect(deleteConversationCascade).toHaveBeenCalledTimes(1)
    expect(deleteConversationCascade).toHaveBeenCalledWith(mockStored)
  })

  test("a failed transcription is a final state too", async () => {
    mockStored = stored("error")

    const { res } = await fetch()
    await written(res)

    expect(deleteConversationCascade).toHaveBeenCalledWith(mockStored)
  })

  test.each([["pending"], ["started"], [undefined]])(
    "is kept while its transcription is %p",
    async (state) => {
      mockStored = stored(state)

      const { res } = await fetch()
      await written(res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(deleteConversationCascade).not.toHaveBeenCalled()
    },
  )

  test("its job is polled by the fetch, nothing else watches it", async () => {
    mockStored = stored("pending")

    await fetch()

    expect(fetchJob).toHaveBeenCalledWith("conv-1", mockStored.jobs)
  })

  test("is kept when only some keys are fetched", async () => {
    mockStored = stored("done")

    const { res } = await fetch({ key: "jobs" })
    await written(res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(deleteConversationCascade).not.toHaveBeenCalled()
  })

  test("is kept when the answer is never written out", async () => {
    mockStored = stored("done")

    const { res } = await fetch()
    res.emit("close")
    await new Promise(setImmediate)

    expect(deleteConversationCascade).not.toHaveBeenCalled()
  })

  test("a deletion that fails is logged and leaves the answer as it is", async () => {
    mockStored = stored("done")
    deleteConversationCascade.mockRejectedValueOnce(new Error("disk is gone"))

    const { res, next } = await fetch()
    await written(res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(next).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("disk is gone"),
    )
  })

  test("is not found once a concurrent fetch deleted it", async () => {
    model.conversations.getById
      .mockResolvedValueOnce([stored("done")])
      .mockResolvedValueOnce([])

    const { res, next } = await fetch()

    expect(next.mock.calls[0][0]).toMatchObject({ status: 404 })
    expect(res.send).not.toHaveBeenCalled()
    expect(deleteConversationCascade).not.toHaveBeenCalled()
  })
})

describe("fetch of a regular conversation", () => {
  test.each([["done"], ["error"]])(
    "is never deleted, transcription %p",
    async (state) => {
      mockStored = stored(state, { deleteOnFetch: undefined })

      const { res } = await fetch()
      await written(res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(deleteConversationCascade).not.toHaveBeenCalled()
    },
  )
})

describe("duplicate of a conversation created with deleteOnFetch", () => {
  test("the copy is a regular conversation", async () => {
    mockStored = stored("done")
    const res = { status: jest.fn(() => res), send: jest.fn() }
    const next = jest.fn()

    await duplicateConversation(request(), res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    const copy = model.conversations.create.mock.calls[0][0]
    expect(copy).not.toHaveProperty("deleteOnFetch")
    expect(copy.name).toBe("meeting (copy)")
  })
})
