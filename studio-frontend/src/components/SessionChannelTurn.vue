<template>
  <div class="channel-turn">
    <div class="channel-turn__text">{{ text }}</div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {
    turn: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    text() {
      return this.turn.text
    },
  },
  methods: {},
  components: { Fragment },
}
</script>
