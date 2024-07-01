<template>
  <div class="channel-turn">
    <div class="flex col channel-turn__metadata">
      <span class="channel-turn__speaker">{{ speaker }}</span>
      <span class="channel-turn__lang">{{ lang }}</span>
      <span class="channel-turn__time">{{ time }}</span>
    </div>
    <div class="channel-turn__text">{{ text }}</div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import { lang } from "moment"
export default {
  props: {
    turn: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    text() {
      return this.turn.text
    },
    speaker() {
      return this.$t("session.detail_page.undefined_speaker") || "Unknown"
    },
    lang() {
      return this.turn.lang || this.$t("session.detail_page.undefined_lang")
    },
    time() {
      if (!this.turn.astart) return "00:00:00"
      return new Date(
        new Date(this.turn.astart).getTime() + this.turn.start * 1000
      ).toLocaleTimeString()
    },
  },
  methods: {},
  components: { Fragment },
}
</script>
