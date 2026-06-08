import { jest } from "@jest/globals"
import { PollingService } from "../src/services/pollingService.js"

/**
 * Helper: build a fake StudioApiService whose getMediaStatus returns the next
 * state from a queue, and whose getMedia returns a fixed media object.
 */
function createFakeApiService({ statuses = [], media = { id: "media-1" } } = {}) {
  let idx = 0
  return {
    getMediaStatus: jest.fn(async () => {
      const state = idx < statuses.length ? statuses[idx] : statuses[statuses.length - 1]
      idx += 1
      if (state instanceof Error) {
        throw state
      }
      return { jobs: { transcription: state } }
    }),
    getMedia: jest.fn(async () => media),
  }
}

/**
 * Advance fake timers and flush all microtasks pending after each tick. We
 * cannot simply call jest.advanceTimersByTime() because the setInterval
 * callback awaits async work; we need to let those promises settle.
 */
async function tick(ms = 1000, iterations = 1) {
  for (let i = 0; i < iterations; i++) {
    jest.advanceTimersByTime(ms)
    // Flush pending promise jobs. A few macrotask/microtask flushes are
    // needed because the callback chains multiple awaits.
    for (let j = 0; j < 5; j++) {
      await Promise.resolve()
    }
  }
}

describe("PollingService", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  test("emits 'update' on each tick while the job is not finished", async () => {
    const api = createFakeApiService({
      statuses: [
        { state: "processing", progress: 10 },
        { state: "processing", progress: 50 },
        { state: "processing", progress: 80 },
      ],
    })
    const poller = new PollingService("media-1", api)

    const updates = []
    poller.addEventListener("update", (e) => updates.push(e.detail))

    await tick(1000, 3)

    expect(api.getMediaStatus).toHaveBeenCalledTimes(3)
    expect(updates).toHaveLength(3)
    expect(updates[0]).toEqual({ state: "processing", progress: 10 })
    expect(updates[2]).toEqual({ state: "processing", progress: 80 })

    poller.stop()
  })

  test("emits 'done' with the media and stops polling automatically", async () => {
    const media = { id: "media-1", fullText: "hello world" }
    const api = createFakeApiService({
      statuses: [{ state: "processing" }, { state: "done" }],
      media,
    })
    const poller = new PollingService("media-1", api)

    const doneHandler = jest.fn()
    poller.addEventListener("done", doneHandler)

    await tick(1000, 2)

    expect(doneHandler).toHaveBeenCalledTimes(1)
    expect(doneHandler.mock.calls[0][0].detail).toBe(media)
    expect(api.getMedia).toHaveBeenCalledTimes(1)

    // Calls before the done state count + the done tick itself.
    const statusCallsAfterDone = api.getMediaStatus.mock.calls.length

    // Advance further; no more polling should happen.
    await tick(1000, 5)
    expect(api.getMediaStatus.mock.calls.length).toBe(statusCallsAfterDone)
  })

  test("emits 'error' when job.state == 'error' and stops automatically", async () => {
    const errorJob = { state: "error", reason: "asr failed" }
    const api = createFakeApiService({
      statuses: [{ state: "processing" }, errorJob],
    })
    const poller = new PollingService("media-1", api)

    const errorHandler = jest.fn()
    poller.addEventListener("error", errorHandler)

    await tick(1000, 2)

    expect(errorHandler).toHaveBeenCalledTimes(1)
    expect(errorHandler.mock.calls[0][0].detail).toEqual(errorJob)

    const callsAfterError = api.getMediaStatus.mock.calls.length
    await tick(1000, 3)
    expect(api.getMediaStatus.mock.calls.length).toBe(callsAfterError)
  })

  test("emits 'error' and stops if the API throws", async () => {
    const apiError = new Error("network down")
    const api = createFakeApiService({
      statuses: [apiError],
    })
    const poller = new PollingService("media-1", api)

    const errorHandler = jest.fn()
    poller.addEventListener("error", errorHandler)

    await tick(1000, 1)

    expect(errorHandler).toHaveBeenCalledTimes(1)
    expect(errorHandler.mock.calls[0][0].detail).toBe(apiError)

    const callsAfterError = api.getMediaStatus.mock.calls.length
    await tick(1000, 3)
    expect(api.getMediaStatus.mock.calls.length).toBe(callsAfterError)
  })

  test(".stop() clears the interval and is idempotent", async () => {
    const api = createFakeApiService({
      statuses: [{ state: "processing" }],
    })
    const poller = new PollingService("media-1", api)

    await tick(1000, 2)
    const callsBeforeStop = api.getMediaStatus.mock.calls.length
    expect(callsBeforeStop).toBeGreaterThan(0)

    expect(() => poller.stop()).not.toThrow()
    expect(() => poller.stop()).not.toThrow()
    expect(() => poller.stop()).not.toThrow()

    await tick(1000, 5)
    expect(api.getMediaStatus.mock.calls.length).toBe(callsBeforeStop)
  })

  test(".stop() dispatches a 'cancelled' event, only once", async () => {
    const api = createFakeApiService({
      statuses: [{ state: "processing" }],
    })
    const poller = new PollingService("media-1", api)

    const cancelledHandler = jest.fn()
    poller.addEventListener("cancelled", cancelledHandler)

    poller.stop()
    poller.stop() // idempotent: should not redispatch

    expect(cancelledHandler).toHaveBeenCalledTimes(1)
  })

  test("automatic stop after 'done' does NOT emit 'cancelled'", async () => {
    const api = createFakeApiService({
      statuses: [{ state: "done" }],
      media: { id: "x" },
    })
    const poller = new PollingService("media-1", api)

    const cancelledHandler = jest.fn()
    poller.addEventListener("cancelled", cancelledHandler)

    await tick(1000, 1)

    expect(cancelledHandler).not.toHaveBeenCalled()
  })
})
