<template>
  <div
    @click="onClick"
    class="flex align-center session-status gap-small"
    :title="text">
    <span class="session-on-air flex align-center gap-small" v-if="isActive">
      <span v-if="!small">[</span>
      <StatusLed on />
      <span v-if="!small">On Air</span>
      <span v-if="!small">]</span>
    </span>

    <span
      class="session-on-air session-on-air--off flex align-center gap-small"
      v-else-if="isStarted">
      <span v-if="!small">[</span>
      <StatusLed off />
      <span v-if="!small">Off Air</span>
      <span v-if="!small">]</span>
    </span>

    <span
      class="session-on-air session-on-air--muted flex align-center gap-small"
      v-else>
      <!-- <span>[</span> -->
      <span class="icon record-off" />
      <!-- <span v-if="!small">Muted</span> -->
      <!-- <span>]</span> -->
    </span>
    <span class="session-status__name" v-if="showName">{{ name }}</span>
    <span v-if="withText" class="session-status__text flex1">({{ text }})</span>
  </div>
</template>
<script>
import { sessionModelMixin } from "@/mixins/sessionModel.js"
import StatusLed from "@/components/atoms/StatusLed.vue"
import Badge from "./atoms/Badge.vue"

export default {
  mixins: [sessionModelMixin],
  props: {
    session: { type: Object, required: true },
    small: { type: Boolean, default: false },
    withText: { type: Boolean, default: false },
    showName: { type: Boolean, default: false },
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
  methods: {
    onClick(e) {
      this.$emit("click", e)
    },
  },
  components: { StatusLed, Badge },
}
</script>

<style lang="scss" scoped>
.session-status {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  text-decoration: none !important;
  //container-type: inline-size;
  //container-name: session-status;
}

.session-on-air {
  border-radius: 55px;
  //background-color: red;
  color: var(--red-chart);
  font-weight: bold;
  font-variant: all-petite-caps;
  .icon {
    background-color: white;
  }
}

.session-on-air.session-on-air--muted {
  color: var(--text-primary);

  .icon {
    background-color: var(--text-primary);
    margin: 0;
  }
}

.session-on-air.session-on-air--off {
  color: #62111e;
}

.session-status__name {
  font-weight: 800;
}

.session-status__text {
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@container main (width < 1000px) {
  .session-status__text {
    display: none;
  }
}
</style>
