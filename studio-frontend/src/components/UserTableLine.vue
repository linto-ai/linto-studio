<template>
  <tr>
    <td>{{ id }}</td>
    <td>{{ email }}</td>
    <td>{{ firstname }}</td>
    <td>{{ lastname }}</td>
    <td>
      <button>
        <span class="icon edit"></span>
        <span class="label">{{ $t("userTable.edit_button_label") }}</span>
      </button>
    </td>
  </tr>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import { userModelMixin } from "@/mixins/userModel"

export default {
  mixins: [userModelMixin],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment },
}
</script>
