import { orgaRoleMixin } from "@/mixins/orgaRole.js"

// Who may buy live minutes, wherever the live credit runs out (the purchase
// itself is PackPurchaseModal).
export const livePackPurchaseMixin = {
  mixins: [orgaRoleMixin],
  computed: {
    // Org admins only, and not while impersonating, where it is read-only
    canBuyLivePack() {
      return (
        this.isAdmin &&
        !this.$store.getters["organizations/isImpersonatingCurrentOrganization"]
      )
    },
  },
}
