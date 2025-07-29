<template>
  <a :href="link" class="sso-btn" :class="name">
    <!-- <span class="label">{{ label }}</span> -->
    <img :src="icon" class="icon" />
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
    console.log("iodc", this.name)
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
          return "/img/logo_linagora.webp"
        case "Google":
          return "/img/google.png"
        case "Github":
          return "/img/github-mark.svg"
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

<style>
.sso-btn {
  border: var(--border-input);
  height: 3.5rem;
  width: 3.5rem;
  border-radius: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0rem;
  box-sizing: border-box;
}

.sso-btn.Github {
  padding: 0;
  border: none;
}

.sso-btn.linagora {
  background-color: #c71f45;
  border: none;
}

.sso-btn img {
  width: 100%;
  height: 100%;
}
</style>
