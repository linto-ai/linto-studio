<template>
  <!-- What limits the transcription, and the purchase lifting it if any. -->
  <NotificationBanner
    variant="warning"
    icon="warning"
    align="start"
    role="alert">
    {{ messageText }}
    <template v-if="notice.action === 'buy_pack'" #actions>
      <Button
        type="button"
        variant="primary"
        size="sm"
        icon="plus"
        @click="isPurchaseOpen = true">
        {{ $t("billing.settings.buy_pack") }}
      </Button>
      <PackPurchaseModal
        v-model="isPurchaseOpen"
        :kind="notice.packKind"
        :returnUrl="returnUrl" />
    </template>
    <template v-else-if="notice.action === 'plans'" #actions>
      <Button
        type="button"
        variant="primary"
        size="sm"
        icon="sparkle"
        @click="openUpgradeModal(refusal)">
        {{ $t("billing.upgrade_cta") }}
      </Button>
    </template>
  </NotificationBanner>
</template>
<script>
import { mapActions } from "vuex"
import { computeTranscriptionCreateReturnUrl } from "@/tools/transcriptionCreate/computeTranscriptionCreateReturnUrl.js"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import PackPurchaseModal from "@/components-cloud/PackPurchaseModal.vue"

export default {
  name: "SourceNoticeBanner",
  components: { NotificationBanner, PackPurchaseModal },
  props: {
    // See computeSourceNotice
    notice: { type: Object, required: true },
    // Response body of the refusal behind the notice, context for the upgrade
    refusal: { type: Object, default: null },
  },
  data() {
    return {
      isPurchaseOpen: false,
      returnUrl: computeTranscriptionCreateReturnUrl(window.location.href),
    }
  },
  computed: {
    messageText() {
      return this.notice.messages
        .map((message) => this.$t(message.key, message.params))
        .join(" ")
    },
  },
  methods: {
    ...mapActions("billing", ["openUpgradeModal"]),
  },
}
</script>
