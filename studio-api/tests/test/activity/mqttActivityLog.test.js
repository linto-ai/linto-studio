/**
 * Unit tests for the MqttActivityLog controller: mount/unmount events derived
 * from the sessions/statuses broadcast, including the "vanished" channel case.
 * Redis is left unconfigured so the Mongo fallback (getLastChannelEvent) is used.
 */
const EventEmitter = require("events")

const mockGetLastChannelEvent = jest.fn()
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  activityLog: {
    getLastChannelEvent: (...a) => mockGetLastChannelEvent(...a),
    create: jest.fn(),
  },
}))

const mockLogChannelEvent = jest.fn()
jest.mock(`${process.cwd()}/lib/logger/manager`, () => ({
  logChannelEvent: (...a) => mockLogChannelEvent(...a),
}))

jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
  log() {},
}))

const MqttActivityLog = require(
  `${process.cwd()}/components/BrokerClient/controllers/MqttActivityLog`,
)

const TOPIC = "system/out/sessions/statuses"
// The handler is async (awaits state reads); drain several microtask/macrotask
// turns so all of its awaited work settles before we assert.
const flush = async () => {
  for (let i = 0; i < 5; i++) await new Promise((r) => setImmediate(r))
}

function setup() {
  const sharedClient = new EventEmitter()
  const ctx = {
    sharedClient,
    app: { components: { IoHandler: { redisPubClient: null } } },
  }
  MqttActivityLog.call(ctx)
  return sharedClient
}

function broadcast(client, sessions) {
  // The MQTT client emits a "message" event carrying (topic, payload).
  client.emit("message", TOPIC, Buffer.from(JSON.stringify(sessions)))
  return flush()
}

const activeSession = {
  id: "sess-1",
  name: "S1",
  organizationId: "org-1",
  visibility: "private",
  status: "active",
  channels: [{ id: 42, streamStatus: "active", translations: [] }],
}

const actionsLogged = () => mockLogChannelEvent.mock.calls.map((c) => c[2])

beforeEach(() => {
  mockGetLastChannelEvent.mockReset()
  mockLogChannelEvent.mockReset().mockResolvedValue(undefined)
})

describe("MqttActivityLog channel events", () => {
  it("logs a mount when a channel first appears active", async () => {
    mockGetLastChannelEvent.mockResolvedValue(null) // no prior event
    const client = setup()

    await broadcast(client, [activeSession])

    expect(actionsLogged()).toEqual(["mount"])
    expect(mockLogChannelEvent.mock.calls[0][1].id).toBe(42)
  })

  it("logs an unmount when an active channel VANISHES from the broadcast", async () => {
    mockGetLastChannelEvent
      .mockResolvedValueOnce(null) // broadcast 1: mount check, no prior
      .mockResolvedValue({ action: "mount" }) // broadcast 2: vanished gate -> still active
    const client = setup()

    await broadcast(client, [activeSession]) // active
    await broadcast(client, []) // session terminated -> gone from broadcast

    expect(actionsLogged()).toEqual(["mount", "unmount"])
    // the unmount carries the context captured while the channel was active
    const unmount = mockLogChannelEvent.mock.calls.find(
      (c) => c[2] === "unmount",
    )
    expect(unmount[0].id).toBe("sess-1")
    expect(unmount[1].id).toBe(42)
    // regression: the state lookup must use the NUMERIC channel id, else the
    // Mongo type-strict match misses and the vanished gate never fires.
    expect(mockGetLastChannelEvent).toHaveBeenCalledWith("sess-1", 42)
    expect(mockGetLastChannelEvent).not.toHaveBeenCalledWith("sess-1", "42")
  })

  it("logs an unmount when a present channel flips to inactive", async () => {
    mockGetLastChannelEvent
      .mockResolvedValueOnce(null) // b1 mount
      .mockResolvedValue({ action: "mount" }) // b2 present-inactive gate -> active
    const client = setup()

    await broadcast(client, [activeSession])
    await broadcast(client, [
      {
        ...activeSession,
        status: "ready",
        channels: [{ id: 42, streamStatus: "inactive", translations: [] }],
      },
    ])

    expect(actionsLogged()).toEqual(["mount", "unmount"])
  })

  it("does not double-unmount a channel once it has vanished", async () => {
    mockGetLastChannelEvent
      .mockResolvedValueOnce(null)
      .mockResolvedValue({ action: "mount" })
    const client = setup()

    await broadcast(client, [activeSession])
    await broadcast(client, []) // vanish -> unmount
    await broadcast(client, []) // still gone -> nothing

    expect(actionsLogged().filter((a) => a === "unmount")).toHaveLength(1)
  })

  it("keeps a still-active channel mounted without duplicate events", async () => {
    mockGetLastChannelEvent
      .mockResolvedValueOnce(null) // b1 mount
      .mockResolvedValue({ action: "mount" }) // b2 still active
    const client = setup()

    await broadcast(client, [activeSession])
    await broadcast(client, [activeSession]) // unchanged

    expect(actionsLogged()).toEqual(["mount"])
  })

  it("never retro-closes a stale historical mount it never observed active", async () => {
    // Mongo may still think some channel is mounted, but if we never saw it
    // active in a previous broadcast, the first (empty) broadcast must not
    // emit a flood of bogus unmounts.
    mockGetLastChannelEvent.mockResolvedValue({ action: "mount" })
    const client = setup()

    await broadcast(client, []) // previousActive is empty

    expect(mockLogChannelEvent).not.toHaveBeenCalled()
  })
})
