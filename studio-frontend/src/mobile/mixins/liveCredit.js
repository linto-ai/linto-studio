import { ORGANIZATION_ROLES } from "@/const/organizationRoles"
import { refreshLiveCredit } from "@/mobile/services/billing/refreshLiveCredit.js"
import { waitForLiveCredit } from "@/mobile/services/billing/waitForLiveCredit.js"
import { computeCheckoutReturn } from "@/tools/billing/computeCheckoutReturn"
import { computeCheckoutReturnUrl } from "@/tools/billing/computeCheckoutReturnUrl"
import { isLiveCreditBelowAdmission } from "@/tools/billing/isLiveCreditBelowAdmission"
import { computePackGroups } from "@/tools/billing/pack/computePackGroups"
import { getEnv } from "@/tools/getEnv"
import { leavePageFor } from "@/tools/leavePageFor"

// The organization's prepaid live minutes on the live pages (preparation,
// running live): the balance, the live packs an admin may buy (Stripe
// Checkout, back on the same page), and the wait for the credit once paid.
// Expects liveOrganizationId from the host.
export const liveCreditMixin = {
  data() {
    return {
      liveCreditLoading: true,
      buyingPack: false,
      packSheetOpen: false,
    }
  },
  computed: {
    // The prepaid live minutes, when the instance counts them (cloud, metered
    // organization); null otherwise
    meteredLive() {
      const live = this.$store.getters["billing/live"]
      return live && !live.unmetered ? live : null
    },
    // Too few minutes left to start a live, even without translation
    liveCreditExhausted() {
      return isLiveCreditBelowAdmission(this.meteredLive)
    },
    // Only an admin pays: the server refuses a checkout to anyone else
    isOrganizationAdmin() {
      return (
        this.$store.getters["organizations/getUserRoleInOrganization"] ===
        ORGANIZATION_ROLES.ADMINISTRATOR
      )
    },
    // Live packs of the organization's plan, smallest first
    livePacks() {
      const groups = computePackGroups(
        this.$store.getters["billing/purchasablePacks"],
      )
      return groups.find((group) => group.kind === "live")?.packs ?? []
    },
    canBuyLivePack() {
      return this.isOrganizationAdmin && this.livePacks.length > 0
    },
  },
  async created() {
    await this.loadLiveCredit()
    this.liveCreditLoading = false
    this.consumeCheckoutReturn()
  },
  methods: {
    loadLiveCredit() {
      if (getEnv("VUE_APP_MODE") !== "cloud") return null
      return Promise.all([
        refreshLiveCredit(this.$store, this.liveOrganizationId),
        this.isOrganizationAdmin
          ? this.$store.dispatch("billing/loadPackCatalog")
          : null,
      ])
    },
    async buyLivePack(packKey) {
      this.buyingPack = true
      const checkoutUrl = await this.$store.dispatch(
        "billing/startPackCheckout",
        {
          packKey,
          orgId: this.liveOrganizationId,
          returnUrl: computeCheckoutReturnUrl(window.location.href),
        },
      )
      if (checkoutUrl) {
        await leavePageFor(checkoutUrl)
      } else {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.live.buy_failed"),
        )
      }
      this.buyingPack = false
    },
    // Back from Stripe (?type=credits&status=…): told once, then the balance
    // is reloaded until the webhook credits the pack
    async consumeCheckoutReturn() {
      const checkoutReturn = computeCheckoutReturn(this.$route.query)
      if (checkoutReturn?.type !== "credits") return
      this.$router.replace({ query: checkoutReturn.query }).catch(() => {})
      if (checkoutReturn.status !== "success") {
        this.$store.dispatch(
          "system/showInfo",
          this.$t("billing.settings.pack_cancelled"),
        )
        return
      }
      this.$store.dispatch(
        "system/showSuccess",
        this.$t("billing.settings.pack_bought"),
      )
      await waitForLiveCredit(this.$store, this.liveOrganizationId, {
        previousBalance: this.meteredLive?.balance ?? 0,
        isCancelled: () => this._isDestroyed,
      })
    },
  },
}
