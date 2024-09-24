<template>
  <MainContentBackoffice :loading="loading">
    <UpdateOrganizationForm :currentOrganization="organization" />
    <UpdateOrganizationUsers
      :currentOrganization="organization"
      :userInfo="userInfo" />
  </MainContentBackoffice>
</template>
<script>
import { apiGetOrganizationById } from "@/api/organisation.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UpdateOrganizationForm from "@/components/UpdateOrganizationForm.vue"
import UpdateOrganizationUsers from "@/components/UpdateOrganizationUsers.vue"
export default {
  mixins: [platformRoleMixin],
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      organizationId: this.$route.params.organizationId,
      organization: null,
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
    this.fetchOrganization()
  },
  methods: {
    async fetchOrganization() {
      this.loading = true
      this.organization = await apiGetOrganizationById(this.organizationId)
      this.loading = false
    },
  },
  components: {
    MainContentBackoffice,
    UpdateOrganizationForm,
    UpdateOrganizationUsers,
  },
}
</script>
