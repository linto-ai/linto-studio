<template>
  <div class="m-page m-login">
    <main class="m-page__content m-login__content">
      <InstallBanner
        v-if="canInstall"
        class="m-login__install"
        @install="startInstall"
        @dismiss="dismissInstall" />
      <img src="/img/linto.svg" alt="" class="m-login__logo" />
      <h1 class="m-login__title">LinTO Studio</h1>
      <p class="m-muted">{{ $t("mobile.login.title") }}</p>

      <form class="m-login__form" @submit.prevent="submit">
        <label class="m-field">
          <span>{{ $t("mobile.login.email") }}</span>
          <input
            v-model="email"
            type="email"
            name="email"
            autocomplete="username"
            required />
        </label>
        <label class="m-field">
          <span>{{ $t("mobile.login.password") }}</span>
          <input
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            required />
        </label>
        <p v-if="failed" class="m-login__error" role="alert">
          <PhIcon name="warning-circle" size="sm" />
          {{ $t("mobile.login.error") }}
        </p>
        <button type="submit" class="m-login__submit" :disabled="pending">
          {{
            pending ? $t("mobile.common.loading") : $t("mobile.login.submit")
          }}
        </button>
      </form>

      <a href="/login" class="m-login__link">{{ $t("mobile.login.sso") }}</a>
      <a href="/create-account" class="m-login__link">{{
        $t("mobile.login.create_account")
      }}</a>
    </main>
    <InstallGuideIos v-model="iosGuideOpen" />
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import InstallBanner from "@/mobile/components/InstallBanner.vue"
import InstallGuideIos from "@/mobile/components/InstallGuideIos.vue"
import { loginWithPassword } from "@/mobile/services/session/loginWithPassword.js"
import { installMixin } from "@/mobile/mixins/install.js"

// Phones reaching studio.linto.ai land here (redirect.js): the install
// offer is made right away, before signing in.
export default {
  name: "MobileLogin",
  components: { PhIcon, InstallBanner, InstallGuideIos },
  mixins: [installMixin],
  data() {
    return { email: "", password: "", pending: false, failed: false }
  },
  methods: {
    async submit() {
      this.pending = true
      this.failed = false
      const result = await loginWithPassword(this.email, this.password)
      this.pending = false
      if (!result.ok) {
        this.failed = true
        return
      }
      this.$router.replace(this.$route.query.next || { name: "home" })
    },
  },
}
</script>

<style scoped>
.m-login__content {
  justify-content: center;
  align-items: stretch;
  text-align: center;
}

.m-login__install {
  margin-bottom: var(--m-space-4);
}

.m-login__logo {
  width: 64px;
  height: 64px;
  align-self: center;
}

.m-login__title {
  font-size: var(--m-font-size-xl);
}

.m-login__form {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
  margin-top: var(--m-space-4);
  text-align: left;
}

.m-field {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-field input {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-login__error {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  margin: 0;
  color: var(--m-danger);
}

.m-login__submit {
  min-height: 52px;
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-weight: 600;
}

.m-login__submit:disabled {
  opacity: 0.6;
}

.m-login__link {
  min-height: var(--m-tap);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
