<template>
  <div class="flex align-center justify-center">
    <span :class="iconClasses" :title="text"></span>
    <span v-if="withText">{{ text }}</span>
  </div>
</template>
<script>
import { sessionModelMixin } from "@/mixins/sessionModel.js"

export default {
  mixins: [sessionModelMixin],
  props: {
    session: { type: Object, required: true },
    small: { type: Boolean, default: false },
    withText: { type: Boolean, default: false },
  },
  data() {
    return {}
  },
  computed: {
    icon() {
      switch (true) {
        case this.isTerminated:
          return "save-cloud"
        case this.isActive:
          return "record"
        case this.isStarted:
          return "pause"
        default:
          return "clock"
      }
    },
    text() {
      switch (true) {
        case this.isTerminated:
          return this.$t("session.sessions_status.terminated")
        case this.isActive:
          return this.$t("session.sessions_status.active")
        case this.isStarted:
          return this.$t("session.sessions_status.pending")
        default:
          return this.$t("session.sessions_status.scheduled")
      }
    },
    iconClasses() {
      let res = ["icon", this.icon]

      if (this.small) {
        res.push("small")
      }

      return res
    },
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
