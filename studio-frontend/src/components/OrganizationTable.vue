<template>
  <table style="width: 100%">
    <OrganizationTableHeaders
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection" />
    <tbody>
      <OrganizationTableLine
        v-for="organization in organizationList"
        :linkTo="linkTo"
        :key="organization.id"
        :organization="organization" />
    </tbody>
  </table>
</template>
<script>
import OrganizationTableHeaders from "./OrganizationTableHeaders.vue"
import OrganizationTableLine from "./OrganizationTableLine.vue"
export default {
  props: {
    organizationList: {
      type: Array,
      required: true,
    },
    linkTo: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      sortListKey: "id",
      sortListDirection: "asc",
    }
  },
  mounted() {},
  methods: {},
  components: { OrganizationTableHeaders, OrganizationTableLine },
}
</script>
