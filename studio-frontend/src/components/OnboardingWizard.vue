<template>
  <IsCloud>
    <BareModal
      v-model="isOpen"
      :size="step === 'plan' ? 'xl' : 'md'"
      :aria-label="$t('onboarding.welcome_title')"
      :overlay-close="canDismiss"
      :cancel-on-escape="canDismiss">
      <OnboardingPlanStep
        v-if="step === 'plan'"
        :title="title"
        :subtitle="subtitle"
        :billing-period="billingPeriod"
        :selected-plan="selectedPlan"
        :loading="checkoutLoading"
        :error="checkoutError"
        @change-period="billingPeriod = $event"
        @select-plan="selectPlan"
        @cancel="isOpen = false"
        @confirm="confirmPlan" />
      <OnboardingOrganizationStep
        v-else-if="step === 'organization' && businessPlan"
        :plan="businessPlan"
        :billing-period="billingPeriod"
        :draft="organizationDraft"
        :loading="checkoutLoading"
        :error="checkoutError"
        :can-change-plan="!upgradePlanKey"
        @back="backToPlans"
        @cancel="isOpen = false"
        @submit="checkoutBusiness" />
      <OnboardingReactivationStep
        v-else-if="step === 'reactivation' && reactivationDefaults"
        :plan="businessPlan"
        :organization-name="currentOrganizationName"
        :billing-period="billingPeriod"
        :default-seats="reactivationSeats || reactivationDefaults.seats"
        :min-seats="reactivationDefaults.minSeats"
        :loading="checkoutLoading"
        :error="checkoutError"
        @change-period="billingPeriod = $event"
        @cancel="isOpen = false"
        @submit="checkoutReactivation" />
      <OnboardingPaymentStep
        v-else-if="step === 'payment'"
        :plan-key="selectedPlan"
        :organization-id="checkoutOrganizationId"
        :wait-for="paymentWaitFor"
        :organization-name="organizationDraft.organizationName"
        @activated="clearCheckoutDraft"
        @open-organization="openOrganization"
        @close="isOpen = false" />
    </BareModal>
  </IsCloud>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
import IsCloud from "@/components/atoms/IsCloud.vue"
import BareModal from "@/components/molecules/BareModal.vue"
import OnboardingPlanStep from "@/components/OnboardingWizard.d/OnboardingPlanStep.vue"
import OnboardingOrganizationStep from "@/components/OnboardingWizard.d/OnboardingOrganizationStep.vue"
import OnboardingReactivationStep from "@/components/OnboardingWizard.d/OnboardingReactivationStep.vue"
import OnboardingPaymentStep from "@/components/OnboardingWizard.d/OnboardingPaymentStep.vue"
import {
  writeCheckoutDraft,
  readCheckoutDraft,
  clearCheckoutDraft,
} from "@/components/OnboardingWizard.d/checkoutDraft.js"
import { apiCreateCheckout } from "@/api/cloud.js"
import { computeCheckoutReturnUrl } from "@/tools/billing/computeCheckoutReturnUrl"
import { computeReactivationDefaults } from "@/tools/billing/computeReactivationDefaults"

const CHECKOUT_INTERVAL = { monthly: "month", annual: "year" }
const EMPTY_ORGANIZATION_DRAFT = { organizationName: "", seats: null }

