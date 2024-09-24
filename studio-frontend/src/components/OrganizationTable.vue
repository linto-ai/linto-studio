<template>
  <table style="width: 100%">
    <OrganizationTableHeaders
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection" />
    <tbody>
      <OrganizationTableLine
        v-for="organization in organizationList"
        v-model="p_selectedOrganizations"
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
    value: {
      //selectedOrganizations
      type: Array,
      required: true,
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
  computed: {
    p_selectedOrganizations: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  components: { OrganizationTableHeaders, OrganizationTableLine },
}
</script>
