const state = {
  organizations: {}, // key: organizationId, value: organization
  currentOrganizationScope: null, // orgaId
  rolesInOrganizations: {}, // {organizationId: {myrole: number, users: {userId: {role: number}}}, otherOrgaId: {...}}
  currentOrganization: null,
  currentScope: null, // "organization" or "favorites" or "shared"
  currentFilterStatus: "done", // done, processing, error
}

export default state
