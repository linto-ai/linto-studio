export const impersonationMixin = {
  methods: {
    async viewAsOrganization(organizationId) {
      await this.$store.dispatch(
        "organizations/startImpersonation",
        organizationId,
      )
      this.$router.push({ name: "explore", params: { organizationId } })
    },
    async impersonateUser(userId) {
      try {
        await this.$store.dispatch("system/startUserImpersonation", userId)
      } catch (err) {
        this.$store.dispatch("system/showError", err.message)
      }
    },
  },
}
