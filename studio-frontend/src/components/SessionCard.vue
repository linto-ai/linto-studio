<template>
  <div class="session-card">
    <div class="session-card--name">{{ name }}</div>
    <div class="session-card--date">Date de la session</div>
    <div class="session-card--room">Salle 1</div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import { sessionModelMixin } from "@/mixins/sessionModel.js"

export default {
  mixins: [sessionModelMixin],
  props: {
    session: { type: Object, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment },
}
</script>
