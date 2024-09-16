<template>
  <table style="width: 100%">
    <UserTableHeaders
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection" />
    <tbody>
      <UserTableLine
        v-for="user in users"
        :key="user.id"
        :user="user"
        :linkTo="linkTo" />
    </tbody>
  </table>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import UserTableHeaders from "@/components/UserTableHeaders.vue"
import UserTableLine from "@/components/UserTableLine.vue"

export default {
  props: {
    users: {
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
      sortListKey: "email",
      sortListDirection: "asc",
    }
  },
  mounted() {},
  methods: {},
  components: { Fragment, UserTableHeaders, UserTableLine },
}
</script>
