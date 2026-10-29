jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info: jest.fn(),
  error: jest.fn(),
}))
// No database: the inserted payload is what matters here
jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({}))

const moment = require("moment")
const VALIDITY_DATE = require(
  `${process.cwd()}/lib/dao/validityDate/validityDate.js`,
)
const users = require(`${process.cwd()}/lib/mongodb/models/users`)
const { isPendingAccount } = require(
  `${process.cwd()}/components/WebServer/controllers/user/invitation`,
)

const EMAIL = "Alice@Acme.ORG"
const NORMALIZED = "alice@acme.org"

beforeEach(() => {
  jest.restoreAllMocks()
  jest
    .spyOn(users, "mongoInsert")
    .mockResolvedValue({ insertedCount: 1, insertedId: "id" })
  jest.spyOn(users, "releasePendingEmail").mockResolvedValue()
  delete process.env.SMTP_HOST
})

const inserted = () => users.mongoInsert.mock.calls[0][0]

describe("users model: what an account looks like at creation", () => {
  describe("with SMTP", () => {
    beforeEach(() => {
      process.env.SMTP_HOST = "smtp.test"
    })

    it("signup: password set, address to verify", async () => {
      await users.createUser({ email: EMAIL, password: "secret" })

      const user = inserted()
      expect(user.email).toBe(NORMALIZED)
      expect(user.passwordHash).toEqual(expect.any(String))
      expect(user.emailIsVerified).toBe(false)
      expect(user.verifiedEmail).toEqual([])
      expect(user.fromSso).toBe(false)
      expect(isPendingAccount(user)).toBe(false)
    })

    it("invitation: no password, 48h link, pending until the first login", async () => {
      await users.createExternal({ email: EMAIL }, false, VALIDITY_DATE.LONG)

      const user = inserted()
      expect(user.passwordHash).toBeNull()
      expect(user.fromSso).toBe(false)
      expect(user.emailIsVerified).toBe(false)
      expect(user.authLink.magicId).toHaveLength(20)
      expect(user.authLink.email).toBe(NORMALIZED)
      const hours = moment(user.authLink.validityDate).diff(moment(), "hours")
      expect(hours).toBeGreaterThanOrEqual(47)
      expect(isPendingAccount(user)).toBe(true)
    })

    it("SSO: verified from the identity provider, never pending", async () => {
      await users.createExternal(
        { email: EMAIL, firstname: "Alice", lastname: "Doe" },
        true,
      )

      const user = inserted()
      expect(user.passwordHash).toBeNull()
      expect(user.fromSso).toBe(true)
      expect(user.emailIsVerified).toBe(true)
      expect(user.verifiedEmail).toEqual([NORMALIZED])
      expect(isPendingAccount(user)).toBe(false)
    })
  })

  describe("without SMTP", () => {
    it("signup: usable right away", async () => {
      await users.createUser({ email: EMAIL, password: "secret" })

      const user = inserted()
      expect(user.emailIsVerified).toBe(true)
      expect(user.verifiedEmail).toEqual([NORMALIZED])
    })

    it("invitation: verified at creation, so never pending", async () => {
      await users.createExternal({ email: EMAIL }, false, VALIDITY_DATE.LONG)

      const user = inserted()
      expect(user.passwordHash).toBeNull()
      expect(user.emailIsVerified).toBe(true)
      expect(user.authLink.magicId).toHaveLength(20)
      expect(isPendingAccount(user)).toBe(false)
    })

    it("SSO: same as with SMTP", async () => {
      await users.createExternal({ email: EMAIL }, true)

      const user = inserted()
      expect(user.fromSso).toBe(true)
      expect(user.emailIsVerified).toBe(true)
      expect(isPendingAccount(user)).toBe(false)
    })
  })
})
