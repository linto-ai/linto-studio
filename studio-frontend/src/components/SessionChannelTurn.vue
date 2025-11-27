<template>
  <div class="channel-turn">
    <!-- <div class="flex col channel-turn__metadata">
      
      <span class="channel-turn__time">{{ time }}</span>
    </div> -->
    <div class="channel-turn__time">
      {{ time }}
    </div>
    <div class="channel-turn__content" :selected="selected" @click="onClick">
      <div class="channel-turn__header">
        <span class="channel-turn__speaker" v-if="speaker !== previousSpeaker">
          {{ speaker }}
        </span>
        <span class="channel-turn__lang" v-if="lang !== previousLang">
          {{ lang }}
        </span>
      </div>
      <div class="channel_turn__text">{{ text }}</div>
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import getTextTurnWithTranslation from "@/tools/getTextTurnWithTranslation.js"
export default {
  props: {
    turn: {
      type: Object,
      required: true,
    },
    previous: {
      type: Object,
      required: false,
    },
    selectedTranslations: {
      type: String,
      required: false,
      default: "original",
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    channelLanguages: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    text() {
      return getTextTurnWithTranslation(
        this.turn,
        this.selectedTranslations,
        this.channelLanguages,
      )
    },
    speaker() {
      if (this.selectedTranslations !== "original") {
        let languageNames = new Intl.DisplayNames([this.$i18n.locale], {
          type: "language",
        })
        return this.$t("session.detail_page.translation_bot")
      }

      return (
        this.turn?.locutor || this.$t("session.detail_page.undefined_speaker")
      )
    },
    lang() {
      return this.turn.lang || this.$t("session.detail_page.undefined_lang")
    },
    time() {
      if (!this.turn.astart) return "00:00:00"
      return new Date(
        new Date(this.turn.astart).getTime() + this.turn.start * 1000,
      ).toLocaleTimeString()
    },
    previousSpeaker() {
      if (!this.previous) return null
      return (
        this.previous?.locutor ||
        this.$t("session.detail_page.undefined_speaker")
      )
    },
    previousLang() {
      if (!this.previous) return null
      return (
        this.previous?.lang || this.$t("session.detail_page.undefined_lang")
      )
    },
    previousTime() {
      if (!this.previous) return null
      if (!this.previous.astart) return "00:00:00"
      return new Date(
        new Date(this.previous.astart).getTime() + this.previous.start * 1000,
      ).toLocaleTimeString()
    },
  },
  methods: {
    onClick(e) {
      this.$emit("select", e)
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.channel-turn {
  display: grid;
  grid-template-columns: 7rem 60rem;
  margin-inline: auto;
  gap: 1em;
}

.channel-turn__time {
  text-align: end;
  color: var(--text-secondary);
}

.channel-turn__header {
  font-weight: bold;
}

// .channel-turn {
//   display: grid;
//   grid-template-columns: auto 60em;
//   margin-inline: auto;
//   gap: 1em;
// }

// @container session-content (max-width: 70em) {
//   .channel-turn {
//     grid-template-columns: auto 1fr;
//     margin-inline: 1rem;
//   }
// }

// .channel-turn__text {
//   text-align: justify;
//   font-family: luciole;
//   line-height: 1.3em;
//   padding: calc(0.25rem + 1px);
// }

// .channel-turn__text[selected] {
//   border: 1px solid var(--primary-color);
//   background-color: var(--selected-background);
//   padding: calc(0.25rem + 0px);
//   border-radius: 3px;
// }
</style>
