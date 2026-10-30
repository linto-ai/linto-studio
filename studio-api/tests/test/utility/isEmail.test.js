const { isEmail } = require(`${process.cwd()}/lib/utility/emailDomain`)

describe("isEmail", () => {
  it.each(["alice@example.com", "First.Last+tag@Sub.Example.ORG", "x@a-b.co"])(
    "accepts %s",
    (value) => {
      expect(isEmail(value)).toBe(true)
    },
  )

  it.each([
    "<unknown_email>",
    "alice",
    "@example.com",
    "alice@",
    "alice@localhost",
    "alice @example.com",
    "alice@exa mple.com",
    "",
    undefined,
    null,
    42,
  ])("rejects %p", (value) => {
    expect(isEmail(value)).toBe(false)
  })
})
