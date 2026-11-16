const crypto = require("crypto")

const MODULE_PATH = `${process.cwd()}/components/WebServer/routecontrollers/auth/mobileSso`
const mobileSso = require(MODULE_PATH)

const ANDROID_URI = "lintostudio://login/oidc"
const IOS_URI = "https://studio.example.org/app/login"
const VERIFIER = "a-long-enough-random-code-verifier"
const CHALLENGE = crypto
  .createHash("sha256")
  .update(VERIFIER)
  .digest("base64url")
const TOKEN = { auth_token: "jwt", user_id: "u1" }
const MOBILE_QUERY = {
  client: "mobile",
  redirect_uri: ANDROID_URI,
  code_challenge: CHALLENGE,
}

function response() {
  const res = { redirect: jest.fn(), json: jest.fn() }
  res.status = jest.fn(() => res)
  return res
}

function startLogin(query) {
  const req = { query, session: {} }
  const next = jest.fn()
  mobileSso.remember(req, {}, next)
  expect(next).toHaveBeenCalledWith()
  return req
}

// mobile login up to the callback, answered by the given module instance.
function finishLogin(token, replica = mobileSso, query = MOBILE_QUERY) {
  const req = startLogin(query)
  const res = response()
  const handled = replica.finish(req, res, token)
  const url = new URL(res.redirect.mock.calls[0][0])
  return { req, handled, url, code: url.searchParams.get("code") }
}

function exchange(body, replica = mobileSso) {
  const res = response()
  const next = jest.fn()
  replica.exchange({ body }, res, next)
  return { res, next }
}

function loadReplica() {
  let replica
  jest.isolateModules(() => {
    replica = require(MODULE_PATH)
  })
  return replica
}

describe("mobile sso", () => {
  beforeEach(() => {
    process.env.MOBILE_SSO_REDIRECT_URIS = `${ANDROID_URI}, ${IOS_URI}`
  })

  afterEach(() => {
    delete process.env.MOBILE_SSO_REDIRECT_URIS
    jest.useRealTimers()
  })

  test("a web login leaves the session and the callback untouched", () => {
    const req = startLogin({})
    const res = response()

    expect(req.session).toEqual({})
    expect(mobileSso.finish(req, res, TOKEN)).toBe(false)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  test("without the env variable a mobile login ends like a web one", () => {
    delete process.env.MOBILE_SSO_REDIRECT_URIS
    const req = startLogin(MOBILE_QUERY)

    expect(req.session).toEqual({})
    expect(mobileSso.finish(req, response(), TOKEN)).toBe(false)
  })

  test.each([
    ["no challenge", { code_challenge: undefined }],
    ["a malformed challenge", { code_challenge: "x".repeat(5000) }],
    ["no return address", { redirect_uri: undefined }],
    ["an unlisted return address", { redirect_uri: "evil://login/oidc" }],
    ["a listed address with a suffix", { redirect_uri: `${ANDROID_URI}/x` }],
  ])("a mobile login with %s ends like a web one", (label, override) => {
    const req = startLogin({ ...MOBILE_QUERY, ...override })

    expect(req.session).toEqual({})
    expect(mobileSso.finish(req, response(), TOKEN)).toBe(false)
  })

  test("a listed entry that is not a URI is ignored", () => {
    process.env.MOBILE_SSO_REDIRECT_URIS = "ai.linto.studio"
    const req = startLogin({ ...MOBILE_QUERY, redirect_uri: "ai.linto.studio" })

    expect(req.session).toEqual({})
  })

  test("an address unlisted since the login start is not answered", () => {
    const req = startLogin(MOBILE_QUERY)
    process.env.MOBILE_SSO_REDIRECT_URIS = IOS_URI
    const res = response()

    expect(mobileSso.finish(req, res, TOKEN)).toBe(false)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  test("each app is sent back to the address it gave", () => {
    const ios = finishLogin(TOKEN, mobileSso, {
      ...MOBILE_QUERY,
      redirect_uri: IOS_URI,
    })

    expect(ios.url.href.startsWith(`${IOS_URI}?code=`)).toBe(true)
  })

  test("a web login drops the challenge of an abandoned mobile login", () => {
    const req = startLogin(MOBILE_QUERY)
    mobileSso.remember({ query: {}, session: req.session }, {}, jest.fn())

    expect(req.session).toEqual({})
  })

  test("the callback sends the app a code it trades for the tokens", () => {
    const { req, handled, url, code } = finishLogin(TOKEN)

    expect(handled).toBe(true)
    expect(req.session).toEqual({})
    expect(url.href.startsWith(`${ANDROID_URI}?code=`)).toBe(true)
    expect(code).not.toContain("jwt")

    const { res, next } = exchange({ code, code_verifier: VERIFIER })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(TOKEN)
    expect(next).not.toHaveBeenCalled()
  })

  // No state in the process: each step may land on another replica.
  test("a code issued by one replica is traded on another", () => {
    const issuer = loadReplica()
    const trader = loadReplica()
    expect(issuer).not.toBe(trader)

    const { code } = finishLogin(TOKEN, issuer)
    const { res } = exchange({ code, code_verifier: VERIFIER }, trader)

    expect(res.json).toHaveBeenCalledWith(TOKEN)
  })

  test("a failed login sends the app an error", () => {
    const { handled, url, code } = finishLogin(null)

    expect(handled).toBe(true)
    expect(url.searchParams.get("error")).toBe("sso")
    expect(code).toBeNull()
  })

  describe("refused exchanges", () => {
    function expectRefused(body) {
      const { res, next } = exchange(body)
      expect(res.json).not.toHaveBeenCalled()
      expect(next.mock.calls[0][0].status).toBe(401)
    }

    test("wrong verifier", () => {
      const { code } = finishLogin(TOKEN)
      expectRefused({ code, code_verifier: "another-verifier" })
    })

    test("missing verifier", () => {
      const { code } = finishLogin(TOKEN)
      expectRefused({ code })
    })

    test("unreadable code", () => {
      expectRefused({ code: "not-a-code", code_verifier: VERIFIER })
    })

    test("expired code", () => {
      const { code } = finishLogin(TOKEN)
      jest.useFakeTimers().setSystemTime(Date.now() + 61 * 1000)
      expectRefused({ code, code_verifier: VERIFIER })
    })
  })
})
