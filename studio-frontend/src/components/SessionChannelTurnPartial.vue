<template>
  <SessionChannelTurn :turn="turn" />
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import SessionChannelTurn from "@/components/SessionChannelTurn.vue"

export default {
  props: {
    partialText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    turn() {
      return { text: this.partialText }
    },
  },
  methods: {},
  components: { Fragment, SessionChannelTurn },
}
</script>
