import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { computeSaasRefusal } from "@/tools/computeSaasRefusal"
import { formatFullDate } from "@/tools/formatFullDate"

// State of a form refused by the SaaS (402/403): the raw response body set by
// the form, and what to show for it (SaasRefusalMessage above the submit row,
// SaasRefusalAction beside the submit button). While a purchase can lift the
// refusal, it becomes the primary action and the submit button steps back.
export const saasRefusalFormMixin = {
  mixins: [orgaRoleMixin],
  data() {
    return {
      // Response body of the refused request, null when nothing is refused
      saasRefusal: null,
    }
  },
  computed: {
    saasRefusalView() {
      return computeSaasRefusal(this.saasRefusal, {
        isAdmin: this.isAdmin,
        // Premium, the one self-serve upgrade, is sold to personal orgs only
        canBuyPlan:
          this.$store.getters["billing/isFree"] &&
          this.$store.getters["organizations/getCurrentOrganization"]
            ?.personal === true,
        fileName: this.saasRefusalFileName,
        importResetLabel: this.saasRefusalResetLabel,
      })
    },
    hasSaasRefusalPurchase() {
      const action = this.saasRefusalView?.action
      return action === "buy_pack" || action === "plans"
    },
    // The refused file, worth naming only among several: a form uploading
    // files overrides it.
    saasRefusalFileName() {
      return null
    },
    saasRefusalResetLabel() {
      const meter = this.$store.getters["billing/meters"].find(
        (m) => m.key === "import.minutes",
      )
      return meter?.resetAt
        ? formatFullDate(meter.resetAt, this.$i18n.locale)
        : null
    },
  },
}
