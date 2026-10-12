export function indexOrganizationsRoles(organizations, userId) {
  const rolesInOrganizations = new Map()
  organizations.map((orga) => {
    const users = new Map()
    orga.users.map((user) => {
      users.set(user.userId, { role: user.role, _id: user.userId })
    })
    rolesInOrganizations.set(orga._id, {
      name: orga.name,
      myrole: users.get(userId).role,
      users: users,
    })
  })
  return rolesInOrganizations
}
