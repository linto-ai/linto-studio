<template>
  <div class="menu-brand-header flex row align-center justify-between">
    <div class="menu-brand-header__identity flex row align-center gap-small">
      <img
        v-if="logo"
        :src="logo"
        :alt="logoAlt"
        class="menu-brand-header__logo" />
      <span class="menu-brand-header__title"><AppName /></span>
    </div>
    <Button
      icon="caret-double-left"
      icon-weight="regular"
      variant="transparent"
      color="neutral"
      :aria-label="$t('navigation.toggle_sidebar')"
      @click="toggleSidebar"></Button>
  </div>
</template>

<script>
// Kept intentionally minimal (logo + app name + collapse toggle) — a first
// pass, to be redesigned later.
import { getEnv } from "@/tools/getEnv"
import { getLogoAltName } from "@/tools/getLogoAltName"
// Button and AppName are registered globally by the atoms plugin (components/atoms/index.js).

export default {
  name: "MenuBrandHeader",
  computed: {
    logo() {
      return getEnv("VUE_APP_LOGO") ? `/img/${getEnv("VUE_APP_LOGO")}` : false
    },
    logoAlt() {
      return getLogoAltName()
    },
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("system/toggleSidebar")
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-brand-header {
  padding: 0 1rem;
  height: 64px;
  flex-shrink: 0;
  border-bottom: var(--border-block);
}

.menu-brand-header__identity {
  min-width: 0;
}

.menu-brand-header__logo {
  height: 28px;
  width: 28px;
  object-fit: contain;
  flex-shrink: 0;
}

.menu-brand-header__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.5rem;
}
</style>
