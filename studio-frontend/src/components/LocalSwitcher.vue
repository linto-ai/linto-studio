<template>
  <CustomSelect
    :valueText="localTxt"
    :value="local"
    :buttonClass="buttonClass"
    aria-label="Language selector"
    :options="{
      lang: [
        { value: 'fr-FR', text: '🇫🇷' },
        { value: 'en-US', text: '🇺🇸' },
      ],
    }"
    @input="setLocale" />
</template>
<script>
import { bus } from "@/main.js"
import CustomSelect from "@/components/molecules/CustomSelect.vue"

export default {
  props: {
    buttonClass: { type: String, default: "outline" },
  },
  watch: {
    "$i18n.locale": function (newVal) {
      localStorage.setItem("lang", newVal)
      //reload page
      location.reload()
    },
  },
  computed: {
    localTxt() {
      return this.$i18n.locale === "fr-FR" ? "🇫🇷" : "🇺🇸"
    },
    local() {
      return this.$i18n.locale
    },
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale
      this.showList = false
    },
  },
  components: {
    CustomSelect,
  },
}
</script>

<style>
.select__head {
  width: 54px;
}

.select > div {
  padding: 0;
}

.select > div button {
  padding: 0 0.5em;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select > button {
  padding: 0 0.5em;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select > button span {
  padding: 0;
  text-align: center;
}

.select > button span.icon {
  display: none;
}

.select > div button:hover {
  background-color: var(--primary-soft);
}

.select > div button span {
  padding: 0;
  text-align: center;
}
</style>