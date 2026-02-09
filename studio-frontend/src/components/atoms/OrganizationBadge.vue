<template>
  <div class="organization-badge">
    {{ organization.name[0] }}
  </div>
</template>
<script>
export default {
  name: "OrganizationBadge",
  props: {
    organization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
