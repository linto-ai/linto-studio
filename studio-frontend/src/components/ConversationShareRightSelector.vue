<template>
  <select v-if="!readOnly" @change="onChange" :value="value">
    <option
      v-for="uright in rightsList"
      :key="uright.value"
      :value="uright.value">
      {{ uright.txt }}
    </option>
  </select>
  <span v-else style="width: 160px"
    >{{ getUserRightTxt(value) }}
    {{ isOwner ? "(owner)" : "" }}
  </span>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"

import { workerSendMessage } from "../tools/worker-message.js"

export default {
  props: {
    value: { type: Number, required: true },
    rightsList: { type: Array, required: true },
    readOnly: { type: Boolean, required: false, default: false },
    isOwner: { type: Boolean, required: false, default: false },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    onChange(event) {
      const newRight = parseInt(event.target.value)
      this.$emit("updateRight", newRight)
    },
    getUserRightTxt(right) {
      return this.$store.getters.getUserRightTxt(right)
    },
  },
  components: { Fragment },
}
</script>
