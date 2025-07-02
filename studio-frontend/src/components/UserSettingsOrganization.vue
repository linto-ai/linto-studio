<template>
  <section>
    <h2>{{ $t("user_settings.organizations_section.title") }}</h2>
    <OrganizationTable
      v-if="!error"
      @list_sort_by="sortBy"
      :organizationList="sortedOrganization"
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection"
      v-model="selectedOrganizations"
      :linkTo="{ name: 'backoffice-organizationDetail' }"
      :loading="loading" />
    <div v-else>
      <div>{{ error }}</div>
      <button @click="retry">
        <span class="label">Retry</span>
      </button>
    </div>
  </section>
</template>
<script>
import { bus } from "@/main.js"
import { apiGetUserOrganizations } from "@/api/admin.js"
import OrganizationTable from "@/components/OrganizationTable.vue"
import { sortArray } from "@/tools/sortList.js"
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
    retry() {
      this.error = null
      this.fetchOrganization()
    },
    async fetchOrganization() {
      this.loading = true
      let res = await apiGetUserOrganizations(this.userInfo._id)
      if (res.status === "success") {
        this.organisationList = res.data
      } else {
        this.error = res.message
      }
      this.loading = false
    },
    sortBy(key) {
      if (key === this.sortListKey) {
        this.sortListDirection =
          this.sortListDirection === "desc" ? "asc" : "desc"
      } else {
        this.sortListDirection = "desc"
      }
      this.sortListKey = key
      this.fetchOrganization()
    },
  },
  computed: {
    sortedOrganization() {
      return sortArray(
        this.organisationList,
        this.sortListKey,
        this.sortListDirection,
      )
    },
  },
  components: {
    OrganizationTable,
  },
}
</script>
