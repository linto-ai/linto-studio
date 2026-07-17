export const impersonationMixin = {
  methods: {
    async viewAsOrganization(organizationId) {
      await this.$store.dispatch(
        "organizations/startImpersonation",
        organizationId,
      )
      this.$router.push({ name: "explore", params: { organizationId } })
    },
  },
}
