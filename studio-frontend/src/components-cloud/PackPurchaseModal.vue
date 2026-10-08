<template>
  <PackPickerModal
    v-model="isOpen"
    :packs="offeredPacks"
    :loading="isLoadingCatalog || isRedirecting"
    @submit="buyPack" />
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import PackPickerModal from "@/components-cloud/PackPickerModal.vue"
import { computeCheckoutReturnUrl } from "@/tools/computeCheckoutReturnUrl"

// Buys a prepaid pack from anywhere: picks it, then leaves for the Stripe
// Checkout, which comes back to returnUrl (the router tells the outcome).
// Emits cancel when closed without leaving for the payment page.
export default {
  name: "PackPurchaseModal",
  components: { PackPickerModal },
  props: {
    value: { type: Boolean, default: false },
    // Kind of pack offered (live, transcription), every kind when null
    kind: { type: String, default: null },
    // Where Stripe sends the browser back to, the current page when null
    returnUrl: { type: String, default: null },
  },
  data() {
    return {
      isLoadingCatalog: false,
      // Kept open on the way to Stripe: the page is about to be left
      isRedirecting: false,
    }
  },
  computed: {
    ...mapGetters("billing", ["purchasablePacks"]),
    offeredPacks() {
      if (!this.kind) return this.purchasablePacks
      return this.purchasablePacks.filter((pack) => pack.kind === this.kind)
    },
    isOpen: {
      get() {
        return this.value || this.isRedirecting
      },
      set(isOpen) {
        if (this.isRedirecting) return
        this.$emit("input", isOpen)
        if (!isOpen) this.$emit("cancel")
      },
    },
  },
  watch: {
    value: {
      handler(isOpen) {
        if (isOpen) this.loadCatalog()
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions("billing", ["loadPackCatalog", "startPackCheckout"]),
    async loadCatalog() {
      this.isLoadingCatalog = true
      await this.loadPackCatalog()
      this.isLoadingCatalog = false
    },
    async buyPack(packKey) {
      this.isRedirecting = true
      const checkoutUrl = await this.startPackCheckout({
        packKey,
        returnUrl:
          this.returnUrl ?? computeCheckoutReturnUrl(window.location.href),
      })
      if (checkoutUrl) {
        window.location.assign(checkoutUrl)
        return
      }
      this.isRedirecting = false
      this.$store.dispatch(
        "system/showError",
        this.$t("billing.settings.stripe_error"),
      )
      this.$emit("input", false)
      this.$emit("cancel")
    },
  },
}
</script>
