const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { requiredSeats } = require(`${process.cwd()}/lib/saas`)

describe("saas.requiredSeats", () => {
  test("counts collaborators, admins included, members are free", () => {
    const org = {
      users: [
        { userId: "admin", role: ROLES.ADMIN },
        { userId: "maintainer", role: ROLES.MAINTAINER },
        { userId: "uploader", role: ROLES.UPLOADER },
        { userId: "member-1", role: ROLES.MEMBER },
        { userId: "member-2", role: ROLES.MEMBER },
      ],
    }
    expect(requiredSeats(org)).toBe(3)
  })

  test("a pending org only holds its buyer, legacy invitations ignored", () => {
    const org = {
      users: [{ userId: "buyer", role: ROLES.ADMIN }],
      pendingCheckout: {
        since: new Date(),
        invitations: ["a@example.com", "b@example.com"],
      },
    }
    expect(requiredSeats(org)).toBe(1)
  })

  test("floored at 1", () => {
    expect(requiredSeats({ users: [] })).toBe(1)
    expect(requiredSeats({})).toBe(1)
    expect(
      requiredSeats({ users: [{ userId: "member", role: ROLES.MEMBER }] }),
    ).toBe(1)
  })
})
