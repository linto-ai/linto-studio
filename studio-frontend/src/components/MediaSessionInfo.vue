<template>
  <div v-if="channels.length" class="media-session-info">
    <h4 class="info-list__title">
      {{ $t("media_explorer.panel.session.title") }}
    </h4>
    <div
      v-for="(channel, index) in channels"
      :key="index"
      class="media-session-info__channel">
      <div v-if="channels.length > 1" class="media-session-info__channel-title">
        {{ $t("media_explorer.panel.session.channel") }} {{ index + 1 }}
      </div>
      <InfoList :rows="rowsForChannel(channel)" />
    </div>
  </div>
</template>

<script>
import InfoList from "@/components/molecules/InfoList.vue"
import { formatLanguageMixin } from "@/mixins/formatLanguage"

export default {
  name: "MediaSessionInfo",
  mixins: [formatLanguageMixin],
  components: { InfoList },
  props: {
    media: {
      type: Object,
      default: null,
    },
  },
  computed: {
    channels() {
      return this.media?.metadata?.session?.channels ?? []
    },
  },
  methods: {
    rowsForChannel(channel) {
      const empty = this.$t("media_explorer.panel.transcription.empty")
      const languages = (channel.languages || []).map((lang) =>
        this.formatLanguage(lang),
      )
      const translations = (channel.translations || []).map((lang) =>
        this.formatLanguage(lang),
      )
      return [
        {
          id: "name",
          icon: "broadcast",
          label: this.$t("media_explorer.panel.session.name"),
          value: channel.name || empty,
          muted: !channel.name,
        },
        {
          id: "languages",
          icon: "translate",
          label: this.$t("media_explorer.panel.session.languages"),
          value: languages.length ? languages : empty,
          muted: !languages.length,
        },
        {
          id: "translations",
          icon: "globe",
          label: this.$t("media_explorer.panel.session.translations"),
          value: translations.length
            ? translations
            : this.$t("media_explorer.panel.session.no_translations"),
          muted: !translations.length,
        },
      ]
    },
  },
}
</script>

<style scoped>
.media-session-info {
  display: flex;
  flex-direction: column;
}

/* Separator between channels. */
.media-session-info__channel:not(:first-of-type) {
  border-top: 2px solid var(--neutral-20);
  margin-top: 0.75rem;
  padding-top: 0.75rem;
}

.media-session-info__channel-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
</style>
