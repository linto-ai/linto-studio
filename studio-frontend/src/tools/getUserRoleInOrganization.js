export function getUserRoleInOrganization(organization, userId) {
  if (organization.owner === userId) return 4
  else {
    let findUser = organization.users.filter(
      (usr) => usr._id === userId || usr.userId === userId
    )
    return findUser.length > 0 ? findUser[0].role : 0
  }
}
