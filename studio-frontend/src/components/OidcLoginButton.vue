<template>
  <a :href="link" class="btn sso" :class="name">
    <span class="label">{{ label }}</span>
    <span class="icon" :class="icon" />
  </a>
</template>
<script>
import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"

export default {
  props: {
    path: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      BASE_AUTH: getEnv("VUE_APP_CONVO_AUTH"),
    }
  },
  computed: {
    link() {
      return `${this.BASE_AUTH}/${this.path}/login`
    },
    label() {
      if (this.$te(`login.sso.${this.name}`)) {
        return this.$t(`login.sso.${this.name}`)
      } else {
        return this.$t(`login.sso.default`)
      }
    },
    icon() {
      switch (this.name) {
        case "linagora":
          return "linagora-small"
        default:
          return "lock-off"
      }
    },
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
