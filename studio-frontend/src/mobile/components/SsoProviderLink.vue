<template>
  <a :href="href" class="m-sso">
    <img :src="icon" alt="" class="m-sso__icon" />
    <span>{{ label }}</span>
  </a>
</template>

<script>
import { getEnv } from "@/tools/getEnv"
import { oidcProviderIcon } from "@/mobile/tools/oidcProviderIcon.js"

// One OIDC provider of the login page. Same target as the classic button:
// the API starts the flow and lands on /login/oidc, whose page reloads "/"
// once the cookies are set, so a phone comes back to the mobile app.
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

.m-sso__icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
