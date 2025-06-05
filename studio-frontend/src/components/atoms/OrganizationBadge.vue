<template>
  <div class="organization-badge">
    {{ organization.name[0] }}
  </div>
</template>
<script>
import { bus } from "@/main.js"
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
