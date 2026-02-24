<template>
  <section>
    <h2>{{ $t("user_settings.organizations_section.title") }}</h2>
    <GenericTable
      v-if="!error"
      :columns="columns"
      :content="sortedOrganization"
      :loading="loading"
      :sortListDirection="sortListDirection"
      :sortListKey="sortListKey"
      idKey="_id"
      @list_sort_by="sortBy">
      <template #header-personal>
        <ph-icon name="user" />
      </template>

      <template #cell-personal="{ value }">
        <span v-if="value" class="icon apply" />
        <span v-else class="icon close" />
      </template>

      <template #cell-created="{ value, id }">
        <router-link :to="orgDetailRoute(id)">
          {{ formatDate(value) }}
        </router-link>
      </template>

      <template #cell-name="{ value, id }">
        <router-link :to="orgDetailRoute(id)">{{ value }}</router-link>
      </template>

      <template #cell-userNumber="{ element }">
        {{ element.users ? element.users.length : 0 }}
      </template>

      <template #cell-actions="{ id }">
        <Button
          @click="$router.push(orgDetailRoute(id))"
          variant="secondary"
          icon="pencil"
          :label="$t('orga_table.edit_button_label')" />
      </template>
    </GenericTable>
    <div v-else>
      <div>{{ error }}</div>
      <Button @click="retry" variant="secondary" label="Retry" />
    </div>
  </section>
</template>
<script>
import { bus } from "@/main.js"
import { apiGetUserOrganizations } from "@/api/admin.js"
import GenericTable from "@/components/molecules/GenericTable.vue"
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
      error: null,
      loading: false,
      sortListKey: "name",
      sortListDirection: "asc",
    }
  },
  mounted() {
    this.fetchOrganization()
  },
  computed: {
    columns() {
      return [
        { key: "personal", label: "", width: "auto" },
        {
          key: "created",
          label: this.$t("orga_table.header.creation_date"),
          width: "auto",
        },
        {
          key: "name",
          label: this.$t("orga_table.header.name"),
          width: "1fr",
        },
        {
          key: "userNumber",
          label: this.$t("orga_table.header.userNumber"),
          width: "1fr",
        },
        { key: "actions", label: "", width: "auto" },
      ]
    },
    sortedOrganization() {
      return sortArray(
        this.organisationList,
        this.sortListKey,
        this.sortListDirection,
      )
    },
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
    },
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString() : "-"
    },
    orgDetailRoute(organizationId) {
      return {
        name: "backoffice-organizationDetail",
        params: { organizationId },
      }
    },
  },
  components: {
    GenericTable,
  },
}
</script>
