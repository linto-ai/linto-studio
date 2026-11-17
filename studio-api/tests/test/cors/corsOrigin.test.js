const { computeCorsOptions, parseCorsWhitelist, isOriginAllowed } = require(
  `${process.cwd()}/lib/corsOrigin`,
)

describe("parseCorsWhitelist", () => {
  it("trims, lowercases and drops empty entries and trailing slashes", () => {
    expect(
      parseCorsWhitelist(" https://Studio.linto.ai/ ,, localhost ,"),
    ).toEqual(["https://studio.linto.ai", "localhost"])
  })

  it("is empty when the variable is", () => {
    expect(parseCorsWhitelist("")).toEqual([])
    expect(parseCorsWhitelist(undefined)).toEqual([])
  })
})

describe("isOriginAllowed", () => {
  const whitelist = parseCorsWhitelist(
    "https://studio.linto.ai,localhost,dev.example.org:8080",
  )

  it.each([
    "https://studio.linto.ai",
    "https://localhost",
    "capacitor://localhost",
    "http://localhost:5173",
    "http://dev.example.org:8080",
  ])("accepts %s", (origin) => {
    expect(isOriginAllowed(origin, whitelist)).toBe(true)
  })

  it.each([
    "https://evil-localhost.com",
    "https://localhost.evil.com",
    "https://studio.linto.ai.evil.com",
    "https://evilstudio.linto.ai",
    "http://studio.linto.ai",
    "http://dev.example.org:9090",
    "null",
    "not an origin",
  ])("refuses %s", (origin) => {
    expect(isOriginAllowed(origin, whitelist)).toBe(false)
  })

  it("matches a full non-https origin exactly", () => {
    const capacitorOnly = parseCorsWhitelist("capacitor://localhost")
    expect(isOriginAllowed("capacitor://localhost", capacitorOnly)).toBe(true)
    expect(isOriginAllowed("https://localhost", capacitorOnly)).toBe(false)
  })
})

describe("computeCorsOptions", () => {
  function answer(options, origin) {
    let allowed
    options.origin(origin, (error, value) => {
      expect(error).toBeNull()
      allowed = value
    })
    return allowed
  }

  it("turns CORS off for an empty whitelist", () => {
    expect(computeCorsOptions("")).toBeNull()
    expect(computeCorsOptions(" , ")).toBeNull()
    expect(computeCorsOptions(undefined)).toBeNull()
  })

  it("lets any origin in with *", () => {
    expect(computeCorsOptions("*")).toEqual({ origin: "*" })
    expect(computeCorsOptions("localhost, *")).toEqual({ origin: "*" })
  })

  it("answers the listed origins only", () => {
    const options = computeCorsOptions("localhost")
    expect(answer(options, "capacitor://localhost")).toBe(true)
    expect(answer(options, "https://evil-localhost.com")).toBe(false)
  })

  it("lets a call without Origin through", () => {
    expect(answer(computeCorsOptions("localhost"), undefined)).toBe(true)
  })
})
