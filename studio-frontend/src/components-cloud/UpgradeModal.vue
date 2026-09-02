<template>
  <div class="upgrade-modal" @click.self="$emit('close')">
    <div class="upgrade-modal__card">
      <button
        class="upgrade-modal__close"
        :aria-label="$t('billing.cancel')"
        @click="$emit('close')">
        ×
      </button>

      <h2 class="upgrade-modal__title">{{ $t("billing.upgrade_title") }}</h2>
      <p class="upgrade-modal__sub">{{ $t("billing.upgrade_subtitle") }}</p>
      <p v-if="contextMessage" class="upgrade-modal__context">
        {{ contextMessage }}
      </p>

      <!-- Plan choice, from the catalog. Seats are derived server-side from
           membership, so there is nothing to enter. -->
      <div class="upgrade-modal__plans">
        <button
          v-for="p in paidPlans"
          :key="p.planKey"
          type="button"
          class="upgrade-modal__plan"
          :class="{ selected: p.planKey === selectedPlanKey }"
          @click="selectedPlanKey = p.planKey">
          <span class="upgrade-modal__plan-name">{{ p.displayName }}</span>
          <span class="upgrade-modal__plan-price">{{ priceLabel(p) }}</span>
          <span class="upgrade-modal__plan-desc">{{ p.description }}</span>
        </button>
      </div>

      <div v-if="done" class="upgrade-modal__done">
        ✓ {{ $t("billing.upgrade_done", { plan: selectedPlanLabel }) }}
      </div>

      <!-- Real Stripe returns a client_secret to confirm a payment. The card
           form is gone (Checkout takes over in J2): say so instead of paying. -->
      <div v-else-if="pendingPayment" class="upgrade-modal__notice">
        {{ $t("billing.upgrade_pending_payment") }}
        <div class="upgrade-modal__actions">
          <Button variant="secondary" @click="$emit('close')">{{
            $t("billing.cancel")
          }}</Button>
        </div>
      </div>

      <div class="upgrade-modal__actions" v-else>
        <Button variant="secondary" @click="$emit('close')">{{
          $t("billing.cancel")
        }}</Button>
        <Button
          variant="primary"
          :loading="busy"
          :disabled="!selectedPlanKey"
          @click="confirm"
          >{{ $t("billing.confirm_upgrade") }}</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "UpgradeModal",
  components: { Button },
  props: {
    // Optional gating detail ({ reason, capability, remaining }) when opened
    // from a 402/403 response, to show a contextual line.
    reason: { type: Object, default: null },
  },
  data() {
    return {
      busy: false,
      done: false,
      pendingPayment: false,
      selectedPlanKey: null,
    }
  },
  computed: {
    ...mapGetters("billing", ["paidPlans"]),
    selectedPlanLabel() {
      const p = this.paidPlans.find((x) => x.planKey === this.selectedPlanKey)
      return p ? p.displayName : ""
    },
    contextMessage() {
      if (!this.reason) return ""
      if (
        this.reason.reason === "quota_exceeded" ||
        this.reason.reason === "credit_exhausted"
      ) {
        return this.$t("billing.limit_reached")
      }
      if (this.reason.reason === "feature_disabled") {
        return this.$t("billing.feature_locked")
      }
      return ""
    },
  },
  watch: {
    // Default to the cheapest paid plan as soon as the catalog lands.
    paidPlans: {
      immediate: true,
      handler(plans) {
        if (!this.selectedPlanKey && plans.length) {
          this.selectedPlanKey = plans[0].planKey
        }
      },
    },
  },
  mounted() {
    if (!this.paidPlans.length) this.fetchPlans()
  },
  methods: {
    ...mapActions("billing", ["subscribe", "fetchPlans"]),
    priceLabel(plan) {
      const cents = plan?.pricing?.amountCents
      if (!cents) return ""
      let price
      try {
        price = new Intl.NumberFormat(this.$i18n?.locale || "fr-FR", {
          style: "currency",
          currency: (plan.pricing.currency || "eur").toUpperCase(),
          maximumFractionDigits: 0,
        }).format(cents / 100)
      } catch (e) {
        price = `${cents / 100} €`
      }
      return plan.pricing.perSeat
        ? this.$t("billing.price_per_seat", { price })
        : this.$t("billing.price_flat", { price })
    },
    async confirm() {
      if (!this.selectedPlanKey) return
      this.busy = true
      try {
        const result = await this.subscribe({ planKey: this.selectedPlanKey })
        if (!result) return
        if (result.clientSecret) {
          this.pendingPayment = true
          return
        }
        this.done = true
        setTimeout(() => this.$emit("close"), 1400)
      } finally {
        this.busy = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.upgrade-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;

  &__card {
    position: relative;
    background: var(--neutral-0, #fff);
    border-radius: 10px;
    padding: 1.75em;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  }
  &__close {
    position: absolute;
    top: 0.5em;
    right: 0.6em;
    background: none;
    border: none;
    font-size: 1.6rem;
    line-height: 1;
    cursor: pointer;
    color: var(--neutral-60);
  }
  &__title {
    margin: 0.2em 0 0.1em;
    font-size: 1.25rem;
  }
  &__sub,
  &__context {
    color: var(--neutral-70);
    font-size: 0.85rem;
    margin-bottom: 0.75em;
  }
  &__plans {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-bottom: 1em;
  }
  &__plan {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15em;
    text-align: left;
    font: inherit;
    cursor: pointer;
    padding: 0.7em 0.9em;
    border: 1px solid var(--neutral-40);
    border-radius: 8px;
    background: var(--neutral-0, #fff);
    &.selected {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color);
    }
  }
  &__plan-name {
    font-weight: 700;
  }
  &__plan-price {
    font-size: 0.85rem;
    color: var(--neutral-70);
  }
  &__plan-desc {
    font-size: 0.78rem;
    color: var(--neutral-60);
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
  }
  &__done {
    text-align: center;
    color: var(--success-color, #30a46c);
    font-weight: 600;
    padding: 0.5em 0;
  }
  &__notice {
    font-size: 0.88rem;
    color: var(--neutral-80);
    padding: 0.5em 0;
    .upgrade-modal__actions {
      margin-top: 0.75em;
    }
  }
}
</style>
