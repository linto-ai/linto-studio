<template>
  <a :href="link" class="sso-btn" :class="name" :title="label">
    <!-- <span class="label">{{ label }}</span> -->
    <img :src="icon" class="icon" :alt="name" />
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
          return "/img/logo_linagora.webp"
        case "Google":
          return "/img/google.png"
        case "Github":
          return "/img/github-mark.svg"
        case "eu":
          return "/img/eu-flag.svg"
        default:
          return "/img/building.svg"
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
  padding: 0.5rem;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
    opacity: 0.9;
  }
}

.sso-btn.Github {
  padding: 0;
  border: none;
}

.sso-btn.linagora {
  padding: 0;
  background-color: #c71f45;
  border: none;
}

.sso-btn.eu {
  padding: 0;
  background-color: #003399;
  border: none;
}

.sso-btn.Google {
  padding: 0;
}

.sso-btn img {
  width: 100%;
  height: 100%;
}
</style>
