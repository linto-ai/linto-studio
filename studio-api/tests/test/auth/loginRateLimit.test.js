jest.mock("debug", () => () => () => {})

// The strategies answer from the request body, the limiter under test is real
jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
  () => {
    const authenticate = (req, res) => {
      if (req.body.ok) return res.status(200).json({ message: "login success" })
      res.status(401).json({ message: "Invalid credential" })
    }
    return { local_authenticate: authenticate, authenticate_reset: authenticate }
  },
)

const express = require("express")

const routes = require(
  `${process.cwd()}/components/WebServer/routes/auth/local.js`,
)()

let server, baseUrl

beforeAll((done) => {
  const app = express()
  app.use(express.json())
  for (const route of routes) {
    if (route.requireAuth === false) app[route.method](route.path, ...route.controller)
  }
  server = app.listen(0, () => {
    baseUrl = `http://127.0.0.1:${server.address().port}`
    done()
  })
})

afterAll(() => {
  server.closeAllConnections()
  return new Promise((resolve) => server.close(resolve))
})

async function post(path, body) {
  const res = await fetch(baseUrl + path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  return res.status
}

describe("login rate limit", () => {
  it("blocks the sixth failed attempt in the window, whatever the login route", async () => {
    for (let i = 0; i < 3; i++) expect(await post("/login", {})).toBe(401)
    for (let i = 0; i < 2; i++) expect(await post("/login/magic-link", {})).toBe(401)

    expect(await post("/login", { ok: true })).toBe(429)
    expect(await post("/login/magic-link", {})).toBe(429)
  })
})

describe("successful logins", () => {
  // A fresh limiter: the module keeps one store per process
  let freshRoutes, freshServer, freshUrl

  beforeAll((done) => {
    jest.isolateModules(() => {
      freshRoutes = require(
        `${process.cwd()}/components/WebServer/routes/auth/local.js`,
      )()
    })
    const app = express()
    app.use(express.json())
    for (const route of freshRoutes) {
      if (route.requireAuth === false) app[route.method](route.path, ...route.controller)
    }
    freshServer = app.listen(0, () => {
      freshUrl = `http://127.0.0.1:${freshServer.address().port}`
      done()
    })
  })

  afterAll(() => {
    freshServer.closeAllConnections()
    return new Promise((resolve) => freshServer.close(resolve))
  })

  it("are not counted against the limit", async () => {
    const status = (body) =>
      fetch(freshUrl + "/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.status)

    for (let i = 0; i < 20; i++) expect(await status({ ok: true })).toBe(200)
    for (let i = 0; i < 5; i++) expect(await status({})).toBe(401)
    expect(await status({ ok: true })).toBe(429)
  })
})
