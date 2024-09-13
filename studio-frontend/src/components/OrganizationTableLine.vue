<template>
  <tr>
    <td>{{ id }}</td>
    <td>{{ name }}</td>
    <td>{{ userNumber }}</td>
    <td>
      <button>
        <span class="icon edit"></span>
        <span class="label">{{ $t("orgaTable.edit_button_label") }}</span>
      </button>
    </td>
  </tr>
</template>
<script>
import { organizationModelMixin } from "@/mixins/organizationModel"

export default {
  mixins: [organizationModelMixin],
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
