<template>
  <tr>
    <td>
      <router-link :to="to">{{ id }}</router-link>
    </td>
    <td>
      <router-link :to="to">{{ email }}</router-link>
    </td>
    <td>
      <router-link :to="to">{{ firstname }}</router-link>
    </td>
    <td>
      <router-link :to="to">{{ lastname }}</router-link>
    </td>
    <td>
      <button @click="editUser">
        <span class="icon edit"></span>
        <span class="label">{{ $t("userTable.edit_button_label") }}</span>
      </button>
    </td>
  </tr>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import router from "../routers/app-router"

import { userModelMixin } from "@/mixins/userModel"

export default {
  mixins: [userModelMixin],
  props: {
    user: {
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
  methods: {
    editUser() {
      router.push(this.to)
    },
  },
  computed: {
    to() {
      return {
        ...this.linkTo,
        params: { userId: this.id },
      }
    },
  },
  components: { Fragment },
}
</script>
