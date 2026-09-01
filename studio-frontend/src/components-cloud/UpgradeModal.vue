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

      <ul class="upgrade-modal__features">
        <li>{{ $t("billing.feature.unlimited") }}</li>
        <li>{{ $t("billing.feature.collaboration") }}</li>
        <li>{{ $t("billing.feature.speaker_id") }}</li>
        <li>{{ $t("billing.feature.no_watermark") }}</li>
        <li>{{ $t("billing.feature.api") }}</li>
      </ul>

      <!-- Plan choice. The grid has a flat solo plan and a per-seat team plan;
           which ones exist is catalog data, never hardcoded here. Seats are
           derived server-side from membership, so there is nothing to enter. -->
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
        </button>
      </div>

      <div v-if="done" class="upgrade-modal__done">
        ✓ {{ $t("billing.upgrade_done") }}
      </div>

      <!-- Card step: shown only when the backend returns a Stripe clientSecret
           (real Stripe). Fake/local mode skips straight to done. -->
      <div v-else-if="step === 'card'" class="upgrade-modal__card-step">
        <p class="upgrade-modal__card-label">{{ $t("billing.card.label") }}</p>
        <div v-show="!cardFatal" ref="cardEl" class="upgrade-modal__card-input"></div>
        <p v-if="cardError" class="upgrade-modal__card-error">{{ cardError }}</p>
        <div class="upgrade-modal__actions">
          <Button variant="secondary" @click="$emit('close')">{{
            $t("billing.cancel")
          }}</Button>
          <!-- Pay only once the card field actually mounted; if it could not be
               initialized (Stripe.js load/mount failure) the user closes — the
               incomplete subscription auto-expires on Stripe. -->
          <Button
            v-if="cardReady"
            variant="primary"
            :loading="busy"
            @click="pay">
            {{ $t("billing.card.pay") }}
          </Button>
        </div>
      </div>

      <!-- Billing-profile step (live mode): legal details for compliant invoices. -->
      <div v-else-if="step === 'billing'" class="upgrade-modal__billing">
        <p class="upgrade-modal__card-label">
          {{ $t("billing.billing_profile.label") }}
        </p>
        <input
          v-model="billing.legalName"
          class="upgrade-modal__field"
          :placeholder="$t('billing.billing_profile.legal_name')" />
        <input
          v-model="billing.address.line1"
          class="upgrade-modal__field"
          :placeholder="$t('billing.billing_profile.address_line1')" />
        <div class="upgrade-modal__field-row">
          <input
            v-model="billing.address.postal_code"
            class="upgrade-modal__field"
            :placeholder="$t('billing.billing_profile.postal_code')" />
          <input
            v-model="billing.address.city"
            class="upgrade-modal__field"
            :placeholder="$t('billing.billing_profile.city')" />
          <input
            v-model="billing.address.country"
            maxlength="2"
            class="upgrade-modal__field upgrade-modal__field--country"
            :placeholder="$t('billing.billing_profile.country')" />
        </div>
        <input
          v-model="billing.vatId"
          class="upgrade-modal__field"
          :placeholder="$t('billing.billing_profile.vat_id')" />
        <p v-if="billingError" class="upgrade-modal__card-error">{{ billingError }}</p>
        <div class="upgrade-modal__actions">
          <Button variant="secondary" @click="$emit('close')">{{
            $t("billing.cancel")
          }}</Button>
          <Button
            variant="primary"
            :loading="busy"
            :disabled="
              !billing.legalName ||
              !billing.address.line1 ||
              !billing.address.postal_code ||
              !billing.address.city ||
              !billing.address.country
            "
            @click="submitBilling">
            {{ $t("billing.billing_profile.continue") }}
          </Button>
        </div>
      </div>

      <div class="upgrade-modal__actions" v-else>
        <Button variant="secondary" @click="$emit('close')">{{
          $t("billing.cancel")
        }}</Button>
        <Button variant="primary" :loading="busy" @click="confirm">{{
          $t("billing.confirm_upgrade")
        }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Button from "@/components/atoms/Button.vue"
import { getStripe, hasStripeKey } from "@/tools/loadStripe"

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
      step: "pitch", // pitch -> (billing) -> (card) -> done
      clientSecret: null,
      stripe: null,
      cardElement: null,
      cardError: "",
      cardReady: false, // card Element actually mounted
      cardFatal: false, // mount failed -> no payment possible, offer close
      // Legal billing profile (live mode only) -> pushed to the Stripe customer
      // so invoices are compliant. Required before createSubscription when
      // automatic_tax is on (and good practice regardless).
      billing: {
        legalName: "",
        address: { line1: "", line2: "", postal_code: "", city: "", country: "FR" },
        vatId: "",
      },
      billingError: "",
      selectedPlanKey: null,
    }
  },
  computed: {
    ...mapGetters("billing", ["paidPlans"]),
    ...mapGetters("organizations", { orgScope: "getCurrentOrganizationScope" }),
    contextMessage() {
      if (!this.reason) return ""
      if (this.reason.reason === "quota_exceeded") {
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
    ...mapActions("billing", ["upgrade", "fetchPlans", "refresh", "saveBillingProfile"]),
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
      // Live mode: collect the legal billing profile BEFORE subscribing (required
      // for compliant invoices / automatic_tax). Fake/local mode: subscribe now.
      if (hasStripeKey()) {
        this.step = "billing"
        return
      }
      this.busy = true
      try {
        const result = await this.upgrade({ planKey: this.selectedPlanKey })
        if (!result) return
        this.finishDone()
      } finally {
        this.busy = false
      }
    },
    async submitBilling() {
      this.busy = true
      this.billingError = ""
      try {
        // sendRequest resolves with { status: "error" } on an HTTP failure (it
        // never throws), so a swallowed failure must NOT fall through to upgrade.
        // The route returns { ok: true } on success -> require that explicitly.
        const saved = await this.saveBillingProfile({
          legalName: this.billing.legalName,
          address: { ...this.billing.address },
          ...(this.billing.vatId
            ? { vatId: { type: "eu_vat", value: this.billing.vatId } }
            : {}),
        })
        if (!saved || saved.ok !== true) {
          this.billingError = this.$t("billing.billing_profile.error")
          return
        }
        const result = await this.upgrade({ planKey: this.selectedPlanKey })
        if (!result) {
          // Subscription creation failed (also a swallowed sendRequest error);
          // surface it instead of leaving the modal silently stuck.
          this.billingError = this.$t("billing.billing_profile.error")
          return
        }
        // Real Stripe returns a clientSecret (PaymentIntent) to confirm with a
        // card; otherwise activate immediately.
        if (result.clientSecret && hasStripeKey()) {
          this.clientSecret = result.clientSecret
          this.step = "card"
          await this.$nextTick()
          await this.mountCard()
        } else {
          this.finishDone()
        }
      } catch (e) {
        this.billingError = (e && e.message) || this.$t("billing.billing_profile.error")
      } finally {
        this.busy = false
      }
    },
    async mountCard() {
      try {
        this.stripe = await getStripe()
        if (!this.stripe) {
          // No Stripe.js / key after all -> treat the (already-created) sub as done.
          this.finishDone()
          return
        }
        const elements = this.stripe.elements()
        this.cardElement = elements.create("card")
        this.cardElement.mount(this.$refs.cardEl)
        this.cardElement.on("change", (e) => {
          this.cardError = e.error ? e.error.message : ""
        })
        this.cardReady = true
      } catch (e) {
        // Could not initialize the card field. Do NOT claim success (the
        // subscription is still incomplete and will auto-expire on Stripe).
        // Surface the error and offer only Close (cardReady stays false).
        this.cardFatal = true
        this.cardError = e.message || this.$t("billing.card.init_error")
      }
    },
    async pay() {
      if (!this.stripe || !this.cardElement || !this.clientSecret) return
      this.busy = true
      this.cardError = ""
      try {
        const { error } = await this.stripe.confirmCardPayment(
          this.clientSecret,
          { payment_method: { card: this.cardElement } },
        )
        if (error) {
          this.cardError = error.message
          return
        }
        // Payment succeeded; the webhook (invoice.paid / subscription.updated)
        // flips the subscription to active server-side. Refresh (explicit org)
        // to reflect it regardless of where the modal was opened.
        await this.refresh(this.orgScope)
        this.finishDone()
      } finally {
        this.busy = false
      }
    },
    finishDone() {
      this.step = "done"
      this.done = true
      setTimeout(() => this.$emit("close"), 1400)
    },
  },
  beforeDestroy() {
    if (this.cardElement) {
      try {
        this.cardElement.unmount()
      } catch (e) {}
    }
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
    max-width: 380px;
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
  &__badge {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  &__title {
    margin: 0.2em 0 0.1em;
    font-size: 1.25rem;
  }
  &__sub {
    color: var(--neutral-70);
    font-size: 0.85rem;
    margin-bottom: 1em;
  }
  &__features {
    list-style: none;
    padding: 0;
    margin: 0 0 1em;
    li {
      padding: 0.25em 0 0.25em 1.4em;
      position: relative;
      font-size: 0.88rem;
      &::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--success-color, #30a46c);
        font-weight: 700;
      }
    }
  }
  &__price {
    font-weight: 600;
    margin-bottom: 1em;
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
  &__card-step {
    margin-top: 0.5em;
  }
  &__card-label {
    font-size: 0.82rem;
    color: var(--neutral-70);
    margin: 0 0 0.4em;
  }
  &__card-input {
    border: 1px solid var(--neutral-40);
    border-radius: 6px;
    padding: 0.7em 0.6em;
    margin-bottom: 0.6em;
    background: var(--neutral-0, #fff);
  }
  &__card-error {
    color: var(--error-color, #e5484d);
    font-size: 0.8rem;
    margin: 0 0 0.6em;
  }
  &__billing {
    margin-top: 0.5em;
  }
  &__field {
    width: 100%;
    border: 1px solid var(--neutral-40);
    border-radius: 6px;
    padding: 0.55em 0.6em;
    margin-bottom: 0.5em;
    font-size: 0.88rem;
  }
  &__field-row {
    display: flex;
    gap: 0.5em;
  }
  &__field--country {
    max-width: 70px;
    text-transform: uppercase;
  }
}
</style>
