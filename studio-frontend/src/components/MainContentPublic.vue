<template>
  <div class="flex login-page">
    <div class="login-page__decoration flex col flex1">
      <div
        class="login-page__decoration__header center-text flex col gap-small align-center">
        <img :src="logo" class="login-page__logo" />
        <h1 class="center-text login-page__main-title">
          {{ title }}
        </h1>
      </div>
      <div
        class="flex flex1 col justify-center align-center gap-medium reset-overflows">
        <div class="login-page__decoration__slogan">
          <h3 class="flex align-center gap-small">
            <span class="icon large record"></span><span>Enregistrer</span>
          </h3>
          <p>
            Enregistrez vos réunions en toute sécurité, de manière fluide et
            automatique.
          </p>
        </div>
        <div class="login-page__decoration__slogan">
          <h3 class="flex align-center gap-small">
            <span class="icon large edit"></span><span>Annoter</span>
          </h3>
          <p>Manipulez et éditez vos retranscriptions.</p>
        </div>
        <div class="login-page__decoration__slogan">
          <h3 class="flex align-center gap-small">
            <span class="icon large subtitle"></span><span>Exporter</span>
          </h3>
          <p>
            Exportez vos médias sous une multitude de formats tel que des
            sous-titres ou un document Word.
          </p>
        </div>
      </div>
    </div>

    <div class="login-page__content flex col">
      <div class="flex col align-center">
        <LocalSwitcher></LocalSwitcher>
      </div>
      <div class="flex col flex1 justify-center align-center reset-overflows">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import LocalSwitcher from "@/components/LocalSwitcher.vue"
import { getEnv } from "@/tools/getEnv"

export default {
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    title() {
      return getEnv("VUE_APP_NAME")
    },
    logo() {
      return `/img/${getEnv("VUE_APP_LOGO")}`
    },
  },
  components: { LocalSwitcher },
}
</script>
