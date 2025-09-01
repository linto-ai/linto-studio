const state = {
  organizations: {}, // key: organizationId, value: organization
  currentOrganizationScope: null,
  rolesInOrganizations: {}, // {organizationId: {myrole: number, users: {userId: {role: number}}}, otherOrgaId: {...}}
  currentOrganization: null,
  currentScope: null, // "organization" or "favorites" or "shared"
}

export default state
