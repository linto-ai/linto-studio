<template>
  <a :href="href" class="m-sso" @click="markSsoReturn">
    <span class="m-sso__disc" :style="{ background: icon.background }">
      <img :src="icon.src" alt="" class="m-sso__icon" />
    </span>
    <span>{{ label }}</span>
  </a>
</template>

<script>
import { getEnv } from "@/tools/getEnv"
import { oidcProviderIcon } from "@/mobile/tools/oidcProviderIcon.js"
import { markSsoReturn } from "@/mobile/services/session/markSsoReturn.js"

// One OIDC provider of the login page. Same target as the classic button:
// the API starts the flow and lands on /login/oidc, whose page reloads "/"
// once the cookies are set; the SSO-return cookie set here brings that
// load back to the mobile app.
export default {
  name: "SsoProviderLink",
  props: {
    name: { type: String, required: true },
    path: { type: String, required: true },
  },
  computed: {
    href() {
      return `${getEnv("VUE_APP_CONVO_AUTH")}/${this.path}/login`
    },
    icon() {
      return oidcProviderIcon(this.name)
    },
    label() {
      const key = `login.sso.${this.name}`
      return this.$te(key) ? this.$t(key) : this.$t("login.sso.default")
    },
  },
  methods: { markSsoReturn },
}
</script>

<style scoped>
.m-sso {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 52px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
  color: var(--m-text);
  font-weight: 600;
  text-decoration: none;
}

.m-sso__disc {
  flex: none;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--m-radius-round);
}

.m-sso__icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
