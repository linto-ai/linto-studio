<template>
  <div class="flex login-page">
    <div class="login-page__container">
      <div class="login-page__container__left flex col">
        <div
          class="login-page__decoration__header center-text flex col gap-small align-center">
          <img v-if="logo" :src="logo" class="login-page__logo" />
          <h1 class="center-text login-page__main-title">
            {{ title }}
          </h1>
        </div>
        <div class="flex flex1 col align-center gap-medium reset-overflows">
          <div
            class="login-page__decoration__slogan flex align-center gap-medium">
            <ph-icon
              name="microphone"
              size="large"
              weight="bold"
              color="primary" />
            <div class="flex1">
              <h3 class="flex align-center gap-small">
                <span>{{ $t("login.teaser.transcribe.title") }}</span>
              </h3>
              <p>{{ $t("login.teaser.transcribe.desc") }}</p>
            </div>
          </div>
          <div
            class="login-page__decoration__slogan flex align-center gap-medium">
            <ph-icon
              name="pencil-simple"
              size="large"
              weight="bold"
              color="primary" />
            <div class="flex1">
              <h3 class="flex align-center gap-small">
                <!-- <span class="icon large edit"></span> -->
                <span>{{ $t("login.teaser.collaborate.title") }}</span>
              </h3>
              <p>{{ $t("login.teaser.collaborate.desc") }}</p>
            </div>
          </div>
          <div
            class="login-page__decoration__slogan flex align-center gap-medium">
            <ph-icon name="file" size="large" weight="bold" color="primary" />
            <div class="flex1">
              <h3 class="flex align-center gap-small">
                <!-- <span class="icon large subtitle"></span> -->
                <span>{{ $t("login.teaser.ia.title") }}</span>
              </h3>
              <p>
                {{ $t("login.teaser.ia.desc") }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="login-page__container__right">
        <h1 class="center-text login-page__main-title">
          {{ title }}
        </h1>
        <LocalSwitcher class="local-switcher"></LocalSwitcher>

        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import LocalSwitcher from "@/components/LocalSwitcher.vue"
import { getEnv } from "@/tools/getEnv"
import { mapActions, mapGetters } from "vuex"

export default {
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    ...mapGetters("system", ["isMobile"]),
    title() {
      return getEnv("VUE_APP_NAME")
    },
    logo() {
      return getEnv("VUE_APP_LOGO") ? `/img/${getEnv("VUE_APP_LOGO")}` : false
    },
  },
  components: { LocalSwitcher },
}
</script>

<style lang="scss" scoped>
.login-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-page__container {
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 1000px;
  max-width: calc(100vw - 2rem);
  min-height: 500px;
  margin: auto;
  display: flex;
  border-radius: 8px;

  .local-switcher {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
}

.login-page__logo {
  height: 44px;
}

.login-page__container__left {
  background-color: var(--primary-soft);
  width: 50%;
  box-sizing: border-box;
  border-radius: 8px 0 0 8px;
  padding: 4rem;
}

.login-page__container__right {
  width: 50%;
  background-color: white;
  box-sizing: border-box;
  padding: 4rem;
  border-radius: 0 8px 8px 0;

  .login-page__main-title {
    display: none;
  }
}

.login-page__main-title {
  font-weight: 500;
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 3rem;
}

.login-page__decoration__slogan {
  width: 100%;

  p {
    margin: 0;
  }
}

@media screen and (max-width: 900px) {
  .login-page__container {
    //width: fit-content;
    width: 500px;
  }
  .login-page__container__left {
    display: none;
  }

  .login-page__container__right {
    .login-page__main-title {
      display: block;
    }
    width: 100%;
    padding: 2rem;
    padding-top: 3rem;

    .login-page__main-title {
      margin-bottom: 1rem;
    }
  }
}
</style>
