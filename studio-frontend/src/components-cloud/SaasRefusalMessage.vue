<template>
  <p class="saas-refusal flex align-center gap-small" role="alert">
    <PhIcon name="warning" size="sm" class="no-shrink" />
    <span>{{ messageText }}</span>
  </p>
</template>

<script>
// The line explaining a SaaS refusal, above the form's submit row. Its call to
// action lives beside the submit button (SaasRefusalAction).
export default {
  name: "SaasRefusalMessage",
  props: {
    // saasRefusalView of saasRefusalFormMixin
    refusal: { type: Object, required: true },
  },
  computed: {
    messageText() {
      return this.refusal.messages
        .map((message) => this.$t(message.key, message.params))
        .join(" ")
    },
  },
}
</script>

<style lang="scss" scoped>
.saas-refusal {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--warning-text);
}
</style>
