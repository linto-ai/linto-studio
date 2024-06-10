<template>
  <router-link
    :title="name"
    :to="`/interface/sessions/${id}`"
    class="session-line flex">
    <div class="flex1 session-line__title text-cut">{{ name }}</div>
    <LabeledValueSmall
      v-if="isPending"
      :label="$t('session.list_page.planned_for')"
      :value="startTime" />

    <LabeledValueSmall
      v-if="isStarted"
      :label="$t('session.list_page.started_at')"
      :value="startTime" />
  </router-link>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import { sessionModelMixin } from "@/mixins/sessionModel.js"

import LabeledValueSmall from "@/components/LabeledValueSmall.vue"

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
  components: { Fragment, LabeledValueSmall },
}
</script>
