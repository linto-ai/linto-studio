const state = {
  organizations: {}, // key: organizationId, value: organization
  currentOrganizationScope: null,
  rolesInOrganizations: {}, // {organizationId: {myrole: number, users: {userId: {role: number}}}, otherOrgaId: {...}}
  currentOrganization: null,
}

export default state
