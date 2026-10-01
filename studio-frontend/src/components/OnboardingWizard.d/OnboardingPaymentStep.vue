<template>
  <section class="onboarding-payment" aria-live="polite">
    <ph-icon
      class="onboarding-payment__icon"
      :name="status === 'ready' ? 'check-circle' : 'hourglass-medium'"
      size="xl"
      color="primary" />
    <h1 class="onboarding-payment__title">{{ title }}</h1>
    <p class="onboarding-payment__message">{{ message }}</p>
    <progress
      v-if="status === 'waiting'"
      class="onboarding-payment__progress"
      :aria-label="title" />

    <footer class="onboarding-payment__actions">
      <Button
        v-if="status === 'ready' && isBusiness"
        variant="primary"
        icon-right="arrow-right"
        @click="$emit('open-organization', organizationId)">
        {{ $t("onboarding.payment.open_organization") }}
      </Button>
      <Button
        v-else
        :variant="status === 'waiting' ? 'secondary' : 'primary'"
        @click="$emit('close')">
        {{ $t("onboarding.payment.close") }}
      </Button>
    </footer>
  </section>
</template>
<script>
const POLL_INTERVAL_MS = 2000
const POLL_MAX_ATTEMPTS = 15

// Checkout came back successful, but the subscription (and a Business org)
// only exists once Stripe's webhook has been processed: poll until it shows.
export default {
  name: "OnboardingPaymentStep",
  props: {
    planKey: { type: String, required: true },
    // The org the plan was bought for, as returned by the checkout: the
    // personal org (Premium) or the new org, hidden until the webhook (Business)
    organizationId: { type: String, default: null },
    organizationName: { type: String, default: "" },
  },
  data() {
    return {
      status: "waiting", // waiting | ready | timeout
      attempts: 0,
      timer: null,
    }
  },
  computed: {
    isBusiness() {
      return this.planKey === "business"
    },
    title() {
      return this.status === "ready"
        ? this.$t("onboarding.payment.ready_title")
        : this.$t("onboarding.payment.waiting_title")
    },
    message() {
      if (this.status === "waiting") {
        return this.$t(
          this.isBusiness
            ? "onboarding.payment.waiting_organization"
            : "onboarding.payment.waiting_plan",
        )
      }
      if (this.status === "timeout") {
        return this.$t("onboarding.payment.timeout")
      }
      return this.isBusiness
        ? this.$t("onboarding.payment.ready_organization", {
            name: this.organizationName,
          })
        : this.$t("onboarding.payment.ready_plan")
    },
  },
  mounted() {
    this.poll()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    async poll() {
      this.attempts += 1
      const done = this.isBusiness
        ? await this.findOrganization()
        : await this.isPlanActive()
      if (done) {
        this.status = "ready"
        this.$emit("activated")
        return
      }
      if (this.attempts >= POLL_MAX_ATTEMPTS) {
        this.status = "timeout"
        return
      }
      this.timer = setTimeout(() => this.poll(), POLL_INTERVAL_MS)
    },
    // Pending orgs are left out of the user's list until they are paid
    async findOrganization() {
      await this.$store.dispatch("organizations/fetchOrganizations")
      return !!this.$store.getters["organizations/getOrganizationById"](
        this.organizationId,
      )
    },
    async isPlanActive() {
      const usage = await this.$store.dispatch(
        "billing/fetchUsage",
        this.organizationId,
      )
      return usage?.planKey === this.planKey
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-payment {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  max-width: 30rem;
  margin: 0 auto;
  padding: 2.5rem 2rem 2rem;
  text-align: center;
}

.onboarding-payment__title {
  margin: 0;
  font-size: 1.35rem;
}

.onboarding-payment__message {
  margin: 0;
  color: var(--text-secondary);
}

.onboarding-payment__progress {
  width: 100%;
  max-width: 16rem;
}

.onboarding-payment__actions {
  margin-top: 0.75rem;
}
</style>
