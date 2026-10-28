<template>
  <NotificationBanner variant="warning" icon="warning" align="start">
    <div class="m-credit-banner">
      <strong>{{ $t("mobile.record.credit_exhausted_title") }}</strong>
      <p>
        {{
          resetAt
            ? $t("mobile.record.credit_exhausted_until", { date: resetLabel })
            : $t("mobile.record.credit_exhausted")
        }}
      </p>
      <p>{{ $t("mobile.record.credit_exhausted_upgrade") }}</p>
    </div>
  </NotificationBanner>
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

// Top of the Record page once the transcription minutes are spent:
// recording stays possible, the recordings wait on the phone.
export default {
  name: "TranscriptionCreditBanner",
  components: { NotificationBanner },
  props: {
    // When the plan quota renews; null when it does not
    resetAt: { type: String, default: null },
  },
  computed: {
    resetLabel() {
      return new Intl.DateTimeFormat(this.$i18n.locale, {
        day: "numeric",
        month: "long",
      }).format(new Date(this.resetAt))
    },
  },
}
</script>

<style scoped>
.m-credit-banner {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
}

.m-credit-banner p {
  margin: 0;
  font-size: var(--m-font-size-sm);
}
</style>