export default {
  name: "OnboardingWizard",
  components: {
    IsCloud,
    BareModal,
    OnboardingPlanStep,
    OnboardingOrganizationStep,
    OnboardingReactivationStep,
    OnboardingPaymentStep,
  },
  props: {
    title: { type: String, default: null },
    subtitle: { type: String, default: null },
  },
  data() {
    return {
      step: "plan", // plan | organization | reactivation | payment
      billingPeriod: "monthly",
      selectedPlan: "premium",
      organizationDraft: { ...EMPTY_ORGANIZATION_DRAFT },
      // Org the last checkout was started for, restored on return from Stripe
      checkoutOrganizationId: null,
      // Step the last checkout was started from, restored on return from Stripe
      checkoutStep: null,
      // Seats asked on the reactivation step, kept apart from a new org draft
      reactivationSeats: null,
      checkoutLoading: false,
      checkoutError: "",
    }
  },
  computed: {
    ...mapGetters("user", ["needsOnboarding", "getUserId"]),
    ...mapGetters("billing", [
      "plans",
      "subscriptions",
      "upgradeModalOpen",
      "upgradePlanKey",
      "reactivationRequested",
    ]),
    ...mapGetters("organizations", [
      "getOrganizationsAsArray",
      "getCurrentOrganizationScope",
      "getCurrentOrganizationUsers",
      "getCurrentOrganizationAllUsers",
    ]),
    ...mapGetters("organizations", {
      currentOrganizationName: "getCurrentOrganizationDisplayName",
    }),
    ...mapGetters("system", { appLoading: "isLoading" }),
    // Shown for a brand-new account (server truth, can't be dismissed) or
    // whenever something asks to upgrade (footer button, quota/feature gate,
    // subscription page, return from Stripe). Held back while the app loader
    // is up: needsOnboarding can flip true before the plan catalog is loaded.
    showWizard() {
      return !this.appLoading && (this.needsOnboarding || this.upgradeModalOpen)
    },
    // BareModal's v-model. Derived from the store so every closing path
    // (Cancel, overlay, Escape, Free plan) goes through the same setter.
    isOpen: {
      get() {
        return this.showWizard
      },
      set(value) {
        if (value) return
        this.closeUpgradeModal()
        this.dismissOnboarding()
        this.step = "plan"
        this.checkoutError = ""
      },
    },
    canDismiss() {
      return !this.needsOnboarding && !this.checkoutLoading
    },
    businessPlan() {
      return this.plans.find((plan) => plan.planKey === "business") || null
    },
    // Seats and period the reactivation of Business starts from, null until
    // the catalog is loaded
    reactivationDefaults() {
      if (!this.businessPlan) return null
      return computeReactivationDefaults({
        plan: this.businessPlan,
        subscriptions: this.subscriptions,
        members: this.reactivationMembers,
      })
    },
    // The API counts API keys as collaborators too: the full list once loaded
    // (billing/openReactivationModal), the human members until then
    reactivationMembers() {
      return this.getCurrentOrganizationAllUsers.length
        ? this.getCurrentOrganizationAllUsers
        : this.getCurrentOrganizationUsers
    },
    // A Business org bought with its plan shows up once paid; any other
    // checkout switches an existing org to the plan.
    paymentWaitFor() {
      return this.checkoutStep === "organization" ? "organization" : "plan"
    },
    personalOrganizationId() {
      return (
        this.getOrganizationsAsArray.find(
          (org) => org.personal && org.owner === this.getUserId,
        )?._id ?? null
      )
    },
  },
  watch: {
    // Stripe sends the browser back with ?type=subscription&status=…
    "$route.query.status": {
      handler() {
        this.resumeFromCheckout()
      },
      immediate: true,
    },
    upgradePlanKey(planKey) {
      if (planKey) this.openOnPlan(planKey)
    },
    reactivationRequested(requested) {
      if (requested) this.openReactivation()
    },
  },
  methods: {
    ...mapActions("billing", ["openUpgradeModal", "closeUpgradeModal"]),
    ...mapActions("user", ["dismissOnboarding"]),
    ...mapActions("organizations", ["loadCurrentOrganizationAllUsers"]),
    clearCheckoutDraft,
    selectPlan(planKey) {
      this.selectedPlan = planKey
      this.checkoutError = ""
    },
    confirmPlan() {
      switch (this.selectedPlan) {
        case "free_payg":
          this.isOpen = false
          break
        case "business":
          this.checkoutError = ""
          this.step = "organization"
          break
        default:
          this.checkoutCurrentOrganization()
      }
    },
    // Business has its own step (organization name, seats); any other plan
    // is simply preselected in the list.
    openOnPlan(planKey) {
      this.selectPlan(planKey)
      this.step = planKey === "business" ? "organization" : "plan"
    },
    // The current org lost Business (billing/locked): buy it back for that
    // same org, on the seats and the period it had.
    openReactivation() {
      this.selectPlan("business")
      this.billingPeriod = this.reactivationDefaults.billingPeriod
      this.reactivationSeats = this.reactivationDefaults.seats
      this.step = "reactivation"
    },
    backToPlans(draft) {
      this.organizationDraft = draft
      this.checkoutError = ""
      this.step = "plan"
    },
    // Premium goes to the organization the wizard was opened from; the API
    // refuses a team organization (plan_requires_personal_organization). On a
    // brand-new account there is no current org yet: the personal one.
    checkoutCurrentOrganization() {
      const organizationId =
        this.getCurrentOrganizationScope || this.personalOrganizationId
      if (!organizationId) {
        this.checkoutError = this.$t("onboarding.checkout.errors.default")
        return
      }
      this.startCheckout({ organizationId })
    },
    checkoutBusiness(draft) {
      this.organizationDraft = draft
      this.startCheckout({
        organizationName: draft.organizationName,
        seats: draft.seats,
      })
    },
    checkoutReactivation(seats) {
      this.reactivationSeats = seats
      this.startCheckout({
        organizationId: this.getCurrentOrganizationScope,
        seats,
      })
    },
    async startCheckout(target) {
      this.checkoutLoading = true
      this.checkoutError = ""
      const { url, organizationId, errorCode } = await apiCreateCheckout({
        ...target,
        planKey: this.selectedPlan,
        interval: CHECKOUT_INTERVAL[this.billingPeriod],
        returnUrl: computeCheckoutReturnUrl(window.location.href),
      })
      if (url) {
        writeCheckoutDraft({
          planKey: this.selectedPlan,
          billingPeriod: this.billingPeriod,
          organizationId,
          organization: this.organizationDraft,
          checkoutStep: this.step,
          reactivationSeats: this.reactivationSeats,
        })
        window.location.assign(url)
        return
      }
      this.checkoutLoading = false
      this.checkoutError = this.translateCheckoutError(errorCode)
    },
    translateCheckoutError(errorCode) {
      const key = `onboarding.checkout.errors.${errorCode}`
      return errorCode && this.$te(key)
        ? this.$t(key)
        : this.$t("onboarding.checkout.errors.default")
    },
    resumeFromCheckout() {
      const { type, status, ...query } = this.$route.query
      if (type !== "subscription" || !status) return
      this.$router.replace({ query }).catch(() => {})
      const draft = readCheckoutDraft()
      if (!draft) return

      this.selectedPlan = draft.planKey
      this.billingPeriod = draft.billingPeriod
      this.checkoutOrganizationId = draft.organizationId ?? null
      // Drafts written before checkoutStep existed: Business meant a new org
      this.checkoutStep =
        draft.checkoutStep ??
        (draft.planKey === "business" ? "organization" : "plan")
      this.organizationDraft = draft.organization || {
        ...EMPTY_ORGANIZATION_DRAFT,
      }
      this.reactivationSeats = draft.reactivationSeats ?? null
      if (status === "success") {
        this.step = "payment"
        // Onboarding ends on a paid plan only: a canceled checkout brings the
        // first-run wizard back (Free selectable, not dismissable).
        this.dismissOnboarding()
      } else {
        clearCheckoutDraft()
        this.step = this.checkoutStep
        // The page reloaded: the seat floor counts API keys once loaded again
        if (this.checkoutStep === "reactivation") {
          this.loadCurrentOrganizationAllUsers({ forceRefresh: true })
        }
        this.checkoutError = this.$t("onboarding.checkout.canceled")
      }
      this.openUpgradeModal()
    },
    openOrganization(organizationId) {
      this.isOpen = false
      this.$router
        .push({ name: "explore", params: { organizationId } })
        .catch(() => {})
    },
  },
}
</script>
