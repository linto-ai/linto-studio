<template>
  <div class="error-page" visible>
    <h2 v-if="title">{{ title }}</h2>
    <div class="">
      <a
        href="https://github.com/linto-ai/platform-conversation-manager/issues/new/choose"
        target="_blank"
        ><span class="label">{{ $t("error.bug_report") }}</span></a
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    customTitle: { required: false, type: String },
  },
  computed: {
    title() {
      return this.customTitle || this.$t("error.title")
    },
  },
}
</script>
