export const impersonationMixin = {
  methods: {
    async viewAsOrganization(organizationId) {
      await this.$store.dispatch("system/startImpersonation", organizationId)
      this.$router.push({ name: "explore", params: { organizationId } })
    },
  },
}
