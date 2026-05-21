import { jest } from "@jest/globals"
import { SummaryPollingService } from "../src/services/summaryPollingService.js"

/**
 * Helper: build a fake StudioApiService whose getExportList returns the next
 * payload from a queue, and whose getExportContent returns a fixed content.
 */
function createFakeApiService({
  exportsQueue = [],
  content = { text: "summary content" },
} = {}) {
  let idx = 0
  return {
    getExportList: jest.fn(async () => {
      const payload =
        idx < exportsQueue.length
          ? exportsQueue[idx]
          : exportsQueue[exportsQueue.length - 1]
      idx += 1
      if (payload instanceof Error) {
        throw payload
      }
      return payload
    }),
    getExportContent: jest.fn(async () => content),
  }
}

/**
 * Advance fake timers and flush microtasks so async callbacks settle.
 */
async function tick(ms = 2000, iterations = 1) {
  for (let i = 0; i < iterations; i++) {
    jest.advanceTimersByTime(ms)
    for (let j = 0; j < 10; j++) {
      await Promise.resolve()
    }
  }
}

describe("SummaryPollingService", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  test("emits 'update' on each tick while the matching export is not finished", async () => {
    const api = createFakeApiService({
      exportsQueue: [
        [{ format: "summary/short", status: "processing", progress: 10 }],
        [{ format: "summary/short", status: "processing", progress: 60 }],
        [{ format: "summary/short", status: "processing", progress: 90 }],
      ],
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const updates = []
    poller.addEventListener("update", (e) => updates.push(e.detail))

    await tick(2000, 3)

    expect(api.getExportList).toHaveBeenCalledTimes(3)
    expect(api.getExportList).toHaveBeenCalledWith({ conversationId: "conv-1" })
    expect(updates).toHaveLength(3)
    expect(updates[0].progress).toBe(10)
    expect(updates[2].progress).toBe(90)

    poller.stop()
  })

  test("waits when no matching export is present yet (no emit)", async () => {
    const api = createFakeApiService({
      exportsQueue: [[], [{ format: "other", status: "processing" }]],
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const updateHandler = jest.fn()
    const doneHandler = jest.fn()
    const errorHandler = jest.fn()
    poller.addEventListener("update", updateHandler)
    poller.addEventListener("done", doneHandler)
    poller.addEventListener("error", errorHandler)

    await tick(2000, 2)

    expect(updateHandler).not.toHaveBeenCalled()
    expect(doneHandler).not.toHaveBeenCalled()
    expect(errorHandler).not.toHaveBeenCalled()
    poller.stop()
  })

  test("emits 'done' with {content, jobId} when status is 'complete' and auto-stops", async () => {
    const api = createFakeApiService({
      exportsQueue: [
        [{ format: "summary/short", status: "processing" }],
        [
          {
            format: "summary/short",
            status: "complete",
            jobId: "job-42",
          },
        ],
      ],
      content: { text: "final summary" },
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const doneHandler = jest.fn()
    poller.addEventListener("done", doneHandler)

    await tick(2000, 2)

    expect(doneHandler).toHaveBeenCalledTimes(1)
    expect(doneHandler.mock.calls[0][0].detail).toEqual({
      content: { text: "final summary" },
      jobId: "job-42",
    })
    expect(api.getExportContent).toHaveBeenCalledWith({
      conversationId: "conv-1",
      jobId: "job-42",
    })

    const callsAfterDone = api.getExportList.mock.calls.length
    await tick(2000, 4)
    expect(api.getExportList.mock.calls.length).toBe(callsAfterDone)
  })

  test("emits 'done' with status 'done' as well (Python parity)", async () => {
    const api = createFakeApiService({
      exportsQueue: [
        [{ format: "summary/short", status: "done", jobId: "job-7" }],
      ],
      content: "raw content",
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const doneHandler = jest.fn()
    poller.addEventListener("done", doneHandler)

    await tick(2000, 1)

    expect(doneHandler).toHaveBeenCalledTimes(1)
    expect(doneHandler.mock.calls[0][0].detail.jobId).toBe("job-7")
    expect(doneHandler.mock.calls[0][0].detail.content).toBe("raw content")
  })

  test("emits 'done' with jobId=null and content=export when no jobId", async () => {
    const exportEntry = { format: "summary/short", status: "complete" }
    const api = createFakeApiService({
      exportsQueue: [[exportEntry]],
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const doneHandler = jest.fn()
    poller.addEventListener("done", doneHandler)

    await tick(2000, 1)

    expect(doneHandler).toHaveBeenCalledTimes(1)
    expect(doneHandler.mock.calls[0][0].detail).toEqual({
      content: exportEntry,
      jobId: null,
    })
    expect(api.getExportContent).not.toHaveBeenCalled()
  })

  test("emits 'error' when status is 'error' and stops automatically", async () => {
    const errExport = {
      format: "summary/short",
      status: "error",
      reason: "llm failed",
    }
    const api = createFakeApiService({
      exportsQueue: [[errExport]],
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const errorHandler = jest.fn()
    poller.addEventListener("error", errorHandler)

    await tick(2000, 1)

    expect(errorHandler).toHaveBeenCalledTimes(1)
    expect(errorHandler.mock.calls[0][0].detail).toEqual(errExport)

    const callsAfterError = api.getExportList.mock.calls.length
    await tick(2000, 3)
    expect(api.getExportList.mock.calls.length).toBe(callsAfterError)
  })

  test("emits 'error' and stops if the API throws", async () => {
    const apiError = new Error("network down")
    const api = createFakeApiService({ exportsQueue: [apiError] })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const errorHandler = jest.fn()
    poller.addEventListener("error", errorHandler)

    await tick(2000, 1)

    expect(errorHandler).toHaveBeenCalledTimes(1)
    expect(errorHandler.mock.calls[0][0].detail).toBe(apiError)

    const callsAfterError = api.getExportList.mock.calls.length
    await tick(2000, 3)
    expect(api.getExportList.mock.calls.length).toBe(callsAfterError)
  })

  test(".stop() clears the interval and is idempotent", async () => {
    const api = createFakeApiService({
      exportsQueue: [[{ format: "summary/short", status: "processing" }]],
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)

    await tick(2000, 2)
    const callsBeforeStop = api.getExportList.mock.calls.length
    expect(callsBeforeStop).toBeGreaterThan(0)

    expect(() => poller.stop()).not.toThrow()
    expect(() => poller.stop()).not.toThrow()
    expect(() => poller.stop()).not.toThrow()

    await tick(2000, 5)
    expect(api.getExportList.mock.calls.length).toBe(callsBeforeStop)
  })

  test(".stop() dispatches 'cancelled' once and only once", async () => {
    const api = createFakeApiService({
      exportsQueue: [[{ format: "summary/short", status: "processing" }]],
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const cancelledHandler = jest.fn()
    poller.addEventListener("cancelled", cancelledHandler)

    poller.stop()
    poller.stop()
    poller.stop()

    expect(cancelledHandler).toHaveBeenCalledTimes(1)
  })

  test("auto-stop after 'done' does NOT emit 'cancelled'", async () => {
    const api = createFakeApiService({
      exportsQueue: [
        [{ format: "summary/short", status: "complete", jobId: "j" }],
      ],
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const cancelledHandler = jest.fn()
    poller.addEventListener("cancelled", cancelledHandler)

    await tick(2000, 1)

    expect(cancelledHandler).not.toHaveBeenCalled()
  })

  test("filters exports by serviceRoute (format field)", async () => {
    const target = {
      format: "summary/short",
      status: "complete",
      jobId: "job-z",
    }
    const api = createFakeApiService({
      exportsQueue: [
        [
          { format: "summary/long", status: "complete", jobId: "other-job" },
          { format: "docx", status: "complete", jobId: "docx-job" },
          target,
        ],
      ],
      content: "right content",
    })

    const poller = new SummaryPollingService("conv-1", "summary/short", api)
    const doneHandler = jest.fn()
    poller.addEventListener("done", doneHandler)

    await tick(2000, 1)

    expect(doneHandler).toHaveBeenCalledTimes(1)
    expect(doneHandler.mock.calls[0][0].detail.jobId).toBe("job-z")
    expect(api.getExportContent).toHaveBeenCalledWith({
      conversationId: "conv-1",
      jobId: "job-z",
    })
  })
})
