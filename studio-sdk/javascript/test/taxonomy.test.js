/**
 * @jest-environment node
 */
import { jest } from "@jest/globals"
import LinTO from "../index.js"

/**
 * Build a mock fetch that captures every Request and resolves payloads
 * based on a URL/method matcher list. The first matching handler wins.
 */
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

describe("LinTO Taxonomy — high-level wrappers (mocked apiService)", () => {
  let linto

  beforeEach(() => {
    linto = new LinTO({ authToken: "tok-1" })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("listCategories() delegates to apiService.listCategories()", async () => {
    linto.apiService.listCategories = jest.fn(async () => [
      { _id: "c1", name: "Tags" },
    ])
    const res = await linto.listCategories()
    expect(linto.apiService.listCategories).toHaveBeenCalledTimes(1)
    expect(res).toEqual([{ _id: "c1", name: "Tags" }])
  })

  test("listTags(categoryId) forwards { categoryId } to apiService", async () => {
    linto.apiService.listTags = jest.fn(async () => [
      { _id: "t1", name: "important" },
    ])
    const res = await linto.listTags("c1")
    expect(linto.apiService.listTags).toHaveBeenCalledWith({ categoryId: "c1" })
    expect(res).toEqual([{ _id: "t1", name: "important" }])
  })

  test("createTag(categoryId, name, opts) forwards full payload", async () => {
    linto.apiService.createTag = jest.fn(async () => ({
      _id: "t9",
      name: "n",
    }))
    const res = await linto.createTag("c1", "n", { color: "red", emoji: "*" })
    expect(linto.apiService.createTag).toHaveBeenCalledWith({
      categoryId: "c1",
      name: "n",
      color: "red",
      emoji: "*",
    })
    expect(res._id).toBe("t9")
  })

  test("ensureTag() returns existing tag id (case-insensitive)", async () => {
    linto.apiService.listCategories = jest.fn(async () => [
      { _id: "c1", name: "Tags" },
    ])
    linto.apiService.listTags = jest.fn(async () => [
      { _id: "t-abc", name: "ImPoRtAnT" },
    ])
    linto.apiService.createTag = jest.fn()
    const id = await linto.ensureTag("important")
    expect(id).toBe("t-abc")
    expect(linto.apiService.createTag).not.toHaveBeenCalled()
  })

  test("ensureTag() creates tag if absent and returns its id", async () => {
    linto.apiService.listCategories = jest.fn(async () => [
      { _id: "c1", name: "tags" },
    ])
    linto.apiService.listTags = jest.fn(async () => [])
    linto.apiService.createTag = jest.fn(async () => ({
      _id: "t-new",
      name: "new",
    }))
    const id = await linto.ensureTag("new", { color: "blue" })
    expect(id).toBe("t-new")
    expect(linto.apiService.createTag).toHaveBeenCalledWith({
      categoryId: "c1",
      name: "new",
      color: "blue",
      emoji: undefined,
    })
  })

  test("ensureTag() falls back to first category when categoryName not found", async () => {
    linto.apiService.listCategories = jest.fn(async () => [
      { _id: "c-first", name: "Other" },
      { _id: "c-second", name: "Else" },
    ])
    linto.apiService.listTags = jest.fn(async () => [])
    linto.apiService.createTag = jest.fn(async (args) => ({
      _id: "t-created",
      name: args.name,
    }))
    const id = await linto.ensureTag("foo", { categoryName: "missing" })
    expect(id).toBe("t-created")
    expect(linto.apiService.listTags).toHaveBeenCalledWith({
      categoryId: "c-first",
    })
  })

  test("ensureTag() returns null when no categories exist", async () => {
    linto.apiService.listCategories = jest.fn(async () => [])
    const id = await linto.ensureTag("foo")
    expect(id).toBeNull()
  })

  test("ensureTag() returns null when listCategories returns non-array", async () => {
    linto.apiService.listCategories = jest.fn(async () => ({}))
    const id = await linto.ensureTag("foo")
    expect(id).toBeNull()
  })

  test("addConversationTag() preserves existing tags and appends", async () => {
    linto.apiService.getConversation = jest.fn(async () => ({
      _id: "conv-1",
      tags: ["t-existing"],
    }))
    linto.apiService.updateConversation = jest.fn(async () => ({ ok: true }))
    const res = await linto.addConversationTag("conv-1", "t-new")
    expect(res).toEqual(["t-existing", "t-new"])
    expect(linto.apiService.updateConversation).toHaveBeenCalledWith({
      conversationId: "conv-1",
      data: { tags: ["t-existing", "t-new"] },
    })
  })

  test("addConversationTag() does NOT duplicate when tag already present", async () => {
    linto.apiService.getConversation = jest.fn(async () => ({
      tags: ["t-existing", "t-dup"],
    }))
    linto.apiService.updateConversation = jest.fn()
    const res = await linto.addConversationTag("conv-1", "t-dup")
    expect(res).toEqual(["t-existing", "t-dup"])
    expect(linto.apiService.updateConversation).not.toHaveBeenCalled()
  })

  test("addConversationTag() returns null when tagId is falsy", async () => {
    linto.apiService.getConversation = jest.fn()
    const res = await linto.addConversationTag("conv-1", "")
    expect(res).toBeNull()
    expect(linto.apiService.getConversation).not.toHaveBeenCalled()
  })

  test("addConversationTag() handles conversation with no tags field", async () => {
    linto.apiService.getConversation = jest.fn(async () => ({ _id: "conv-1" }))
    linto.apiService.updateConversation = jest.fn(async () => ({ ok: true }))
    const res = await linto.addConversationTag("conv-1", "t-new")
    expect(res).toEqual(["t-new"])
    expect(linto.apiService.updateConversation).toHaveBeenCalledWith({
      conversationId: "conv-1",
      data: { tags: ["t-new"] },
    })
  })

  test("listFolders() forwards default options", async () => {
    linto.apiService.listFolders = jest.fn(async () => [])
    await linto.listFolders()
    expect(linto.apiService.listFolders).toHaveBeenCalledWith({
      tree: false,
      withConversationCount: false,
    })
  })

  test("listFolders({ tree, withConversationCount }) forwards options", async () => {
    linto.apiService.listFolders = jest.fn(async () => [])
    await linto.listFolders({ tree: true, withConversationCount: true })
    expect(linto.apiService.listFolders).toHaveBeenCalledWith({
      tree: true,
      withConversationCount: true,
    })
  })

  test("createFolder() forwards full payload with default visibility=public", async () => {
    linto.apiService.createFolder = jest.fn(async () => ({ _id: "f1" }))
    await linto.createFolder("myfolder", { parentId: "p1", color: "red" })
    expect(linto.apiService.createFolder).toHaveBeenCalledWith({
      name: "myfolder",
      parentId: "p1",
      color: "red",
      emoji: undefined,
      visibility: "public",
    })
  })

  test("createFolder() uses visibility=private when requested", async () => {
    linto.apiService.createFolder = jest.fn(async () => ({ _id: "f2" }))
    await linto.createFolder("secret", { visibility: "private" })
    expect(linto.apiService.createFolder).toHaveBeenCalledWith({
      name: "secret",
      parentId: undefined,
      color: undefined,
      emoji: undefined,
      visibility: "private",
    })
  })

  test("ensureFolder() finds existing folder by name (case-insensitive) and matching parent", async () => {
    linto.apiService.listFolders = jest.fn(async () => [
      { _id: "f-root", name: "Inbox", parentId: null },
      { _id: "f-child", name: "Inbox", parentId: "p1" },
    ])
    linto.apiService.createFolder = jest.fn()
    const id = await linto.ensureFolder("inbox")
    expect(id).toBe("f-root")
    expect(linto.apiService.createFolder).not.toHaveBeenCalled()
  })

  test("ensureFolder() matches the folder with the same parentId", async () => {
    linto.apiService.listFolders = jest.fn(async () => [
      { _id: "f-root", name: "Inbox", parentId: null },
      { _id: "f-child", name: "Inbox", parentId: "p1" },
    ])
    linto.apiService.createFolder = jest.fn()
    const id = await linto.ensureFolder("inbox", { parentId: "p1" })
    expect(id).toBe("f-child")
  })

  test("ensureFolder() creates folder if absent", async () => {
    linto.apiService.listFolders = jest.fn(async () => [])
    linto.apiService.createFolder = jest.fn(async () => ({
      _id: "f-new",
      name: "n",
    }))
    const id = await linto.ensureFolder("n", { visibility: "private" })
    expect(id).toBe("f-new")
    expect(linto.apiService.createFolder).toHaveBeenCalledWith({
      name: "n",
      parentId: undefined,
      color: undefined,
      emoji: undefined,
      visibility: "private",
    })
  })

  test("moveToFolder() POSTs through apiService.moveConversationToFolder", async () => {
    linto.apiService.moveConversationToFolder = jest.fn(async () => ({
      ok: true,
    }))
    await linto.moveToFolder("f-1", "conv-1")
    expect(linto.apiService.moveConversationToFolder).toHaveBeenCalledWith({
      folderId: "f-1",
      conversationId: "conv-1",
    })
  })
})

describe("StudioApiService Taxonomy — URL/payload via mocked fetch", () => {
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

  function defaultOrgHandler(payload = [{ _id: "org-1" }]) {
    return {
      match: (req) =>
        /\/api\/organizations(\?|$)/.test(req.url) ||
        /\/api\/organizations\?t=/.test(req.url),
      payload,
    }
  }

  test("listCategories GETs /organizations/{orgId}/categories with Bearer token", async () => {
    const { mock, captured } = makeFetchMock([
      defaultOrgHandler(),
      {
        match: (req) => /\/categories/.test(req.url),
        payload: [{ _id: "c1", name: "Tags" }],
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.listCategories()
    expect(res).toEqual([{ _id: "c1", name: "Tags" }])
    const call = captured.find((c) => c.url.includes("/categories"))
    expect(call.method).toBe("GET")
    expect(call.auth).toBe("Bearer tok-1")
    expect(call.url).toMatch(/\/api\/organizations\/org-1\/categories/)
  })

  test("listTags GETs /organizations/{orgId}/tags?categoryId=...", async () => {
    const { mock, captured } = makeFetchMock([
      defaultOrgHandler(),
      {
        match: (req) => /\/tags\?categoryId=/.test(req.url),
        payload: [{ _id: "t1", name: "x" }],
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.listTags("c1")
    const tagsCall = captured.find((c) => /\/tags\?categoryId=/.test(c.url))
    expect(tagsCall.method).toBe("GET")
    expect(tagsCall.url).toMatch(
      /\/api\/organizations\/org-1\/tags\?categoryId=c1/
    )
  })

  test("createTag POSTs /organizations/{orgId}/tags with full payload", async () => {
    const { mock, captured } = makeFetchMock([
      defaultOrgHandler(),
      {
        match: (req) =>
          req.method === "POST" && /\/organizations\/org-1\/tags/.test(req.url),
        payload: { _id: "t-new", name: "n" },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.apiService.createTag({
      categoryId: "c1",
      name: "n",
      color: "blue",
    })
    const postCall = captured.find(
      (c) =>
        c.method === "POST" && /\/organizations\/org-1\/tags/.test(c.url)
    )
    expect(postCall).toBeDefined()
    expect(postCall.auth).toBe("Bearer tok-1")
    const body = JSON.parse(postCall.body)
    expect(body).toMatchObject({
      organizationId: "org-1",
      categoryId: "c1",
      name: "n",
      color: "blue",
    })
    expect(body).not.toHaveProperty("emoji")
    expect(body).not.toHaveProperty("description")
  })

  test("listFolders GETs /organizations/{orgId}/folders with tree/withConversationCount params", async () => {
    const { mock, captured } = makeFetchMock([
      defaultOrgHandler(),
      {
        match: (req) => /\/folders/.test(req.url),
        payload: [{ _id: "f1", name: "x" }],
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.apiService.listFolders({
      tree: true,
      withConversationCount: true,
    })
    const call = captured.find((c) => /\/folders/.test(c.url))
    expect(call.method).toBe("GET")
    expect(call.url).toMatch(/\/folders\?tree=true&withConversationCount=true/)
  })

  test("listFolders without options omits query params on the folders URL", async () => {
    const { mock, captured } = makeFetchMock([
      defaultOrgHandler(),
      {
        match: (req) => /\/folders/.test(req.url),
        payload: [],
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.apiService.listFolders()
    const call = captured.find((c) => /\/folders/.test(c.url))
    // Folders URL must NOT contain tree= or withConversationCount=
    expect(call.url).not.toMatch(/tree=/)
    expect(call.url).not.toMatch(/withConversationCount=/)
  })

  test("createFolder POSTs /organizations/{orgId}/folders with payload", async () => {
    const { mock, captured } = makeFetchMock([
      defaultOrgHandler(),
      {
        match: (req) =>
          req.method === "POST" && /\/organizations\/org-1\/folders/.test(req.url),
        payload: { _id: "f-new", name: "n" },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.apiService.createFolder({
      name: "n",
      parentId: "p1",
      visibility: "private",
    })
    const postCall = captured.find(
      (c) =>
        c.method === "POST" && /\/organizations\/org-1\/folders/.test(c.url)
    )
    expect(postCall).toBeDefined()
    const body = JSON.parse(postCall.body)
    expect(body).toMatchObject({
      name: "n",
      parentId: "p1",
      visibility: "private",
    })
  })

  test("moveConversationToFolder POSTs to nested folder/conversation URL", async () => {
    const { mock, captured } = makeFetchMock([
      defaultOrgHandler(),
      {
        match: (req) =>
          /\/folders\/f-1\/conversations\/conv-1/.test(req.url) &&
          req.method === "POST",
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.apiService.moveConversationToFolder({
      folderId: "f-1",
      conversationId: "conv-1",
    })
    const call = captured.find((c) =>
      /\/folders\/f-1\/conversations\/conv-1/.test(c.url)
    )
    expect(call.method).toBe("POST")
    expect(call.auth).toBe("Bearer tok-1")
    expect(call.url).toMatch(
      /\/api\/organizations\/org-1\/folders\/f-1\/conversations\/conv-1/
    )
  })

  test("getConversation GETs /conversations/{id}", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) => /\/api\/conversations\/conv-9/.test(req.url),
        payload: { _id: "conv-9", tags: ["t1"] },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const res = await linto.apiService.getConversation({
      conversationId: "conv-9",
    })
    expect(res).toEqual({ _id: "conv-9", tags: ["t1"] })
    const call = captured.find((c) => /\/conversations\/conv-9/.test(c.url))
    expect(call.method).toBe("GET")
    expect(call.auth).toBe("Bearer tok-1")
  })

  test("updateConversation PATCHes /conversations/{id} with JSON body", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "PATCH" &&
          /\/api\/conversations\/conv-7/.test(req.url),
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    await linto.apiService.updateConversation({
      conversationId: "conv-7",
      data: { tags: ["t-a", "t-b"] },
    })
    const call = captured.find(
      (c) =>
        c.method === "PATCH" && /\/api\/conversations\/conv-7/.test(c.url)
    )
    expect(call).toBeDefined()
    expect(call.auth).toBe("Bearer tok-1")
    expect(JSON.parse(call.body)).toEqual({ tags: ["t-a", "t-b"] })
  })

  test("addConversationTag end-to-end via fetch mock (GET + PATCH)", async () => {
    const { mock, captured } = makeFetchMock([
      {
        match: (req) =>
          req.method === "GET" && /\/conversations\/conv-3/.test(req.url),
        payload: { _id: "conv-3", tags: ["old"] },
      },
      {
        match: (req) =>
          req.method === "PATCH" && /\/conversations\/conv-3/.test(req.url),
        payload: { ok: true },
      },
    ])
    global.fetch = mock
    const linto = makeLinto()
    const newTags = await linto.addConversationTag("conv-3", "fresh")
    expect(newTags).toEqual(["old", "fresh"])
    const patchCall = captured.find((c) => c.method === "PATCH")
    expect(JSON.parse(patchCall.body)).toEqual({ tags: ["old", "fresh"] })
  })
})
