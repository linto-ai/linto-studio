<template>
  <PopoverList
    :items="langList"
    v-model="local"
    @click="setLocale"
    class="local-switcher"
    color="neutral"
    :aria-label="$t('local_switcher.list_label')"
    ref="popoverList">
    <template #trigger="{ ariaProps }">
      <Button
        v-bind="ariaProps"
        variant="tertiary"
        size="sm"
        :label="localTxt"
        :aria-label="$t('local_switcher.change_language', { lang: localTxt })"
        icon="translate" />
    </template>
    <template #item="{ item }">
      <span :lang="item.value.split('-')[0]">{{ item.text }}</span>
    </template>
  </PopoverList>
</template>
<script>
export default {
  props: {
    buttonClass: { type: String },
  },
  data() {
    return {
      langList: [
        { value: "fr-FR", text: "Français" },
        { value: "en-US", text: "English" },
      ],
    }
  },
  watch: {
    "$i18n.locale": function (newVal) {
      // Persist the selected locale (string)
      localStorage.setItem("lang", newVal)
      // reload page
      location.reload()
    },
  },
  computed: {
    localTxt() {
      return this.$i18n.locale === "fr-FR" ? "Français" : "English"
    },
    local() {
      return this.$i18n.locale
    },
  },
  methods: {
    setLocale(locale) {
      // The emitted value can be either the full item object or the locale string.
      // Accept both formats to avoid runtime errors.
      const lang =
        typeof locale === "object" && locale !== null ? locale.value : locale
      this.$i18n.locale = lang
      this.$refs.popoverList.$refs.popover.close()
    },
  },
  components: {},
}
</script>

<style lang="scss">
#lang-selector {
  &.select__head {
    width: 54px;
  }

  &.select > div {
    padding: 0;
  }

  &.select > div button {
    padding: 0 0.5em;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.select > button {
    padding: 0 0.5em;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.select > button span {
    padding: 0;
    text-align: center;
  }

  &.select > button span.icon {
    display: none;
  }

  &.select > div button:hover {
    background-color: var(--primary-soft);
  }

  &.select > div button span {
    padding: 0;
    text-align: center;
  }
}
</style>
