jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))

const moment = require("moment")
const { activePendingEmail, verifiedFieldsFromLink } = require(
  `${process.cwd()}/components/WebServer/controllers/user/emailVerification`,
)

const soon = moment().add(10, "m").format()
const past = moment().subtract(1, "m").format()

function user(overrides = {}) {
  return {
    email: "old@corp.com",
    emailIsVerified: true,
    verifiedEmail: ["old@corp.com"],
    ...overrides,
  }
}

describe("activePendingEmail", () => {
  test("returns the address while its validity holds", () => {
    const u = user({
      pendingEmail: { address: "new@corp.com", validityDate: soon },
    })
    expect(activePendingEmail(u)).toBe("new@corp.com")
  })

  test("ignores an expired or missing pending address", () => {
    expect(activePendingEmail(user())).toBeNull()
    expect(activePendingEmail(user({ pendingEmail: null }))).toBeNull()
    const expired = user({
      pendingEmail: { address: "new@corp.com", validityDate: past },
    })
    expect(activePendingEmail(expired)).toBeNull()
  })
})

describe("verifiedFieldsFromLink", () => {
  test("a link sent to the pending address makes it primary", () => {
    const u = user({
      pendingEmail: { address: "new@corp.com", validityDate: soon },
      authLink: { magicId: "m", validityDate: soon, email: "new@corp.com" },
    })
    expect(verifiedFieldsFromLink(u)).toEqual({
      authLink: { magicId: null, validityDate: null },
      email: "new@corp.com",
      pendingEmail: null,
      emailIsVerified: true,
      verifiedEmail: ["old@corp.com", "new@corp.com"],
    })
  })

  test("a link sent to another address never promotes the pending one", () => {
    const u = user({
      pendingEmail: { address: "victim@corp.com", validityDate: soon },
      authLink: { magicId: "m", validityDate: soon, email: "old@corp.com" },
    })
    const fields = verifiedFieldsFromLink(u)
    expect(fields.email).toBeUndefined()
    expect(fields.pendingEmail).toBeUndefined()
    expect(fields.verifiedEmail).toEqual(["old@corp.com"])
  })

  test("an expired pending address is not promoted even by its own link", () => {
    const u = user({
      pendingEmail: { address: "new@corp.com", validityDate: past },
      authLink: { magicId: "m", validityDate: soon, email: "new@corp.com" },
    })
    expect(verifiedFieldsFromLink(u)).toEqual({
      authLink: { magicId: null, validityDate: null },
    })
  })

  test("a link for the current unverified address verifies it", () => {
    const u = user({ emailIsVerified: false, verifiedEmail: [] })
    u.authLink = { magicId: "m", validityDate: soon, email: "old@corp.com" }
    expect(verifiedFieldsFromLink(u)).toMatchObject({
      emailIsVerified: true,
      verifiedEmail: ["old@corp.com"],
    })
  })

  test("a link without address proves nothing", () => {
    const u = user({ emailIsVerified: false, verifiedEmail: [] })
    u.authLink = { magicId: "m", validityDate: soon }
    expect(verifiedFieldsFromLink(u)).toEqual({
      authLink: { magicId: null, validityDate: null },
    })
  })
})
