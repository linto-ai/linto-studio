/**
 * @jest-environment node
 */
import { jest } from "@jest/globals"
import LinTO from "../index.js"

function makeFetchMock(handlers) {
  const captured = []
  const mock = jest.fn(async (req) => {
    captured.push({
      url: req.url,
      method: req.method,
      auth: req.headers.get("authorization"),
      body: req.body ? await readBody(req) : null,
    })
    for (const h of handlers) {
      if (h.match(req)) {
        const payload =
          typeof h.payload === "function" ? await h.payload(req) : h.payload
        const status = h.status ?? 200
        return new Response(JSON.stringify(payload), {
          status,
          headers: { "Content-Type": "application/json" },
        })
      }
    }
    return new Response(JSON.stringify({ error: "unmatched", url: req.url }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  })
  return { mock, captured }
}

async function readBody(req) {
  try {
    return await req.clone().text()
  } catch (_) {
    return null
  }
}

describe("LinTO Sharing — high-level wrappers (mocked apiService)", () => {
  let linto

  beforeEach(() => {
    linto = new LinTO({ authToken: "tok-1" })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("shareConversation() delegates to apiService with default right=1 and notify=true", async () => {
    linto.apiService.shareConversation = jest.fn(async () => ({ ok: true }))
    await linto.shareConversation("conv-1", "alice@example.com")
    expect(linto.apiService.shareConversation).toHaveBeenCalledWith({
      conversationId: "conv-1",
      email: "alice@example.com",
      right: 1,
      notify: true,
    })
  })

  test("shareConversation() forwards custom right and notify=false", async () => {
    linto.apiService.shareConversation = jest.fn(async () => ({ ok: true }))
    await linto.shareConversation("conv-1", "bob@example.com", {
      right: 2,
      notify: false,
    })
    expect(linto.apiService.shareConversation).toHaveBeenCalledWith({
      conversationId: "conv-1",
      email: "bob@example.com",
      right: 2,
      notify: false,
    })
  })

  test("searchUsers() delegates to apiService.searchUsers", async () => {
    linto.apiService.searchUsers = jest.fn(async () => [
      { _id: "u1", email: "x@y.z" },
    ])
    const res = await linto.searchUsers("x@y.z")
    expect(linto.apiService.searchUsers).toHaveBeenCalledWith({
      search: "x@y.z",
    })
    expect(res).toEqual([{ _id: "u1", email: "x@y.z" }])
  })

  test("updateConversation() delegates to apiService.updateConversation", async () => {
    linto.apiService.updateConversation = jest.fn(async () => ({ ok: true }))
    await linto.updateConversation("conv-2", { owner: "u1" })
    expect(linto.apiService.updateConversation).toHaveBeenCalledWith({
      conversationId: "conv-2",
      data: { owner: "u1" },
    })
  })

  test("setConversationOwner() happy path: finds user, updates owner, clears sharedWithUsers", async () => {
    linto.apiService.searchUsers = jest.fn(async () => [
      { _id: "u-1", email: "alice@example.com" },
    ])
    linto.apiService.updateConversation = jest.fn(async () => ({ ok: true }))
    const res = await linto.setConversationOwner("conv-1", "alice@example.com")
    expect(res).toBe("u-1")
    expect(linto.apiService.updateConversation).toHaveBeenCalledWith({
      conversationId: "conv-1",
      data: { owner: "u-1", sharedWithUsers: [] },
    })
  })

  test("setConversationOwner() returns null when search returns no users", async () => {
    linto.apiService.searchUsers = jest.fn(async () => [])
    linto.apiService.updateConversation = jest.fn()
    const res = await linto.setConversationOwner("conv-1", "ghost@example.com")
    expect(res).toBeNull()
    expect(linto.apiService.updateConversation).not.toHaveBeenCalled()
  })

  test("setConversationOwner() returns null when search returns null/undefined", async () => {
    linto.apiService.searchUsers = jest.fn(async () => null)
    linto.apiService.updateConversation = jest.fn()
    const res = await linto.setConversationOwner("conv-1", "ghost@example.com")
    expect(res).toBeNull()
    expect(linto.apiService.updateConversation).not.toHaveBeenCalled()
  })

  test("setConversationOwner() matches email case-insensitively", async () => {
    linto.apiService.searchUsers = jest.fn(async () => [
      { _id: "u-x", email: "Alice@Example.COM" },
    ])
    linto.apiService.updateConversation = jest.fn(async () => ({ ok: true }))
    const res = await linto.setConversationOwner("conv-1", "alice@example.com")
    expect(res).toBe("u-x")
    expect(linto.apiService.updateConversation).toHaveBeenCalledWith({
      conversationId: "conv-1",
      data: { owner: "u-x", sharedWithUsers: [] },
    })
  })

  test("setConversationOwner() returns null when no result matches exactly", async () => {
    linto.apiService.searchUsers = jest.fn(async () => [
      { _id: "u-1", email: "bob@example.com" },
      { _id: "u-2", email: "charlie@example.com" },
    ])
    linto.apiService.updateConversation = jest.fn()
    const res = await linto.setConversationOwner("conv-1", "alice@example.com")
    expect(res).toBeNull()
    expect(linto.apiService.updateConversation).not.toHaveBeenCalled()
  })

  test("setConversationOwner() picks the matching user among many", async () => {
    linto.apiService.searchUsers = jest.fn(async () => [
      { _id: "u-1", email: "alicia@example.com" },
      { _id: "u-2", email: "alice@example.com" },
      { _id: "u-3", email: "alfred@example.com" },
    ])
    linto.apiService.updateConversation = jest.fn(async () => ({ ok: true }))
    const res = await linto.setConversationOwner("conv-1", "alice@example.com")
    expect(res).toBe("u-2")
  })
})

describe("StudioApiService Sharing — URL/payload via mocked fetch", () => {
  let originalFetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
    jest.clearAllMocks()
  })

  function makeLinto() {
    return new LinTO({
      authToken: "tok-1",
      baseUrl: "https://example.test",
    })
  }

  test("shareConversation POSTs /conversations/{id}/invite with email and right", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "POST" &&
          /\/api\/conversations\/conv-1\/invite/.test(req.url),
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.shareConversation("conv-1", "alice@example.com")
    const call = captured.find(
      (c) =>
        c.method === "POST" && /\/conversations\/conv-1\/invite/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.auth).toBe("Bearer tok-1")
    expect(call.url).toMatch(/\/api\/conversations\/conv-1\/invite/)
    const body = JSON.parse(call.body)
    expect(body).toEqual({ email: "alice@example.com", right: 1 })
  })

  test("shareConversation with notify=true (default) OMITS the notify field", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) => /\/conversations\/conv-1\/invite/.test(req.url),
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.shareConversation("conv-1", "alice@example.com", { notify: true })
    const call = captured.find((c) =>
      /\/conversations\/conv-1\/invite/.test(c.url)
    )
    const body = JSON.parse(call.body)
    expect(body).not.toHaveProperty("notify")
    expect(body).toEqual({ email: "alice@example.com", right: 1 })
  })

  test("shareConversation with notify=false INCLUDES notify:false in payload", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) => /\/conversations\/conv-1\/invite/.test(req.url),
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.shareConversation("conv-1", "alice@example.com", {
      notify: false,
    })
    const call = captured.find((c) =>
      /\/conversations\/conv-1\/invite/.test(c.url)
    )
    const body = JSON.parse(call.body)
    expect(body).toEqual({
      email: "alice@example.com",
      right: 1,
      notify: false,
    })
  })

  test("shareConversation forwards custom right value", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) => /\/conversations\/conv-9\/invite/.test(req.url),
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.shareConversation("conv-9", "carol@example.com", { right: 3 })
    const call = captured.find((c) =>
      /\/conversations\/conv-9\/invite/.test(c.url)
    )
    const body = JSON.parse(call.body)
    expect(body).toEqual({ email: "carol@example.com", right: 3 })
  })

  test("searchUsers GETs /users/search?search=... with Bearer token", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" && /\/api\/users\/search/.test(req.url),
        payload: [{ _id: "u-1", email: "alice@example.com" }],
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.searchUsers("alice@example.com")
    expect(res).toEqual([{ _id: "u-1", email: "alice@example.com" }])
    const call = captured.find((c) => /\/api\/users\/search/.test(c.url))
    expect(call.method).toBe("GET")
    expect(call.auth).toBe("Bearer tok-1")
    expect(call.url).toMatch(/\/api\/users\/search\?search=alice%40example\.com/)
  })

  test("updateConversation PATCHes /conversations/{id} with arbitrary data (owner + sharedWithUsers)", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "PATCH" &&
          /\/api\/conversations\/conv-5/.test(req.url),
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.updateConversation("conv-5", {
      owner: "u-1",
      sharedWithUsers: [],
    })
    const call = captured.find(
      (c) =>
        c.method === "PATCH" && /\/api\/conversations\/conv-5/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.auth).toBe("Bearer tok-1")
    expect(JSON.parse(call.body)).toEqual({
      owner: "u-1",
      sharedWithUsers: [],
    })
  })

  test("setConversationOwner end-to-end via fetch mock (search GET + PATCH)", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" && /\/api\/users\/search/.test(req.url),
        payload: [{ _id: "u-7", email: "Alice@Example.COM" }],
      },
      {
        match: (req) =>
          req.method === "PATCH" &&
          /\/api\/conversations\/conv-2/.test(req.url),
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const userId = await linto.setConversationOwner(
      "conv-2",
      "alice@example.com"
    )
    expect(userId).toBe("u-7")
    const patchCall = captured.find(
      (c) =>
        c.method === "PATCH" && /\/api\/conversations\/conv-2/.test(c.url)
    )
    expect(patchCall).toBeDefined()
    expect(JSON.parse(patchCall.body)).toEqual({
      owner: "u-7",
      sharedWithUsers: [],
    })
  })
})
