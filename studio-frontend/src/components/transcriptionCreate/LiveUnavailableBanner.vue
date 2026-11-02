<template>
  <!-- Why going live isn't offered: no credit left, or no profile at all. -->
  <NotificationBanner variant="warning" icon="warning" align="start">
    <template v-if="isLiveCreditExhausted">
      {{ $t("quick_session.creation.only_offline_live_credit_exhausted") }}
      <template v-if="!canBuyLivePack">
        {{ $t("quick_session.creation.live_pack_ask_admin") }}
      </template>
    </template>
    <template v-else>
      {{ $t("quick_session.creation.only_offline_available") }}
    </template>
    <template v-if="isLiveCreditExhausted && canBuyLivePack" #actions>
      <Button
        type="button"
        variant="primary"
        size="sm"
        icon="plus"
        @click="isPurchaseOpen = true">
        {{ $t("billing.settings.buy_pack") }}
      </Button>
      <PackPurchaseModal v-model="isPurchaseOpen" kind="live" />
    </template>
  </NotificationBanner>
</template>
<script>
import { mapGetters } from "vuex"
import { livePackPurchaseMixin } from "@/mixins/livePackPurchase.js"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import PackPurchaseModal from "@/components-cloud/PackPurchaseModal.vue"

export default {
  name: "LiveUnavailableBanner",
  components: { NotificationBanner, PackPurchaseModal },
  mixins: [livePackPurchaseMixin],
  data() {
    return {
      isPurchaseOpen: false,
    }
  },
  computed: {
    ...mapGetters("billing", ["isLiveCreditExhausted"]),
  },
}
</script>
