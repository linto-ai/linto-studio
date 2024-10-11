<template>
  <router-link
    :title="name"
    :to="`/interface/${sessionOrganizationId}/sessions/${id}`"
    class="session-card">
    <div class="session-card--name flex align-center">
      <span class="icon save-cloud small" v-if="isTerminated"></span>
      <span class="icon record small" v-else-if="isActive"></span>
      <span class="icon clock small" v-else></span>
      <span class="flex1">{{ name }}</span>
    </div>
    <div class="session-card--date">
      {{ startTimeFormatted }} – {{ endTimeFormatted }}
    </div>
    <div class="session-card--room">{{ room }}</div>
  </router-link>
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
