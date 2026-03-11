<template>
  <div class="flex col gap-small">
    <NotificationBanner v-if="isYoutubeUrl" variant="warning">
      {{ $t("conversation_creation.url_tab.youtube_warning") }}
    </NotificationBanner>

    <div class="flex gap-small align-bottom">
      <FormInput
        style="margin-bottom: 0"
        :field="linkFields"
        v-model="linkFields.value"
        inputFullWidth
        class="flex1" />
      <Button
        style="align-self: flex-end"
        variant="secondary"
        :label="$t('conversation_creation.url_tab.get_button')"
        :disabled="disabled || isYoutubeUrl"
        @click="add_link" />
    </div>

    <p class="url-helper-text">
      {{ $t("conversation_creation.url_tab.supported_platforms") }}
      <a
        href="https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md"
        target="_blank"
        rel="noopener noreferrer">
        {{ $t("conversation_creation.url_tab.supported_platforms_link") }} ↗
      </a>
    </p>
  </div>
</template>
<script>
import FormInput from "@/components/molecules/FormInput.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import EMPTY_FIELD from "@/const/emptyField"
import { testUrl } from "@/tools/fields/testUrl.js"
import { formsMixin } from "@/mixins/forms.js"

export default {
  mixins: [formsMixin],
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      linkFields: {
        ...EMPTY_FIELD,
        label: this.$i18n.t("conversation_creation.url_tab.url_label"),
        value: "",
        placeholder: "https://www.arte.tv/fr/videos/example",
        testField: testUrl,
      },
      fields: ["linkFields"],
    }
  },
  computed: {
    isYoutubeUrl() {
      return /(?:youtube\.com|youtu\.be)/i.test(this.linkFields.value)
    },
  },
  methods: {
    add_link(e) {
      e.preventDefault()
      if (this.testFields()) {
        this.$emit("input", this.linkFields.value)
        this.linkFields.value = ""
      }
    },
  },
  components: { FormInput, NotificationBanner },
}
</script>
<style scoped>
.url-helper-text {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin: 0;
}
</style>
