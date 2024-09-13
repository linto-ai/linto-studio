<template>
  <tr>
    <td>
      <router-link :to="to">{{ id }}</router-link>
    </td>
    <td>
      <router-link :to="to">{{ name }}</router-link>
    </td>
    <td>{{ userNumber }}</td>
    <td>
      <button @click="editOrganization">
        <span class="icon edit"></span>
        <span class="label">{{ $t("orgaTable.edit_button_label") }}</span>
      </button>
    </td>
  </tr>
</template>
<script>
import { organizationModelMixin } from "@/mixins/organizationModel"
import router from "../routers/app-router"

export default {
  mixins: [organizationModelMixin],
  props: {
    organization: {
      type: Object,
      required: true,
    },
    linkTo: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    to() {
      return {
        ...this.linkTo,
        params: { organizationId: this.id },
      }
    },
  },
  methods: {
    editOrganization() {
      router.push(this.to)
    },
  },
  components: {},
}
</script>
