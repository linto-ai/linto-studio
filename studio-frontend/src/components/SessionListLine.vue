<template>
  <router-link
    :title="name"
    :to="`/interface/sessions/${id}`"
    class="session-line flex">
    <div class="flex1 session-line__title text-cut">{{ name }}</div>
    <LabeledValueSmall
      v-if="isFuture"
      :label="$t('session.list_page.planned_for')"
      :value="plannedFor" />

    <LabeledValueSmall
      v-if="isStarted"
      :label="$t('session.list_page.started_at')"
      :value="startTime" />
  </router-link>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import LabeledValueSmall from "@/components/LabeledValueSmall.vue"

export default {
  props: {
    session: { type: Object, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    name() {
      return this.session.name
    },
    plannedFor() {
      return (
        this.session.start_time ??
        this.$t("session.list_page.planned_undefined")
      )
    },
    id() {
      return this.session.id
    },
    startTime() {
      return this.session.start_time
    },
    isFuture() {
      return this.session.status === "ready"
    },
    isStarted() {
      return this.session.status === "active"
    },
  },
  components: { Fragment, LabeledValueSmall },
}
</script>
