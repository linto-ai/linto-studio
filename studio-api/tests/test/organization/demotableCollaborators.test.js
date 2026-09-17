const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { demotableCollaborators } = require(`${process.cwd()}/lib/saas`)

const OWNER = "owner"

describe("saas.demotableCollaborators", () => {
  test("every collaborator but the owner", () => {
    const org = {
      owner: OWNER,
      users: [
        { userId: OWNER, role: ROLES.ADMIN },
        { userId: "admin-2", role: ROLES.ADMIN },
        { userId: "maintainer", role: ROLES.MAINTAINER },
        { userId: "uploader", role: ROLES.UPLOADER },
        { userId: "member", role: ROLES.MEMBER },
        { userId: "bot", role: ROLES.UPLOADER, type: "machine" },
      ],
    }
    expect(demotableCollaborators(org)).toEqual([
      "admin-2",
      "maintainer",
      "uploader",
      "bot",
    ])
  })

  test("an owner who is not admin gives way to the first admin", () => {
    const org = {
      owner: OWNER,
      users: [
        { userId: "admin-1", role: ROLES.ADMIN },
        { userId: OWNER, role: ROLES.MAINTAINER },
      ],
    }
    expect(demotableCollaborators(org)).toEqual([OWNER])
  })

  test("members only, nothing to demote", () => {
    const org = {
      owner: OWNER,
      users: [
        { userId: OWNER, role: ROLES.ADMIN },
        { userId: "member", role: ROLES.MEMBER },
      ],
    }
    expect(demotableCollaborators(org)).toEqual([])
  })
})
