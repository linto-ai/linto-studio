<template>
  <section>
    <h2>{{ $t("usersettings.organizations_section.title") }}</h2>
    <OrganizationTable
      :organizationList="organisationList"
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection"
      v-model="selectedOrganizations"
      :linkTo="{ name: 'backoffice-organizationDetail' }"
      :loading="loading" />
  </section>
</template>
<script>
import { bus } from "@/main.js"
import { apiGetOrganizationsFromUser } from "@/api/organisation"
import OrganizationTable from "@/components/OrganizationTable.vue"

export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      organisationList: [],
      selectedOrganizations: [],
      error: null,
      loading: false,
      sortListKey: "name",
      sortListDirection: "asc",
    }
  },
  mounted() {
    this.fetchOrganization()
  },
  methods: {
    async fetchOrganization() {
      this.loading = true
      let res = await apiGetOrganizationsFromUser(this.userInfo._id)
      if (res.status === "success") {
        this.organisationList = res.data
      } else {
        this.error = res.message
      }
      this.loading = false
    },
  },
  components: {
    OrganizationTable,
  },
}
</script>
