<template>
  <PopoverList
    :items="langList"
    v-model="local"
    @click="setLocale"
    class="local-switcher"
    width="ref"
    color="neutral"
    ref="popoverList">
    <template #trigger="{ open }">
      <Button variant="outline" color="neutral" size="sm" block>
        {{ localTxt }}
      </Button>
    </template>
  </PopoverList>
</template>
<script>
import CustomSelect from "@/components/molecules/CustomSelect.vue"

export default {
  props: {
    buttonClass: { type: String },
  },
  data() {
    return {
      langList: [
        { value: "fr-FR", text: "Français", avatarText: "🇫🇷" },
        { value: "en-US", text: "English", avatarText: "🇬🇧" },
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
    localIcon() {
      return this.$i18n.locale === "fr-FR" ? "🇫🇷" : "🇬🇧"
    },
    localTxt() {
      return this.$i18n.locale === "fr-FR" ? "🇫🇷 Français" : "🇬🇧 English"
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
  components: {
    CustomSelect,
  },
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
